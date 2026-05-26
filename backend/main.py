from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.files import router as files_router
from app.routes.text import router as text_router
from app.routes.image import router as image_router
from app.routes.audio import router as audio_router
from app.routes.tasks import router as tasks_router
from app.database import init_db, SessionLocal
from app.utils.local_storage import init_storage
from app.seed_tasks import seed_tasks

app = FastAPI(
    title="AIGC 实训平台 API",
    description="面向高校师生的 AIGC 实训平台后端接口",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://xan111333.github.io", "http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(files_router)
app.include_router(text_router)
app.include_router(image_router)
app.include_router(audio_router)
app.include_router(tasks_router)

@app.get("/")
def read_root():
    return {"message": "AIGC 实训平台 API 服务已启动"}

@app.on_event("startup")
async def on_startup():
    init_db()
    init_storage()
    db = SessionLocal()
    try:
        seed_tasks(db)
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)