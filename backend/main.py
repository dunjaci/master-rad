import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import clump_finding, frequent_words, mismatches, skew

app = FastAPI(title="Replikacija genoma")

frontend_url = os.getenv("FRONTEND_URL")
allowed_origins = ["http://localhost:3000"]

if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(frequent_words.router)
app.include_router(clump_finding.router)
app.include_router(skew.router)
app.include_router(mismatches.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}
