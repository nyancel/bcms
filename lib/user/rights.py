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


def get_rights(rights_id) -> user_db.UserRights:
    with user_db.Driver.SessionMaker() as db_session:
        query = db_session.query(user_db.UserRights)
        query = query.where(user_db.UserRights.id == rights_id)
        rights = query.first()
    return rights


def get_user_rights(user_id) -> user_db.UserRights:
    with user_db.Driver.SessionMaker() as db_session:
        query = db_session.query(user_db.UserRights)
        query = query.where(user_db.UserRights.user_id == user_id)
        rights = query.first()
    return rights


def save_user_rights(rights: user_db.UserRights) -> user_db.UserRights:
    rights.last_edited = time.time()
    with user_db.Driver.SessionMaker() as db_session:
        db_session.add(rights)
        db_session.commit()
    return rights


def update_rights(rights_id: str, args: dict):
    property_names = [p for p in dir(user_db.UserRights) if isinstance(
        getattr(user_db.UserRights, p), property
    )]
    property_names = [p for p in property_names if p.startswith("can_")]
    rights = get_rights(rights_id)
    for p in property_names:
        if args.get(p) is not None:
            setattr(rights, p, args.get(p))
    save_user_rights(rights)
