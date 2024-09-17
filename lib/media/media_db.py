from typing import Optional as opt

import sqlalchemy as sql
import sqlalchemy.orm as orm
import lib.util.crypt as crypt
import dotenv
import os
import time

import lib.user.user_db as user_db

dotenv.load_dotenv()
# MEDIA_DB_PATH="volume/media/media.db"
DATABASE_PATH = os.getenv("MEDIA_DB_PATH")

class Base(orm.DeclarativeBase):
    pass


class Driver:
    BASE = Base
    engine = sql.create_engine(f"sqlite:///{DATABASE_PATH}", echo=False)
    SessionMaker = orm.sessionmaker(bind=engine, expire_on_commit=False)

# class MediaContent(Driver.BASE):
#     __tablename__ = "user_token"
#     id: orm.Mapped[str] = orm.mapped_column(primary_key=True)

class Media(Driver.BASE):
    __tablename__ = "media"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    uploader_user_id: orm.Mapped[str]
    filename: orm.Mapped[str]
    file_extention: orm.Mapped[str]
    file_mimetype: orm.Mapped[str]
    creation_time: orm.Mapped[float]
    is_deleted: orm.Mapped[bool] = orm.mapped_column(default=False)
    deletion_time: orm.Mapped[float]

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.id = crypt.new_uid()
        self.timestamp = time.time()
        self.update_timestamp = time.time()

    def to_dict(self):
        _dict = {}
        # _dict["id"] = self.id
        # _dict["title"] = self.title
        # _dict["body"] = self.body
        # _dict["user_id"] = self.user_id
        # _dict["timestamp"] = self.timestamp
        # _dict["update_timestamp"] = self.update_timestamp
        # _dict["isAccepted"] = self.isAccepted
        # _dict["isListed"] = self.isListed
        
        # TODO
        return _dict
