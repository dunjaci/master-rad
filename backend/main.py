from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import frequent_words

app = FastAPI(title="Replikacija genoma")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(frequent_words.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}
