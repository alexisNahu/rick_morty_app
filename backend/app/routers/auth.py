import jwt
from fastapi import APIRouter, Cookie, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.config import config
from app.db import get_db
from app.errors import ApiError, UnauthorizedError
from app.repositories import users as user_repo
from app.schemas import LoginSchema, RegisterSchema, UserOut
from app.services import auth as auth_service
from app.services.jwt import generate_token, verify_token

router = APIRouter(prefix='/auth')


def set_auth_cookie(response: Response, key: str, value: str, max_age: int) -> None:
    response.set_cookie(key, value, max_age=max_age, httponly=True, samesite='strict')


def refresh_access_token(response: Response, refresh_token: str | None, db: Session) -> dict:
    """Valida el refresh token, emite un access token nuevo en la cookie y devuelve su payload."""
    if not refresh_token:
        raise UnauthorizedError('Usuario no logeado o no autenticado')

    try:
        payload = verify_token(refresh_token, config.refresh_token_secret)
    except jwt.PyJWTError as e:
        raise UnauthorizedError(str(e))

    user = next(iter(user_repo.select_users(db, id=payload['id'])), None)
    if not user:
        raise UnauthorizedError('El usuario del refresh token no existe')

    access_token = generate_token(user)
    set_auth_cookie(response, 'access_token', access_token, config.access_token_ttl)
    return verify_token(access_token)


@router.post('/register')
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    try:
        new_user = auth_service.register(db, data)
    except ApiError as e:
        return JSONResponse(
            {'msg': 'error registrado al nuevo usuario', 'details': e.message}, status_code=e.status_code
        )
    return {
        'msg': 'usuario en el sistema registrado correctamente',
        'details': UserOut.model_validate(new_user),
    }


@router.post('/login')
def login(data: LoginSchema, response: Response, db: Session = Depends(get_db)):
    try:
        access_token, refresh_token, _ = auth_service.login(db, data)
    except ApiError as e:
        return JSONResponse(
            {'msg': 'error logeando al nuevo usuario', 'details': e.message}, status_code=e.status_code
        )

    set_auth_cookie(response, 'access_token', access_token, config.access_token_ttl)
    set_auth_cookie(response, 'refresh_token', refresh_token, config.refresh_token_ttl)
    return {
        'msg': 'usuario logeado correctamente',
        'details': {'accessToken': access_token, 'refreshToken': refresh_token},
    }


@router.post('/logout')
def logout(response: Response):
    response.delete_cookie('access_token', httponly=True, samesite='strict')
    response.delete_cookie('refresh_token', httponly=True, samesite='strict')
    return {'msg': 'Logout succesfull'}


@router.get('/me')
def me(
    response: Response,
    access_token: str | None = Cookie(None),
    refresh_token: str | None = Cookie(None),
    db: Session = Depends(get_db),
):
    try:
        decoded = verify_token(access_token or '')
    except jwt.PyJWTError:
        # Access token ausente o vencido: se intenta renovar con el refresh token
        try:
            decoded = refresh_access_token(response, refresh_token, db)
        except UnauthorizedError as e:
            return JSONResponse({'msg': 'Something went wrong at me/', 'details': e.message}, status_code=401)
    return {'msg': 'User info fetched', 'details': decoded}
