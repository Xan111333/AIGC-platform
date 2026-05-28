import os
from dotenv import load_dotenv

load_dotenv()

class APIConfig:
    # 智谱 AI 配置
    ZHIPU_API_KEY = os.getenv("ZHIPU_API_KEY", "")

    ZHIPU_CHAT_URL = os.getenv(
        "ZHIPU_CHAT_URL",
        "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    )
    ZHIPU_IMAGE_URL = os.getenv(
        "ZHIPU_IMAGE_URL",
        "https://open.bigmodel.cn/api/paas/v4/images/generations"
    )
    ZHIPU_TTS_URL = os.getenv(
        "ZHIPU_TTS_URL",
        "https://open.bigmodel.cn/api/paas/v4/audio/speech"
    )

    # DashScope (阿里云通义) 配置
    DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY", "")

    DASHSCOPE_VIDEO_URL = os.getenv(
        "DASHSCOPE_VIDEO_URL",
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis"
    )
    DASHSCOPE_TASK_URL = os.getenv(
        "DASHSCOPE_TASK_URL",
        "https://dashscope.aliyuncs.com/api/v1/tasks"
    )

    @classmethod
    def has_zhipu_key(cls):
        return bool(cls.ZHIPU_API_KEY)

    @classmethod
    def has_dashscope_key(cls):
        return bool(cls.DASHSCOPE_API_KEY)
