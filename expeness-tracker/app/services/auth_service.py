"""Authentication business logic."""

import logging
import uuid
from datetime import UTC, datetime

from app.database.user_database import get_users_raw, save_users_raw
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest, UserPublic
from app.utils.security import create_access_token, hash_password, verify_password

logger = logging.getLogger(__name__)


class AuthError(Exception):
    """Base authentication error."""

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class EmailAlreadyExistsError(AuthError):
    pass


class InvalidCredentialsError(AuthError):
    pass


class UserNotFoundError(AuthError):
    pass


class AuthService:
    def _deserialize(self, raw_users: list[dict]) -> list[User]:
        return [User.model_validate(item) for item in raw_users]

    def _find_by_email(self, email: str) -> User | None:
        normalized = email.strip().lower()
        for user in self._deserialize(get_users_raw()):
            if user.email.lower() == normalized:
                return user
        return None

    def _find_by_id(self, user_id: str) -> User | None:
        for user in self._deserialize(get_users_raw()):
            if user.id == user_id:
                return user
        return None

    def signup(self, payload: SignupRequest) -> AuthResponse:
        if self._find_by_email(payload.email):
            raise EmailAlreadyExistsError("An account with this email already exists")

        user = User(
            id=str(uuid.uuid4()),
            email=payload.email.strip().lower(),
            phone=payload.phone.strip(),
            password_hash=hash_password(payload.password),
            created_at=datetime.now(UTC),
        )

        raw_users = get_users_raw()
        raw_users.append(user.model_dump(mode="json"))
        save_users_raw(raw_users)
        logger.info("User registered id=%s email=%s", user.id, user.email)

        return self._build_auth_response(user)

    def login(self, payload: LoginRequest) -> AuthResponse:
        user = self._find_by_email(payload.email)
        if not user or not verify_password(payload.password, user.password_hash):
            raise InvalidCredentialsError("Invalid email or password")
        return self._build_auth_response(user)

    def get_user_by_id(self, user_id: str) -> UserPublic:
        user = self._find_by_id(user_id)
        if not user:
            raise UserNotFoundError("User not found")
        return UserPublic(id=user.id, email=user.email, phone=user.phone)

    def _build_auth_response(self, user: User) -> AuthResponse:
        token = create_access_token(user.id, {"email": user.email})
        return AuthResponse(
            user=UserPublic(id=user.id, email=user.email, phone=user.phone),
            token=token,
        )


auth_service = AuthService()
