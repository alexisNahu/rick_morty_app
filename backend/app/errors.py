class ApiError(Exception):
    status_code = 500
    default_message = 'INTERNAL_SERVER_ERROR'

    def __init__(self, message: str | None = None):
        self.message = message or self.default_message
        super().__init__(self.message)


# Errores del cliente (4xx)
class ClientSideError(ApiError):
    pass


class BadRequestError(ClientSideError):
    status_code = 400
    default_message = 'BAD_REQUEST'


class UnauthorizedError(ClientSideError):
    status_code = 401
    default_message = 'UNAUTHORIZED'


class ForbiddenError(ClientSideError):
    status_code = 403
    default_message = 'FORBIDDEN'


class NotFoundError(ClientSideError):
    status_code = 404
    default_message = 'NOT_FOUND'


class ConflictError(ClientSideError):
    status_code = 409
    default_message = 'CONFLICT'


class UnprocessableEntityError(ClientSideError):
    status_code = 422
    default_message = 'UNPROCESSABLE_ENTITY'


# Errores 5xx
class InternalServerError(ApiError):
    pass
