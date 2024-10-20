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
        token_query = session.query(user_db.UserToken)
        token_query = token_query.where(user_db.UserToken.id == token_id)
        token = token_query.first()

        if not token:
            return False

        session.delete(token)
        session.commit()
    return True


def get_token(token_id: str) -> user_db.UserToken:
    with user_db.Driver.SessionMaker() as session:
        token_query = session.query(user_db.UserToken)
        token_query = token_query.where(user_db.UserToken.id == token_id)
        token = token_query.first()
    return token


def get_tokens_by_user_id(user_id: str) -> list[user_db.UserToken]:
    with user_db.Driver.SessionMaker() as session:
        token_query = session.query(user_db.UserToken)
        token_query = token_query.where(user_db.UserToken.user_id == user_id)
        tokens = token_query.all()
    return tokens
