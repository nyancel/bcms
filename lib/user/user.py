import time

import lib.user.user_db as user_db
import lib.util.crypt as crypt


def create_new_user(email: str, password: str) -> user_db.User:
    new_user = user_db.User()
    new_user.salt = crypt.random_string(64)
    new_user.hash = crypt.hash_with_salt(password, new_user.salt)
    new_user.email = email
    new_user.last_edited = time.time()
    with user_db.Driver.SessionMaker() as db_session:
        db_session.add(new_user)
        db_session.commit()
    return new_user


def save_user(user: user_db.User) -> user_db.User:
    user.last_edited = time.time()
    with user_db.Driver.SessionMaker() as db_session:
        db_session.add(user)
        db_session.commit()
    return user


def get_user(user_id: str) -> user_db.User:
    with user_db.Driver.SessionMaker() as db_session:
        user_query = db_session.query(user_db.User)
        user_query = user_query.where(user_db.User.id == user_id)
        user_query = user_query.where(user_db.User.is_deleted == False)
        user = user_query.first()
    return user


def get_user_by_email(user_email: str) -> user_db.User:
    with user_db.Driver.SessionMaker() as db_session:
        user_query = db_session.query(user_db.User)
        user_query = user_query.where(user_db.User.email == user_email)
        user_query = user_query.where(user_db.User.is_deleted == False)
        user = user_query.first()
    return user


def get_all_users() -> list[user_db.User]:
    with user_db.Driver.SessionMaker() as db_session:
        user_query = db_session.query(user_db.User)
        user_query = user_query.where(user_db.User.is_deleted == False)
        users = user_query.all()
    return users


def delete_user(user_id: str) -> bool:
    user = get_user(user_id)
    if not user:
        return False
    user.is_deleted = True
    user = save_user(user)
    if not user:
        return False
    return True
