"""Authentication API routes."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.auth import LoginRequest, SignupRequest
from app.services.auth_service import (
    AuthService,
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    UserNotFoundError,
    auth_service,
)
from app.utils.response import error_response, success_response
from app.utils.security import decode_access_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)


def get_auth_service() -> AuthService:
    return auth_service


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> str | None:
    if not credentials or credentials.scheme.lower() != "bearer":
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        return str(payload.get("sub"))
    except Exception:
        return None


@router.post("/signup", status_code=201)
def signup(
    payload: SignupRequest,
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> JSONResponse:
    try:
        result = service.signup(payload)
        return success_response(
            data=result.model_dump(mode="json"),
            message="Account created successfully",
            status_code=201,
        )
    except EmailAlreadyExistsError as exc:
        return error_response(message=exc.message, status_code=409)


@router.post("/login")
def login(
    payload: LoginRequest,
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> JSONResponse:
    try:
        result = service.login(payload)
        return success_response(
            data=result.model_dump(mode="json"),
            message="Login successful",
        )
    except InvalidCredentialsError as exc:
        return error_response(message=exc.message, status_code=401)


@router.get("/me")
def get_me(
    user_id: Annotated[str | None, Depends(get_current_user_id)],
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> JSONResponse:
    if not user_id:
        return error_response(message="Not authenticated", status_code=401)
    try:
        user = service.get_user_by_id(user_id)
        return success_response(data=user.model_dump(mode="json"))
    except UserNotFoundError as exc:
        return error_response(message=exc.message, status_code=404)
