"""Standardized API response helpers."""

from typing import Any

from fastapi.responses import JSONResponse


def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200,
) -> JSONResponse:
    """Build a standardized success JSON response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data,
        },
    )


def error_response(
    message: str = "Error",
    status_code: int = 400,
    data: Any = None,
) -> JSONResponse:
    """Build a standardized error JSON response."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": data,
        },
    )
