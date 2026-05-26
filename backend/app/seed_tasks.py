"""
初始题目数据种子脚本
在数据库为空时自动插入默认实训题目
"""
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from ..models import Task
from sqlalchemy import select


DEFAULT_TASKS = [
    {
        "title": "AI文本生成：撰写一篇关于人工智能伦理的议论文",
        "description": "利用AI大语言模型，撰写一篇不少于800字的议论文，探讨人工智能技术在现代社会中的伦理问题，包括但不限于：隐私保护、算法偏见、就业替代、自主决策等。",
        "type": "text",
        "requirements": "1. 使用平台AI文本生成工具完成文章撰写\n2. 文章字数不少于800字\n3. 需包含至少3个具体案例或论据\n4. 结构清晰：引言-论点展开-结论\n5. 提交时附上你使用的Prompt提示词",
        "days_deadline": 14,
    },
    {
        "title": "AI图像生成：设计一个未来智慧城市概念场景",
        "description": "使用AI图像生成工具，设计并生成一张展现2050年未来智慧城市的概念插画。场景应包含智能交通、绿色建筑、空中花园等元素。",
        "type": "image",
        "requirements": "1. 使用平台AI图像生成工具\n2. 图像分辨率不低于1024x1024\n3. 画面需包含至少3个未来科技元素\n4. 风格统一，色彩协调\n5. 提交时附上完整的Prompt提示词和生成参数",
        "days_deadline": 10,
    },
    {
        "title": "AI文本生成：为新产品撰写营销文案",
        "description": "假设你是一家科技创业公司的营销人员，使用AI文本生成工具为一款面向大学生的智能学习助手APP撰写一套完整的营销文案，包括产品介绍、核心卖点、使用场景等。",
        "type": "text",
        "requirements": "1. 文案包含：产品Slogan（1句）、产品简介（200字内）、核心卖点（3-5个）、使用场景描述（至少2个）\n2. 语言风格年轻化，贴近大学生群体\n3. 使用AI生成后需进行人工优化润色\n4. 提交原文Prompt和最终优化后的文案",
        "days_deadline": 7,
    },
    {
        "title": "AI图像生成：创作中国传统节日主题插画",
        "description": "使用AI图像生成工具，创作一幅以中国传统节日（春节、端午节、中秋节任选其一）为主题的插画作品。要求融合传统元素与现代设计风格。",
        "type": "image",
        "requirements": "1. 选择一个中国传统节日作为主题\n2. 需包含该节日的代表性元素（如灯笼、龙舟、月饼等）\n3. 风格要求：新中式/国潮风格\n4. 提交至少2张不同Prompt的生成结果进行对比\n5. 附上Prompt和创作说明",
        "days_deadline": 12,
    },
    {
        "title": "AI音频生成：制作一段产品宣传语音",
        "description": "使用AI语音合成工具，为一家虚构的咖啡品牌制作一段30-60秒的产品宣传语音广告。要求语音自然流畅，富有感染力。",
        "type": "audio",
        "requirements": "1. 先使用AI文本工具撰写广告脚本\n2. 使用平台AI语音生成工具合成语音\n3. 时长控制在30-60秒之间\n4. 语音内容需包含品牌名称、产品特色、促销信息\n5. 提交广告脚本和生成的音频文件",
        "days_deadline": 10,
    },
    {
        "title": "AI文本生成：编写一个Python数据分析教学案例",
        "description": "使用AI文本生成工具，编写一份完整的Python数据分析教学案例，主题为"某电商平台用户行为分析"。案例应包含数据说明、分析步骤、代码示例和结论。",
        "type": "text",
        "requirements": "1. 使用Markdown格式撰写\n2. 包含完整的Python代码示例（使用pandas/matplotlib）\n3. 案例结构：背景介绍→数据说明→分析步骤→可视化→结论\n4. 代码需可直接运行\n5. 提交Prompt和完整案例文档",
        "days_deadline": 14,
    },
    {
        "title": "AI图像生成：设计一套APP图标方案",
        "description": "使用AI图像生成工具，为一款健康管理类APP设计3套不同风格的图标方案。每套方案需包含App主图标和应用内主要功能图标（运动、饮食、睡眠）。",
        "type": "image",
        "requirements": "1. 设计3套不同风格的图标方案（如：扁平化、拟物化、渐变风）\n2. 每套至少4个图标（1个主图标+3个功能图标）\n3. 同一套内风格保持统一\n4. 图标辨识度高，符合健康管理主题\n5. 提交所有Prompt和设计说明文档",
        "days_deadline": 14,
    },
    {
        "title": "AI音频生成：创作一段古诗朗诵音频",
        "description": "使用AI语音合成工具，选择一首唐宋诗词，生成一段富有感情的朗诵音频。要求语速适当、抑扬顿挫，符合诗词意境。",
        "type": "audio",
        "requirements": "1. 选择的诗词不少于8句\n2. 先撰写朗诵脚本（标注停顿、重音、语速变化）\n3. 使用AI语音工具生成朗诵音频\n4. 选择合适的音色（男声/女声需符合诗词风格）\n5. 提交诗词原文、朗诵脚本和音频文件",
        "days_deadline": 10,
    },
    {
        "title": "AI视频生成：制作一段AI技术科普短视频脚本",
        "description": "使用AI文本生成工具，编写一段1-2分钟的短视频脚本，主题为"什么是大语言模型"。脚本需包含画面描述、旁白台词、字幕建议等内容。",
        "type": "video",
        "requirements": "1. 脚本格式：分镜脚本（画面+旁白+字幕+时长）\n2. 总时长控制在1-2分钟\n3. 内容准确，用通俗易懂的语言解释技术概念\n4. 包含至少1个生动的比喻或类比\n5. 提交Prompt和完整脚本文档",
        "days_deadline": 12,
    },
    {
        "title": "AI视频生成：设计一段产品开箱短视频分镜",
        "description": "为一款智能手表设计一段30秒的开箱短视频分镜脚本。使用AI工具辅助创意构思和脚本撰写，体现产品的科技感和时尚感。",
        "type": "video",
        "requirements": "1. 分镜脚本格式，标注每个镜头的时长、画面内容、运镜方式\n2. 总时长30秒\n3. 至少设计6个分镜\n4. 体现产品核心卖点（健康监测、消息通知、运动追踪等）\n5. 提交Prompt和完整分镜脚本",
        "days_deadline": 7,
    },
]


def seed_tasks(db: Session, teacher_id: int = 2):
    """如果任务表为空，则插入默认题目"""
    existing = db.execute(select(Task)).scalars().first()
    if existing:
        print(f"任务表已有数据，跳过种子数据初始化")
        return

    now = datetime.now(timezone.utc)
    count = 0
    for t in DEFAULT_TASKS:
        task = Task(
            title=t["title"],
            description=t["description"],
            type=t["type"],
            requirements=t["requirements"],
            deadline=now + timedelta(days=t["days_deadline"]),
            teacher_id=teacher_id,
            is_active=True,
        )
        db.add(task)
        count += 1

    db.commit()
    print(f"已初始化 {count} 道默认实训题目")
