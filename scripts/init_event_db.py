import lib.events.event_db


def run():
    DRIVER = lib.events.event_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)