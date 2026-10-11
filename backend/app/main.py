import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import config
from app.errors import ApiError
from app.routers import auth

logger = logging.getLogger(__name__)

app = FastAPI(title='Rick & Morty API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        {'msg': 'Error de validación en la petición', 'details': jsonable_encoder(exc.errors())},
        status_code=400,
    )


@app.exception_handler(ApiError)
async def api_error_handler(request: Request, exc: ApiError):
    if exc.status_code >= 500:
        logger.exception(exc)
    return JSONResponse({'msg': exc.message}, status_code=exc.status_code)


app.include_router(auth.router)
