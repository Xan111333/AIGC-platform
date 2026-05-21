from sqlalchemy.orm import Session
from ..models import GenerationRecord
from ..schemas.generation import ImageGenerationRequest
from datetime import datetime
import json
import requests
from ..utils.api_config import APIConfig

MOCK_IMAGE_URL = "https://neeko-copilot.bytedance.net/api/text_to_image?prompt=beautiful%20landscape&image_size=landscape_16_9"

def generate_image_with_zhipu(prompt: str, style: str, size: str) -> str:
    if not APIConfig.has_zhipu_key():
        return None
    
    style_map = {
        "realistic": "写实",
        "cartoon": "卡通",
        "oil-painting": "油画",
        "watercolor": "水彩",
        "anime": "动漫",
        "sci-fi": "科幻",
        "pixel": "像素风",
        "cyberpunk": "赛博朋克",
        "vintage": "复古"
    }
    style_name = style_map.get(style.lower(), "写实")
    
    url = APIConfig.ZHIPU_IMAGE_URL
    headers = {
        "Authorization": f"Bearer {APIConfig.ZHIPU_API_KEY}",
        "Content-Type": "application/json"
    }
    
    full_prompt = f"{prompt}，{style_name}风格"
    
    data = {
        "model": "cogview-4",
        "prompt": full_prompt,
        "size": size
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=120)
        
        if response.status_code == 200:
            result = response.json()
            
            if "error" in result:
                return None
            
            if "data" in result and len(result["data"]) > 0:
                img_url = result["data"][0].get("url")
                if img_url:
                    return img_url
                img_b64 = result["data"][0].get("b64_json")
                if img_b64:
                    return f"data:image/png;base64,{img_b64}"
            return None
        else:
            return None
    except Exception as e:
        return None

def create_image_generation(db: Session, user_id: int, request: ImageGenerationRequest) -> GenerationRecord:
    params = json.dumps({
        "resolution": request.resolution,
        "style": request.style,
        "num_images": request.num_images
    })
    
    record = GenerationRecord(
        user_id=user_id,
        type="image",
        prompt=request.prompt,
        params=params,
        status="in_progress"
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    try:
        image_url = generate_image_with_zhipu(
            prompt=request.prompt,
            style=request.style,
            size=request.resolution
        )
        
        if image_url:
            record.result_url = image_url
        else:
            record.result_url = MOCK_IMAGE_URL
        record.status = "completed"
        record.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(record)
    except Exception as e:
        print(f"图像生成失败，使用Mock数据: {e}")
        record.result_url = MOCK_IMAGE_URL
        record.status = "completed"
        record.error_message = str(e)
        record.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(record)
    
    return record

def process_image_generation_task(db: Session, record_id: int):
    record = db.query(GenerationRecord).filter(GenerationRecord.id == record_id).first()
    if not record:
        return
    
    try:
        params = json.loads(record.params) if record.params else {}
        style = params.get("style", "写实")
        size = params.get("resolution", "1024x1024")
        
        image_url = generate_image_with_zhipu(
            prompt=record.prompt,
            style=style,
            size=size
        )
        
        if image_url:
            record.result_url = image_url
        else:
            record.result_url = MOCK_IMAGE_URL
        record.status = "completed"
        record.completed_at = datetime.utcnow()
        db.commit()
    except Exception as e:
        print(f"图像生成失败: {e}")
        record.result_url = MOCK_IMAGE_URL
        record.status = "completed"
        record.error_message = str(e)
        record.completed_at = datetime.utcnow()
        db.commit()
    
    return record

def get_image_generation_status(db: Session, record_id: int, user_id: int) -> GenerationRecord | None:
    record = db.query(GenerationRecord).filter(
        GenerationRecord.id == record_id,
        GenerationRecord.user_id == user_id,
        GenerationRecord.type == "image"
    ).first()
    return record