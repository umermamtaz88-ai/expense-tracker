"""Authentication request and response schemas."""

from pydantic import BaseModel, EmailStr, Field, field_validator


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    phone: str = Field(..., min_length=7, max_length=20)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned.replace("+", "").replace("-", "").replace(" ", "").isdigit():
            raise ValueError("Phone number must contain only digits and optional + - spaces")
        return cleaned


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    phone: str


class AuthResponse(BaseModel):
    user: UserPublic
    token: str
    token_type: str = "bearer"
