from typing import Optional as opt
import sqlalchemy as sql
import sqlalchemy.orm as orm
import time

import lib.util.crypt as crypt
import lib.util.env as env

DATABASE_PATH = env.EVENT_DB_PATH


class Base(orm.DeclarativeBase):
    pass


class Driver:
    BASE = Base
    engine = sql.create_engine(f"sqlite:///{DATABASE_PATH}", echo=False)
    SessionMaker = orm.sessionmaker(bind=engine, expire_on_commit=False)



class Event(Driver.BASE):
    __tablename__ = "event"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    created_at: orm.Mapped[float]
    event_key: orm.Mapped[str]
    event_body: orm.Mapped[str]

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.id = crypt.new_uid()
        self.created_at = time.time()
        self.event_key = kw.get("event_key")
        self.event_body = kw.get("event_body")
        return self

    def to_dict(self):
        _dict = {}
        _dict["id"] = self.id
        _dict["created_at"] = self.created_at
        _dict["event_key"] = self.event_key
        _dict["event_body"] = self.event_body
        # TODO implement
        return _dict

