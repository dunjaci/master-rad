from pydantic import BaseModel, Field


class MismatchesAnalyzeRequest(BaseModel):
    text: str
    pattern: str = ""
    k: int = Field(..., ge=1, le=8)
    d: int = Field(..., ge=0, le=8)


class HammingRequest(BaseModel):
    first: str
    second: str


class NeighborsRequest(BaseModel):
    pattern: str
    d: int = Field(..., ge=0, le=8)


class ApproximateCountRequest(BaseModel):
    text: str
    pattern: str
    d: int = Field(..., ge=0, le=8)
