"""User domain model."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    phone: str
    password_hash: str
    created_at: datetime
