import lib.util.env as env
import lib.user.user as user
import lib.user.token as token
import lib.user.rights as rights


def get_user_and_rights_from_auth_token(auth_id: str):
    t = token.get_token(auth_id)
    if not t:
        return (None, None)

    u = user.get_user(t.id)
    if not u:
        return (None, None)

    r = rights.get_user_rights(u.id)
    return (u, r)


def fetch_user_from_token(token_id: str):
    t = token.get_token(token_id)
    u = user.get_user(t.id)
    return u


def fetch_rights_from_user(user_id: str):
    u = user.get_user(user_id)
    r = rights.get_user_rights(u.id)
    return r


def get_admin_token():
    u = user.get_user_by_email(env.SERVER_ADMIN_EMAIL)
    t = token.create_new_token(u.id)
    return t
