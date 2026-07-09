"""FastAPI application entry point."""

import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.auth import router as auth_router
from app.api.expense import router as expense_router
from app.config import settings
from app.database.database import _ensure_storage_exists
from app.database.user_database import ensure_users_storage_exists
from app.utils.response import error_response


def setup_logging() -> None:
    """Configure application-wide logging."""
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle hooks."""
    setup_logging()
    logger = logging.getLogger(__name__)
    _ensure_storage_exists()
    ensure_users_storage_exists()
    logger.info("Expense Tracker API started (version %s)", settings.app_version)
    yield
    logger.info("Expense Tracker API shutting down")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A production-ready Expense Tracker REST API with JSON file storage.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

# Register API routers
app.include_router(auth_router)
app.include_router(expense_router)


@app.get("/", tags=["Health"])
def root() -> JSONResponse:
    """Health check endpoint."""
    from app.utils.response import success_response

    return success_response(
        data={
            "service": settings.app_name,
            "version": settings.app_version,
            "docs": "/docs",
        },
        message="Expense Tracker API is running",
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """Return standardized error response for Pydantic validation failures."""
    errors = exc.errors()
    messages = []
    for error in errors:
        loc = " -> ".join(str(part) for part in error.get("loc", []))
        messages.append(f"{loc}: {error.get('msg')}")
    detail = "; ".join(messages) if messages else "Validation error"
    logging.getLogger(__name__).warning(
        "Validation error on %s %s: %s", request.method, request.url.path, detail
    )
    return error_response(message=detail, status_code=422)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch unhandled exceptions and return a standardized error response."""
    logging.getLogger(__name__).exception(
        "Unhandled error on %s %s", request.method, request.url.path
    )
    message = str(exc) if settings.debug else "Internal server error"
    return error_response(message=message, status_code=500)
