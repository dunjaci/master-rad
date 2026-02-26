from fastapi import APIRouter
from schemas.frequent_words_schema import FrequentWordsRequest
from services.frequent_words_service import frequent_words

router = APIRouter()

@router.post("/api/frequent-words")
def api_frequent_words(req: FrequentWordsRequest):
    return frequent_words(req.genome, req.k)
