import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / '.env')


def required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f'Falta la variable de entorno {name} (ver backend/.env.example)')
    return value


class Config:
    port = int(os.getenv('PORT', 3000))

    db_url = os.getenv('DATABASE_URL')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = int(os.getenv('DB_PORT') or 5432)
    db_name = os.getenv('DB_NAME')
    db_user = os.getenv('DB_USER')
    db_password = os.getenv('DB_PASSWORD')

    jwt_secret = required_env('JWT_SECRET')
    refresh_token_secret = required_env('REFRESH_TOKEN')

    access_token_ttl = 60 * 60       # 1 hora, en segundos
    refresh_token_ttl = 7 * 60 * 60  # 7 horas, en segundos

    cors_origins = ['http://localhost:4200']


config = Config()
