import flask
import time

import lib.user.rights
import lib.user.user
import lib.user.token
import lib.util.crypt
import lib.util.req

bp = flask.Blueprint("user_bp", __name__)
bp.url_prefix = "/user/"


def generate_error(reason: str, code: int = 400):
    return flask.jsonify({
        "error": reason
    }), code


def get_rights(json: dict):
    auth_token = json.get("auth_token")
    if not auth_token:
        return generate_error("auth_token not found"), False

    if not auth_token:
        return (generate_error("auth_token not found")), False

    user, status_code = lib.util.req.fetch_user_from_token(auth_token)
    if status_code != 200:
        return (generate_error("user data not found")), False

    rights, status_code = lib.util.req.fetch_rights_from_user(user.get("id"))
    if status_code != 200:
        return (generate_error("could not fetch user rights")), False

    return rights, True


@bp.post("login")
def login():
    json: dict = flask.request.json
    email = json.get("email")
    password = json.get("password")

    if None in [email, password]:
        return generate_error("missing email or password")

    user = lib.user.user.get_user_by_email(email)
    if not user:
        return generate_error("user not found")

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return generate_error("user not found")

    user_token = lib.user.token.create_new_token(user.id)
    return flask.jsonify(user_token.to_dict())


@bp.post("logout")
def logout():
    json: dict = flask.request.json
    user_token = json.get("user_token")

    if not user_token:
        return generate_error("token not supplied")

    deleted = lib.user.token.delete_token(user_token)
    if not deleted:
        return generate_error("could not delete token")

    return flask.jsonify({"success": "user logged out"})


@bp.post("register_new_user")
def register_new_user():
    json: dict = flask.request.json
    new_user_email: str = json.get("email")
    new_user_password: str = json.get("password")

    if None in [new_user_email, new_user_password]:
        return generate_error("missing email or password")

    user = lib.user.user.get_user_by_email(new_user_email)
    if user:
        return generate_error("email already registered")

    new_user = lib.user.user.create_new_user(new_user_email, new_user_password)
    if json.get("firstname"):
        new_user.first_name = json.get("firstname")
    if json.get("lastname"):
        new_user.last_name = json.get("lastname")
    lib.user.user.save_user(new_user)

    lib.user.rights.create_new_user_rights(new_user.id)

    return flask.jsonify(new_user.to_dict())


@bp.post("edit_user_rights")
def edit_user_rights():
    json: dict = flask.request.json
    # determine if we are allowd to edit user rights
    rights_or_error, is_valid = get_rights(json)
    if not is_valid:
        return rights_or_error

    if not rights_or_error.can_edit_user_rights:
        return generate_error("Not allowed to edit", 401)

    # fetch the relevant user
    user_id: str = json.get("user_id")
    if not user_id:
        return generate_error("no user id supplied")

    user = lib.user.user.get_user(user_id)
    if not user:
        return generate_error("no user found")

    user_rights = lib.user.rights.get_user_rights(user_id)
    if not user_rights:
        return generate_error("no rights found")

    # assign the user rights we want to change
    updated_rights = lib.user.rights.update_rights(user_rights.id, json)
    if not updated_rights:
        return generate_error("could not update rights")
    return flask.jsonify(updated_rights.to_dict())


@bp.post("who")
def who():
    json: dict = flask.request.json
    user_token = json.get("user_token")

    if not user_token:
        return generate_error("token not supplied")

    token = lib.user.token.get_token(user_token)
    if not token:
        return generate_error("token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return generate_error("token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return generate_error("no user data")

    return flask.jsonify(user.to_dict())


@bp.post("rights")
def rights():
    json: dict = flask.request.json
    user_id = json.get("user_id")

    if not user_id:
        return generate_error("user_id not supplied")

    rights = lib.user.rights.get_user_rights(user_id)
    if not rights:
        return generate_error("no data")

    return flask.jsonify(rights.to_dict())


@bp.post("list_users")
def list_users():
    users = lib.user.user.get_all_users()
    users = [u.to_dict() for u in users]

    for u in users:
        u.pop("email", None)
        u.pop("user_role", None)

    return flask.jsonify(users)


@bp.post("show_user")
def show_user():
    json: dict = flask.request.json
    user_id = json.get("user_id")

    if not user_id:
        return generate_error("user_id not provided")

    user = lib.user.user.get_user(user_id)
    if not user:
        return generate_error("user not found")

    user_dict = user.to_dict()
    user_dict.pop("email", None)
    user_dict.pop("user_role", None)

    return flask.jsonify(user_dict)


@bp.post("edit_user")
def edit_user():
    json: dict = flask.request.json
    user_token = json.get("user_token")
    password = json.get("password")

    if None in [user_token, password]:
        return generate_error("token or password not supplied")

    token = lib.user.token.get_token(user_token)
    if not token:
        return generate_error("token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return generate_error("token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return generate_error("no user data")

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return generate_error("invalid password")

    if json.get("new_password"):
        user.salt = lib.util.crypt.random_string(64)
        user.hash = lib.util.crypt.hash_with_salt(
            json.get("new_password"), user.salt)

    if json.get("firstname"):
        user.first_name = json.get("firstname")

    if json.get("lastname"):
        user.last_name = json.get("lastname")

    if json.get("new_email"):
        user.email = json.get("new_email")

    lib.user.user.save_user(user)
    return flask.jsonify(user.to_dict())


@bp.post("delete_user")
def delete_user():
    json: dict = flask.request.json
    user_token = json.get("user_token")
    password = json.get("password")

    if None in [user_token, password]:
        return generate_error("token or password not supplied")

    token = lib.user.token.get_token(user_token)
    if not token:
        return generate_error("token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return generate_error("token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return generate_error("no user data")

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return generate_error("invalid password")

    deleted = lib.user.user.delete_user(user.id)
    if not deleted:
        return generate_error("could not delete")

    return flask.jsonify({"success": "user deleted"})


@bp.post("refresh_token")
def refresh_token():
    json: dict = flask.request.json
    user_token = json.get("user_token")

    token = lib.user.token.get_token(user_token)
    if not token:
        return generate_error("token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return generate_error("token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return generate_error("no user data")

    lib.user.token.delete_token(token.id)
    new_token = lib.user.token.create_new_token(user.id)

    return flask.jsonify(new_token.to_dict())
