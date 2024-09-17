from typing import Optional as opt
import sqlalchemy as sql
import sqlalchemy.orm as orm
import enum
import time

import lib.util.crypt as crypt
import lib.util.env as env

DATABASE_PATH = env.USER_DB_PATH


class Base(orm.DeclarativeBase):
    pass


class Driver:
    BASE = Base
    engine = sql.create_engine(f"sqlite:///{DATABASE_PATH}", echo=False)
    SessionMaker = orm.sessionmaker(bind=engine, expire_on_commit=False)


class UserRole(enum.Enum):
    READER = 0
    JOURNALIST = 10
    EDITORIAL = 20
    ADMIN = 30


class User(Driver.BASE):
    __tablename__ = "user"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    email: orm.Mapped[str] = orm.mapped_column(unique=True)
    first_name: orm.Mapped[opt[str]]
    last_name: orm.Mapped[opt[str]]
    salt: orm.Mapped[str]
    hash: orm.Mapped[str]
    user_role: orm.Mapped[UserRole]
    last_edited: orm.Mapped[float]
    created_at: orm.Mapped[float]

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.user_role = UserRole.READER
        self.id = crypt.new_uid()
        self.created_at = time.time()
        return self

    def to_dict(self):
        _dict = {}
        _dict["id"] = self.id
        _dict["first_name"] = self.first_name
        _dict["last_name"] = self.last_name
        _dict["email"] = self.email
        _dict["user_role"] = self.user_role.name
        _dict["last_edited"] = self.last_edited
        _dict["created_at"] = self.created_at
        return _dict


class UserToken(Driver.BASE):
    __tablename__ = "user_token"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    user_id: orm.Mapped[str]
    token: orm.Mapped[str]
    created_at: orm.Mapped[float]
    expires_at: orm.Mapped[float]
