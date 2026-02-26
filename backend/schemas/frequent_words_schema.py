from pydantic import BaseModel, Field

class FrequentWordsRequest(BaseModel):
    genome: str
    k: int = Field(..., ge=1, le=50)
