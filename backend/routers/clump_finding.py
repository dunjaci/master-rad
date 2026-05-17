from fastapi import APIRouter
from schemas.clump_finding_schema import ClumpFindingRequest
from services.clump_finding_service import analyze_clumps

router = APIRouter()


@router.post("/api/clump-finding")
def api_clump_finding(req: ClumpFindingRequest):
    return analyze_clumps(req.genome, req.k, req.l, req.t)
