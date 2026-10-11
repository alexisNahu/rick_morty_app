import bcrypt
from sqlalchemy.orm import Session

from app.config import config
from app.errors import BadRequestError, ConflictError, UnauthorizedError
from app.models import User
from app.repositories import users as user_repo
from app.schemas import LoginSchema, RegisterSchema
from app.services.jwt import generate_token


def login(db: Session, data: LoginSchema) -> tuple[str, str, User]:
    found = next(iter(user_repo.select_users(db, email=data.email)), None)
    if not found:
        raise UnauthorizedError('Username or Password wrong')

    if not bcrypt.checkpw(data.password.encode(), found.password_hash.encode()):
        raise UnauthorizedError('Username or Password wrong')

    access_token = generate_token(found)
    refresh_token = generate_token(found, config.refresh_token_ttl, config.refresh_token_secret)
    return access_token, refresh_token, found


def register(db: Session, data: RegisterSchema) -> User:
    if data.password != data.repeat_password:
        raise BadRequestError('Passwords doesnt match')

    if user_repo.exists_email(db, data.email):
        raise ConflictError(f'Email {data.email} already registered')

    password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt(10)).decode()
    return user_repo.create_user(db, name=data.name, email=data.email, password_hash=password_hash)
