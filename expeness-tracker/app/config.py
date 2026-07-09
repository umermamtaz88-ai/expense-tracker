"""Application configuration."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Expense Tracker API"
    app_version: str = "1.0.0"
    debug: bool = False

    # CORS
    cors_origins: list[str] = ["*"]
    cors_allow_credentials: bool = True
    cors_allow_methods: list[str] = ["*"]
    cors_allow_headers: list[str] = ["*"]

    # Storage
    base_dir: Path = Path(__file__).resolve().parent
    database_dir: Path = base_dir / "database"
    expenses_file: Path = database_dir / "expenses.json"
    users_file: Path = database_dir / "user.json"

    # Auth
    jwt_secret: str = "change-this-secret-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7

    # Logging
    log_level: str = "INFO"


settings = Settings()
