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

    # Logging
    log_level: str = "INFO"


settings = Settings()
