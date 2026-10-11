import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class LoginSchema(BaseModel):
    email: str
    password: str


class RegisterSchema(BaseModel):
    password: str
    name: str
    email: EmailStr
    repeat_password: str

    @model_validator(mode='after')
    def passwords_match(self):
        if self.password != self.repeat_password:
            raise ValueError('Las contraseñas no coinciden')
        return self


class UserPayload(BaseModel):
    id: str
    name: str
    email: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True, serialize_by_alias=True)

    id: uuid.UUID
    name: str
    email: str
    created_at: datetime | None = Field(alias='createdAt')
