import lib.user.user_db


def run():
    DRIVER = lib.user.user_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)
