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
    evet_key: orm.Mapped[str]
    evet_body: orm.Mapped[str]

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.id = crypt.new_uid()
        self.created_at = time.time()
        return self

    def to_dict(self):
        _dict = {}
        # TODO implement
        return _dict

