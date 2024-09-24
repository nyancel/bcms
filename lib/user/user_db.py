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
    is_deleted: orm.Mapped[bool]
    deletion_time: orm.Mapped[float]

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.user_role = UserRole.READER
        self.id = crypt.new_uid()
        self.created_at = time.time()
        self.is_deleted = False
        self.deletion_time = 0
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
    created_at: orm.Mapped[float]
    expires_at: orm.Mapped[float]

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.id = crypt.new_uid()
        self.expires_at = time.time() + 60*60  # valid for one hour by default
        self.created_at = time.time()
        return self

    def to_dict(self):
        _dict = {}
        _dict["id"] = self.id
        _dict["user_id"] = self.user_id
        _dict["created_at"] = self.created_at
        _dict["expires_at"] = self.expires_at
        return _dict


class UserRights(Driver.BASE):
    __tablename__ = "user_token"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    user_id: orm.Mapped[str]
    # article privs
    can_post_draft: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_approve_draft: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_publish_article: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_delete_article: orm.Mapped[bool] = orm.mapped_column(default=False)
    # media privs
    can_post_media: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_unlist_media: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_delete_media: orm.Mapped[bool] = orm.mapped_column(default=False)
    # user privs
    can_assign_journalist: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_assign_editorial: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_assign_admin: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_delete_other_user: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_change_other_email: orm.Mapped[bool] = orm.mapped_column(default=False)
    can_change_other_password: orm.Mapped[bool] = orm.mapped_column(
        default=False)
    can_change_other_details: orm.Mapped[bool] = orm.mapped_column(
        default=False)
    # event details
    can_submit_event: orm.Mapped[bool] = orm.mapped_column(default=False)

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.id = crypt.new_uid()
        return self

    def to_dict(self):
        _dict = {}
        _dict["can_post_draft"] = self.can_post_draft
        _dict["can_approve_draft"] = self.can_approve_draft
        _dict["can_publish_article"] = self.can_publish_article
        _dict["can_delete_article"] = self.can_delete_article
        _dict["can_post_media"] = self.can_post_media
        _dict["can_unlist_media"] = self.can_unlist_media
        _dict["can_delete_media"] = self.can_delete_media
        _dict["can_assign_journalist"] = self.can_assign_journalist
        _dict["can_assign_editorial"] = self.can_assign_editorial
        _dict["can_assign_admin"] = self.can_assign_admin
        _dict["can_delete_other_user"] = self.can_delete_other_user
        _dict["can_change_other_email"] = self.can_change_other_email
        _dict["can_change_other_password"] = self.can_change_other_password
        _dict["can_change_other_details"] = self.can_change_other_details
        _dict["can_submit_event"] = self.can_submit_event
        return _dict
