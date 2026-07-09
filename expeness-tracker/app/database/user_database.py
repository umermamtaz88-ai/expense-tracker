"""JSON file storage for user accounts."""

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

_process_lock = threading.Lock()
DEFAULT_DATA: dict[str, list[dict[str, Any]]] = {"users": []}


def _lock_path() -> Path:
    return settings.users_file.with_suffix(".lock")


def ensure_users_storage_exists() -> None:
    settings.database_dir.mkdir(parents=True, exist_ok=True)
    if settings.users_file.exists():
        return

    lock = FileLock(_lock_path())
    with lock:
        with _process_lock:
            if settings.users_file.exists():
                return
            with open(settings.users_file, "w", encoding="utf-8") as file:
                json.dump(DEFAULT_DATA, file, indent=2)
                file.write("\n")
            logger.info("Created users file at %s", settings.users_file)


def read_users_data() -> dict[str, Any]:
    ensure_users_storage_exists()
    lock = FileLock(_lock_path())

    with lock:
        with _process_lock:
            with open(settings.users_file, "r", encoding="utf-8") as file:
                return json.load(file)


def write_users_data(data: dict[str, Any]) -> None:
    ensure_users_storage_exists()
    lock = FileLock(_lock_path())

    with lock:
        with _process_lock:
            directory = settings.users_file.parent
            fd, temp_path = tempfile.mkstemp(suffix=".tmp", dir=directory, text=True)
            try:
                with os.fdopen(fd, "w", encoding="utf-8") as temp_file:
                    json.dump(data, temp_file, indent=2, default=str)
                    temp_file.write("\n")
                os.replace(temp_path, settings.users_file)
            except Exception:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                raise


def get_users_raw() -> list[dict[str, Any]]:
    return read_users_data().get("users", [])


def save_users_raw(users: list[dict[str, Any]]) -> None:
    write_users_data({"users": users})
