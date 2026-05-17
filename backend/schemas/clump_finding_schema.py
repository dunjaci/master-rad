from pydantic import BaseModel, Field


class ClumpFindingRequest(BaseModel):
    genome: str
    k: int = Field(..., ge=1, le=12)
    l: int = Field(..., ge=1)
    t: int = Field(..., ge=1)
