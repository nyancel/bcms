import lib.media.media_db


def run():
    DRIVER = lib.media.media_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)
