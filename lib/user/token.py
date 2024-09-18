import lib.user.user_db as user_db


def create_new_token(user_id: str) -> user_db.UserToken:
    token = user_db.UserToken()
    token.user_id = user_id
    with user_db.Driver.SessionMaker() as session:
        session.add(token)
        session.commit()
    return token


def delete_token(token_id: str) -> bool:
    with user_db.Driver.SessionMaker() as session:
        token = session.query(user_db.UserToken)\
            .where(user_db.UserToken.id == token_id)\
            .first()
        if not token:
            return False
        session.delete(token)
        session.commit()
    return True


def get_token(token_id: str) -> user_db.UserToken:
    with user_db.Driver.SessionMaker() as session:
        token = session.query(user_db.UserToken)\
            .where(user_db.UserToken.id == token_id)\
            .first()
    return token
