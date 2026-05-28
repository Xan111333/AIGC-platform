from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..utils.api_config import APIConfig
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/video", tags=["视频生成"])


class VideoSubmitRequest(BaseModel):
    prompt: str
    style: str = "realistic"
    ratio: str = "16:9"


class VideoSubmitResponse(BaseModel):
    task_id: str = ""
    message: str = ""


class VideoTaskResponse(BaseModel):
    status: str = "UNKNOWN"
    video_url: str = ""
    message: str = ""


# 风格提示词映射
STYLE_MAP = {
    "realistic": "写实风格，真实感强，",
    "cartoon": "卡通动画风格，色彩鲜艳，",
    "sci-fi": "科幻风格，未来感，",
    "painting": "油画风格，艺术感，",
}

# 比例 → DashScope size 参数映射
RATIO_TO_SIZE = {
    "16:9": "1280*720",
    "9:16": "720*1280",
    "1:1": "960*960",
}


@router.post("/submit", response_model=VideoSubmitResponse)
async def submit_video_task(request: VideoSubmitRequest):
    """提交视频生成任务到 DashScope（阿里云通义 Wan2.1 模型）"""
    api_key = APIConfig.DASHSCOPE_API_KEY
    if not api_key:
        raise HTTPException(status_code=503, detail="后端未配置 DashScope API Key，请在环境变量中设置 DASHSCOPE_API_KEY")

    enhanced_prompt = (STYLE_MAP.get(request.style, "") + request.prompt).strip()
    if not enhanced_prompt:
        raise HTTPException(status_code=400, detail="提示词不能为空")

    size = RATIO_TO_SIZE.get(request.ratio, "1280*720")

    payload = {
        "model": "wan2.1-t2v-turbo",
        "input": {"prompt": enhanced_prompt},
        "parameters": {"size": size},
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                APIConfig.DASHSCOPE_VIDEO_URL,
                json=payload,
                headers=headers,
            )
            data = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="请求 DashScope 超时，请稍后重试")
    except Exception as e:
        logger.error(f"DashScope 请求异常: {e}")
        raise HTTPException(status_code=502, detail=f"请求 DashScope 失败: {str(e)}")

    if resp.status_code != 200:
        msg = data.get("message") or data.get("output", {}).get("message", "") or f"DashScope 返回错误 ({resp.status_code})"
        raise HTTPException(status_code=resp.status_code, detail=msg)

    task_id = data.get("output", {}).get("task_id", "")
    if not task_id:
        msg = data.get("message") or "提交任务失败，未获取到 task_id"
        raise HTTPException(status_code=500, detail=msg)

    return VideoSubmitResponse(task_id=task_id, message="任务已提交")


@router.get("/task/{task_id}", response_model=VideoTaskResponse)
async def query_video_task(task_id: str):
    """查询视频生成任务状态"""
    api_key = APIConfig.DASHSCOPE_API_KEY
    if not api_key:
        raise HTTPException(status_code=503, detail="后端未配置 DashScope API Key")

    url = f"{APIConfig.DASHSCOPE_TASK_URL}/{task_id}"
    headers = {"Authorization": f"Bearer {api_key}"}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, headers=headers)
            data = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="查询任务状态超时")
    except Exception as e:
        logger.error(f"DashScope 查询异常: {e}")
        raise HTTPException(status_code=502, detail=f"查询任务失败: {str(e)}")

    if resp.status_code != 200:
        msg = data.get("message") or f"查询失败 ({resp.status_code})"
        raise HTTPException(status_code=resp.status_code, detail=msg)

    output = data.get("output", {})
    return VideoTaskResponse(
        status=output.get("task_status", "UNKNOWN"),
        video_url=output.get("video_url", ""),
        message=output.get("message", ""),
    )
