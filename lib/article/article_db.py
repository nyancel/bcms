import time
import sqlalchemy as sql
import sqlalchemy.orm as orm

import lib.util.crypt as crypt
import lib.util.env as env


DATABASE_PATH = env.ARTICLE_DB_PATH


class Base(orm.DeclarativeBase):
    pass


class Driver:
    BASE = Base
    engine = sql.create_engine(f"sqlite:///{DATABASE_PATH}", echo=False)
    SessionMaker = orm.sessionmaker(bind=engine, expire_on_commit=False)


class Article(Driver.BASE):
    __tablename__ = "article"
    id: orm.Mapped[str] = orm.mapped_column(primary_key=True)
    title: orm.Mapped[str]
    body: orm.Mapped[str]
    user_id: orm.Mapped[str]
    timestamp: orm.Mapped[float]
    update_timestamp: orm.Mapped[float]
    isAccepted: orm.Mapped[bool] = orm.mapped_column(default=False)
    isListed: orm.Mapped[bool] = orm.mapped_column(default=True)
    isDeleted: orm.Mapped[bool] = orm.mapped_column(default=False)

    def __init__(self, **kw: sql.Any):
        super().__init__(**kw)
        self.id = crypt.new_uid()
        self.timestamp = time.time()
        self.update_timestamp = time.time()

    def to_dict(self):
        _dict = {}
        _dict["id"] = self.id
        _dict["title"] = self.title
        _dict["body"] = self.body
        _dict["user_id"] = self.user_id
        _dict["timestamp"] = self.timestamp
        _dict["update_timestamp"] = self.update_timestamp
        _dict["isAccepted"] = self.isAccepted
        _dict["isListed"] = self.isListed
        _dict["isDeleted"] = self.isDeleted
        return _dict
