import flask
import time

import lib.user.user
import lib.user.token
import lib.util.crypt

bp = flask.Blueprint("user_bp", __name__)
bp.url_prefix = "/user/"


@bp.post("login")
def login():
    json: dict = flask.request.json
    email = json.get("email")
    password = json.get("password")

    if None in [email, password]:
        return flask.jsonify(
            {"error": "missing email or password"}
        ), 400

    user = lib.user.user.get_user_by_email(email)
    if not user:
        return flask.jsonify(
            {"error": "user not found"}
        ), 400

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return flask.jsonify(
            {"error": "user not found"}
        ), 400

    user_token = lib.user.token.create_new_token(user.id)
    return flask.jsonify(user_token.to_dict())


@bp.post("logout")
def logout():
    json: dict = flask.request.json
    user_token = json.get("user_token")

    if not user_token:
        return flask.jsonify(
            {"error": "token not supplied"}
        ), 400

    deleted = lib.user.token.delete_token(user_token)
    if not deleted:
        return flask.jsonify(
            {"error": "could not delete token"}
        ), 400

    return flask.jsonify({
        "success": "user logged out"
    })


@bp.post("register_new_user")
def register_new_user():
    json: dict = flask.request.json
    new_user_email: str = json.get("email")
    new_user_password: str = json.get("password")

    if None in [new_user_email, new_user_password]:
        return flask.jsonify(
            {"error": "missing email or password"}
        ), 400

    # check unique constraint for email
    user = lib.user.user.get_user_by_email(new_user_email)
    if user:
        return flask.jsonify(
            {"error": "email already registered"}
        ), 400

    new_user = lib.user.user.create_new_user(new_user_email, new_user_password)
    if json.get("firstname"):
        new_user.first_name = json.get("firstname")
    if json.get("lastname"):
        new_user.last_name = json.get("lastname")
    lib.user.user.save_user(new_user)

    return flask.jsonify(new_user.to_dict())


@bp.post("me")
def me():
    json: dict = flask.request.json
    user_token = json.get("user_token")

    if not user_token:
        return flask.jsonify(
            {"error": "token not supplied"}
        ), 400

    token = lib.user.token.get_token(user_token)
    if not token:
        return flask.jsonify(
            {"error": "token invalid"}
        ), 400

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return flask.jsonify(
            {"error": "token expired"}
        ), 400

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask.jsonify(
            {"error": "no user data"}
        ), 400

    return flask.jsonify(user.to_dict())


@bp.post("list_users")
def list_users():
    users = lib.user.user.get_all_users()
    users = [u.to_dict() for u in users]

    # purge fields we dont want exposed to the client
    for u in users:
        u.pop("email")
        u.pop("user_role")

    return flask.jsonify(users)


@bp.post("show_user")
def show_user():
    json: dict = flask.request.json
    user_id = json.get("user_id")

    if not user_id:
        return flask.jsonify(
            {"error": "user_id not provided"}
        ), 400

    user = lib.user.user.get_user(user_id)
    if not user:
        return flask.jsonify(
            {"error": "user not found"}
        ), 400

    # purge fields we dont want exposed to the client
    user_dict = user.to_dict()
    user_dict.pop("email")
    user_dict.pop("user_role")
    return flask.jsonify(user_dict)


@bp.post("edit_user")
def edit_user():
    json: dict = flask.request.json
    user_token = json.get("user_token")
    password = json.get("password")

    # errors and early returns
    if None in [user_token, password]:
        return flask.jsonify(
            {"error": "token or password not supplied"}
        ), 400

    token = lib.user.token.get_token(user_token)
    if not token:
        return flask.jsonify(
            {"error": "token invalid"}
        ), 400

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return flask.jsonify(
            {"error": "token expired"}
        ), 400

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask.jsonify(
            {"error": "no user data"}
        ), 400

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return flask.jsonify(
            {"error": "invalid password"}
        ), 400

    # Logic
    if json.get("new_password"):
        user.salt = lib.util.crypt.random_string(64)
        user.hash = lib.util.crypt.hash_with_salt(
            json.get("new_password"), user.salt
        )

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

    # errors and early returns
    if None in [user_token, password]:
        return flask.jsonify(
            {"error": "token or password not supplied"}
        ), 400

    token = lib.user.token.get_token(user_token)
    if not token:
        return flask.jsonify(
            {"error": "token invalid"}
        ), 400

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return flask.jsonify(
            {"error": "token expired"}
        ), 400

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask.jsonify(
            {"error": "no user data"}
        ), 400

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return flask.jsonify(
            {"error": "invalid password"}
        ), 400

    deleted = lib.user.user.delete_user(user.id)
    if not deleted:
        return flask.jsonify(
            {"error": "could not delete"}
        ), 400

    return flask.jsonify({"success": "user deleted"})
