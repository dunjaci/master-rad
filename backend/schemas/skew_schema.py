from pydantic import BaseModel


class SkewRequest(BaseModel):
    genome: str
