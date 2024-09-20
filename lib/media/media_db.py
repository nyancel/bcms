import sqlalchemy as sql
import sqlalchemy.orm as orm
import time

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
    __tablename__ = "file"
    instance_id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    parent_id: orm.Mapped[str]
    url: orm.Mapped[str]
    x_dimension: orm.Mapped[int]
    y_dimension: orm.Mapped[int]

    def to_dict(self):
        _dict = {}
        _dict["instance_id"] = self.instance_id
        _dict["parent_id"] = self.parent_id
        _dict["url"] = self.parent_id
        _dict["x_dimension"] = self.x_dimension
        _dict["y_dimension"] = self.y_dimension
        
        return _dict

class Media(Driver.BASE):
    __tablename__ = "media"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    uploader_user_id: orm.Mapped[str]
    filename: orm.Mapped[str]
    file_extention: orm.Mapped[str]
    file_mimetype: orm.Mapped[str]
    file_hash: orm.Mapped[str]
    content_type: orm.Mapped[str]
    creation_time: orm.Mapped[float]
    is_deleted: orm.Mapped[bool] = orm.mapped_column(default=False)
    deletion_time: orm.Mapped[float] = orm.mapped_column(default=0)

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
        _dict["content_type"] = self.content_type
        _dict["creation_time"] = self.creation_time
        _dict["is_deleted"] = self.is_deleted
        _dict["deletion_time"] = self.deletion_time
        
        return _dict
