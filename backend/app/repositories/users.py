from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.models import User


def select_users(db: Session, *, id: str | None = None, email: str | None = None,
                 name: str | None = None) -> list[User]:
    query = select(User)
    if id:
        query = query.where(User.id == id)
    if email:
        query = query.where(User.email == email)
    if name:
        query = query.where(User.name == name)
    return list(db.scalars(query))


def create_user(db: Session, *, name: str, email: str, password_hash: str) -> User:
    user = User(name=name, email=email, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def exists_email(db: Session, email: str) -> bool:
    return db.execute(
        text('SELECT 1 FROM users WHERE email = :email LIMIT 1'), {'email': email}
    ).first() is not None
