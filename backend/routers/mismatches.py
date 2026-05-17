from fastapi import APIRouter
from schemas.mismatches_schema import (
    ApproximateCountRequest,
    HammingRequest,
    MismatchesAnalyzeRequest,
    NeighborsRequest,
)
from services.mismatches_service import (
    analyze_approximate_count,
    analyze_hamming,
    analyze_mismatches,
    analyze_neighbors,
)

router = APIRouter()


@router.post("/api/mismatches/analyze")
def api_mismatches_analyze(req: MismatchesAnalyzeRequest):
    return analyze_mismatches(req.text, req.pattern, req.k, req.d)


@router.post("/api/mismatches/hamming")
def api_hamming(req: HammingRequest):
    return analyze_hamming(req.first, req.second)


@router.post("/api/mismatches/neighbors")
def api_neighbors(req: NeighborsRequest):
    return analyze_neighbors(req.pattern, req.d)


@router.post("/api/mismatches/approximate-count")
def api_approximate_count(req: ApproximateCountRequest):
    return analyze_approximate_count(req.text, req.pattern, req.d)
