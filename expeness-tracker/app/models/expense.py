"""Domain model for expenses."""

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class Expense(BaseModel):
    """Expense entity stored in the JSON database."""

    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique expense identifier")
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0, description="Expense amount (must be positive)")
    category: str = Field(..., min_length=1)
    date: date
    note: Optional[str] = Field(default=None, max_length=500)
