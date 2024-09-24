import time
import lib.user.user_db as user_db


def create_new_user_rights(user_id) -> user_db.UserRights:
    new_rights = user_db.UserRights()
    new_rights.user_id = user_id
    new_rights.last_edited = time.time()
    with user_db.Driver.SessionMaker() as db_session:
        db_session.add(new_rights)
        db_session.commit()
    return new_rights


def get_user_rights(user_id) -> user_db.UserRights:
    with user_db.Driver.SessionMaker() as db_session:
        query = db_session.query(user_db.UserRights)
        query = query.where(user_id == user_id)
        rights = query.first()
    return rights


def save_user_rights(rights: user_db.UserRights) -> user_db.UserRights:
    rights.last_edited = time.time()
    with user_db.Driver.SessionMaker() as db_session:
        db_session.add(rights)
        db_session.commit()
    return rights
