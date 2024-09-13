from typing import Optional as opt

import sqlalchemy as sql
import sqlalchemy.orm as orm
import dotenv
import os
import enum

dotenv.load_dotenv()
DATABASE_PATH = os.getenv("USER_DB_PATH")


class Base(orm.DeclarativeBase):
    pass


class Driver:
    BASE = Base
    engine = sql.create_engine(f"sqlite:///{DATABASE_PATH}", echo=False)
    SessionMaker = orm.sessionmaker(bind=engine, expire_on_commit=False)


class UserRole(enum.Enum):
    "READER" = -10
    "JOURNALIST" = 0
    "EDITORIAL" = 10
    "ADMIN" = 20


class User(Driver.BASE):
    __tablename__ = "collection"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    first_name: orm.Mapped[opt[str]]
    last_name: orm.Mapped[opt[str]]
    email: orm.Mapped[str]
    salt: orm.Mapped[str]
    hash: orm.Mapped[str]
    user_role: orm.Mapped[UserRole]
    last_edited: orm.Mapped[float]
    created_at: orm.Mapped[float]
