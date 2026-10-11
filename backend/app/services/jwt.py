from datetime import datetime, timedelta, timezone

import jwt

from app.config import config
from app.models import User


def generate_token(user: User, expires_in: int = config.access_token_ttl, secret: str = config.jwt_secret) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        'id': str(user.id),
        'name': user.name,
        'email': user.email,
        'sub': user.name,
        'iat': now,
        'exp': now + timedelta(seconds=expires_in),
    }
    return jwt.encode(payload, secret, algorithm='HS256')


def verify_token(token: str, secret: str = config.jwt_secret) -> dict:
    # `sub` es el nombre (heredado del backend Express), no se valida como claim estándar
    return jwt.decode(token, secret, algorithms=['HS256'], options={'verify_sub': False})
