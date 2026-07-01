"""Pydantic schemas for expense API requests and responses."""

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.constants.categories import ALLOWED_CATEGORIES


class ExpenseCreate(BaseModel):
    """Schema for creating a new expense."""

    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    date: date
    note: Optional[str] = Field(default=None, max_length=500)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        if value not in ALLOWED_CATEGORIES:
            raise ValueError(
                f"Invalid category '{value}'. Must be one of: {', '.join(ALLOWED_CATEGORIES)}"
            )
        return value


class ExpenseUpdate(BaseModel):
    """Schema for updating an existing expense (partial update)."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    amount: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = Field(default=None, min_length=1)
    date: Optional[date] = None
    note: Optional[str] = Field(default=None, max_length=500)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and value not in ALLOWED_CATEGORIES:
            raise ValueError(
                f"Invalid category '{value}'. Must be one of: {', '.join(ALLOWED_CATEGORIES)}"
            )
        return value


class ExpenseResponse(BaseModel):
    """Schema for expense API responses."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    amount: float
    category: str
    date: date
    note: Optional[str] = None


class SummaryOverall(BaseModel):
    """Overall expense summary."""

    total_expenses: int
    total_amount: float
    average_amount: float


class SummaryByMonth(BaseModel):
    """Monthly expense summary entry."""

    month: str
    total_amount: float
    expense_count: int


class SummaryByCategory(BaseModel):
    """Category-wise expense summary entry."""

    category: str
    total_amount: float
    expense_count: int
    percentage: float
