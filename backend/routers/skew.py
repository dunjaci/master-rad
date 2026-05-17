from fastapi import APIRouter
from schemas.skew_schema import SkewRequest
from services.skew_service import analyze_skew

router = APIRouter()


@router.post("/api/skew")
def api_skew(req: SkewRequest):
    return analyze_skew(req.genome)
