import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, Header
from fastapi.responses import JSONResponse
from sqlalchemy import text

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.db import engine  # noqa: E402

app = FastAPI()


# Invocado por el cron de Vercel (ver vercel.json) para que Supabase
# registre actividad y no pause el proyecto. `SELECT 1` no escribe nada.
@app.get('/{path:path}')
def keepalive(authorization: str | None = Header(None)):
    secret = os.getenv('CRON_SECRET')
    if secret and authorization != f'Bearer {secret}':
        return JSONResponse({'ok': False}, status_code=401)

    try:
        with engine.connect() as conn:
            conn.execute(text('select 1'))
    except Exception:
        logging.exception('Error en keepalive de la base de datos')
        return JSONResponse({'ok': False}, status_code=500)
    return {'ok': True, 'at': datetime.now(timezone.utc).isoformat()}
