from collections.abc import Iterator

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import config

url = config.db_url.replace('postgres://', 'postgresql+psycopg://', 1).replace(
    'postgresql://', 'postgresql+psycopg://', 1
) if config.db_url else URL.create(
    'postgresql+psycopg',
    username=config.db_user,
    password=config.db_password,
    host=config.db_host,
    port=config.db_port,
    database=config.db_name,
)

# prepare_threshold=None: el pooler de Supabase (modo transacción) no soporta prepared statements
engine = create_engine(url, pool_pre_ping=True, connect_args={'prepare_threshold': None})
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    with SessionLocal() as db:
        yield db
