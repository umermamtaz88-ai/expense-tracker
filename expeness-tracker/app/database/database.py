"""JSON file storage with safe read/write and file locking."""

import json
import logging
import os
import tempfile
import threading
from pathlib import Path
from typing import Any

from filelock import FileLock

from app.config import settings

logger = logging.getLogger(__name__)

# In-process lock to serialize access within the same worker process
_process_lock = threading.Lock()

DEFAULT_DATA: dict[str, list[dict[str, Any]]] = {"expenses": []}


def _ensure_directory() -> None:
    """Create the database directory if it does not exist."""
    settings.database_dir.mkdir(parents=True, exist_ok=True)


def _ensure_storage_exists() -> None:
    """Create database directory and JSON file if they do not exist."""
    _ensure_directory()

    if settings.expenses_file.exists():
        return

    lock = FileLock(_lock_path())
    with lock:
        with _process_lock:
            # Re-check after acquiring lock (another worker may have created it)
            if settings.expenses_file.exists():
                return
            with open(settings.expenses_file, "w", encoding="utf-8") as file:
                json.dump(DEFAULT_DATA, file, indent=2)
                file.write("\n")
            logger.info("Created new expenses file at %s", settings.expenses_file)


def _lock_path() -> Path:
    """Return the path used for cross-process file locking."""
    return settings.expenses_file.with_suffix(".lock")


def read_json_data() -> dict[str, Any]:
    """
    Read JSON data from the expenses file.

    Uses file locking to prevent reading while another process is writing.
    """
    _ensure_storage_exists()
    lock = FileLock(_lock_path())

    with lock:
        with _process_lock:
            try:
                with open(settings.expenses_file, "r", encoding="utf-8") as file:
                    return json.load(file)
            except json.JSONDecodeError as exc:
                logger.error("Corrupted JSON file: %s", exc)
                raise ValueError("Expenses data file is corrupted") from exc


def write_json_data(data: dict[str, Any]) -> None:
    """
    Write JSON data to the expenses file atomically.

    Writes to a temporary file first, then replaces the target file
    to avoid partial writes on failure. File locking prevents concurrent corruption.
    """
    _ensure_storage_exists()
    lock = FileLock(_lock_path())

    with lock:
        with _process_lock:
            directory = settings.expenses_file.parent
            fd, temp_path = tempfile.mkstemp(
                suffix=".tmp",
                dir=directory,
                text=True,
            )
            try:
                with os.fdopen(fd, "w", encoding="utf-8") as temp_file:
                    json.dump(data, temp_file, indent=2, default=str)
                    temp_file.write("\n")

                # Atomic replace on both POSIX and Windows (Python 3.3+)
                os.replace(temp_path, settings.expenses_file)
                logger.debug("Successfully wrote expenses data to %s", settings.expenses_file)
            except Exception:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                raise


def get_expenses_raw() -> list[dict[str, Any]]:
    """Return the raw list of expense records from storage."""
    data = read_json_data()
    return data.get("expenses", [])


def save_expenses_raw(expenses: list[dict[str, Any]]) -> None:
    """Persist the full list of expense records to storage."""
    write_json_data({"expenses": expenses})
