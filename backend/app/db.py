from collections.abc import Iterator

from sqlalchemy import URL, create_engine, make_url
from sqlalchemy.orm import Session, sessionmaker

from app.config import config

# Parámetros de conexión que entiende libpq; los que agregan Supabase/Vercel
# (pgbouncer=true, supa=...) hacen fallar la conexión y se descartan.
LIBPQ_PARAMS = {'sslmode', 'sslrootcert', 'connect_timeout', 'application_name', 'options',
                'target_session_attrs'}


def database_url() -> URL:
    if config.db_url:
        url = make_url(config.db_url).set(drivername='postgresql+psycopg')
        return url.set(query={k: v for k, v in url.query.items() if k in LIBPQ_PARAMS})
    return URL.create(
        'postgresql+psycopg',
        username=config.db_user,
        password=config.db_password,
        host=config.db_host,
        port=config.db_port,
        database=config.db_name,
    )


# prepare_threshold=None: el pooler de Supabase (modo transacción) no soporta prepared statements
engine = create_engine(database_url(), pool_pre_ping=True, connect_args={'prepare_threshold': None})
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    with SessionLocal() as db:
        yield db
