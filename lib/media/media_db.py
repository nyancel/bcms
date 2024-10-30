import sqlalchemy as sql
import sqlalchemy.orm as orm
import time
from typing import Optional as opt

import lib.util.crypt as crypt
import lib.util.env as env

import lib.user.user_db as user_db

DATABASE_PATH = env.MEDIA_DB_PATH

class Base(orm.DeclarativeBase):
    pass

class Driver:
    BASE = Base
    engine = sql.create_engine(f"sqlite:///{DATABASE_PATH}", echo=False)
    SessionMaker = orm.sessionmaker(bind=engine, expire_on_commit=False)

class MediaInstance(Driver.BASE):
    __tablename__ = "media_instances"
    instance_id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    parent_id: orm.Mapped[str]
    x_dimension: orm.Mapped[int]
    y_dimension: orm.Mapped[int]

    def to_dict(self):
        _dict = {}
        _dict["instance_id"] = self.instance_id
        _dict["parent_id"] = self.parent_id
        _dict["x_dimension"] = self.x_dimension
        _dict["y_dimension"] = self.y_dimension
        
        return _dict

class MediaParent(Driver.BASE):
    __tablename__ = "media_parents"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    uploader_user_id: orm.Mapped[str]
    filename: orm.Mapped[str]
    file_extention: orm.Mapped[str]
    file_mimetype: orm.Mapped[str]
    file_hash: orm.Mapped[str]
    alt_text: orm.Mapped[str] = orm.mapped_column(default="")
    author_credit_subtext: orm.Mapped[str] = orm.mapped_column(default="")
    content_type: orm.Mapped[str]
    creation_time: orm.Mapped[float]
    is_unlisted: orm.Mapped[bool] = orm.mapped_column(default=False)
    unlisted_state_update_time: orm.Mapped[float] = orm.mapped_column(default=0)
    is_deleted: orm.Mapped[bool] = orm.mapped_column(default=False)
    deleted_state_update_time: orm.Mapped[float] = orm.mapped_column(default=0)

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.id = crypt.new_uid()
        self.timestamp = time.time()
        self.update_timestamp = time.time()

    def to_dict(self):
        _dict = {}
        _dict["id"] = self.id
        _dict["uploader_user_id"] = self.uploader_user_id
        _dict["filename"] = self.filename
        _dict["file_extention"] = self.file_extention
        _dict["file_mimetype"] = self.file_mimetype
        _dict["file_hash"] = self.file_hash
        _dict["alt_text"] = self.alt_text
        _dict["author_credit_subtext"] = self.author_credit_subtext
        _dict["content_type"] = self.content_type
        _dict["creation_time"] = self.creation_time
        _dict["is_unlisted"] = self.is_unlisted
        _dict["unlisted_state_update_time"] = self.unlisted_state_update_time
        _dict["is_deleted"] = self.is_deleted
        _dict["deleted_state_update_time"] = self.deleted_state_update_time
        
        return _dict

class MediaJointParentInstances():
    parent: MediaParent
    instances: list[MediaInstance]
    
    def to_dict(self):
        _dict = {}
        _dict["parent"] = self.parent.to_dict()
        _dict["instances"] = [instance.to_dict() for instance in self.instances]
        
        return _dict