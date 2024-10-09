import flask
import time

import lib.user.rights
import lib.user.user
import lib.user.token

import lib.util.crypt
import lib.util.user_api
import lib.util.flask_helper as flask_helper

bp = flask.Blueprint("user_bp", __name__)
bp.url_prefix = "/user/"


@bp.post("login")
def login():
    json: dict = flask.request.json
    email = json.get("email")
    password = json.get("password")

    if None in [email, password]:
        return flask_helper.generate_response(data=None, code=400, message="missing email or password")

    user = lib.user.user.get_user_by_email(email)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="user not found")

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return flask_helper.generate_response(data=None, code=400, message="user not found")

    user_token = lib.user.token.create_new_token(user.id)
    return flask_helper.generate_response(data=user_token.to_dict())


@bp.post("logout")
def logout():
    json: dict = flask.request.json
    auth_token = json.get("auth_token")

    if not auth_token:
        return flask_helper.generate_response(data=None, code=400, message="token not supplied")

    token = lib.user.token.get_token(auth_token)
    if not token:
        return flask_helper.generate_response(data=None, code=400, message="token not found")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="usere not found")

    all_tokens = lib.user.token.get_tokens_by_user_id(user.id)

    did_delete_all = True
    for token in all_tokens:
        deleted_current = lib.user.token.delete_token(token.id)
        if not deleted_current:
            did_delete_all = False

    if not did_delete_all:
        return flask_helper.generate_response(data=None, code=400, message="could not delete token")

    return flask_helper.generate_response(data="user logged out")


@bp.post("register")
def register_new_user():
    json: dict = flask.request.json
    new_user_email: str = json.get("email")
    new_user_password: str = json.get("password")
    first_name = json.get("firstname")
    last_name = json.get("lastname")

    if None in [new_user_email, new_user_password, first_name, last_name]:
        return flask_helper.generate_response(data=None, code=400, message="missing inputs")

    user = lib.user.user.get_user_by_email(new_user_email)
    if user:
        return flask_helper.generate_response(data=None, code=400, message="email already registered")

    new_user = lib.user.user.create_new_user(new_user_email, new_user_password)
    new_user.firstname = first_name
    new_user.lastname = last_name
    lib.user.user.save_user(new_user)

    lib.user.rights.create_new_user_rights(new_user.id)

    return flask_helper.generate_response(data=new_user.to_dict())


@bp.post("edit_user_rights")
def edit_user_rights():
    json: dict = flask.request.json
    auth_token = json.get("auth_token")
    if not auth_token: 
        return flask_helper.generate_response(data=None, code=400, message="token not supplied")
    
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="user not found")
    
    if not rights.can_edit_user_rights:
        return flask_helper.generate_response(data=None, code=401, message="Not allowed to edit")

    # fetch the relevant user
    user_id: str = json.get("user_id")
    if not user_id:
        return flask_helper.generate_response(data=None, code=400, message="no user id supplied")

    user = lib.user.user.get_user(user_id)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="no user found")

    user_rights = lib.user.rights.get_user_rights(user_id)
    if not user_rights:
        return flask_helper.generate_response(data=None, code=400, message="no rights found")

    # assign the user rights we want to change
    # this takes in a dict and then reads out the keys, asigning vallues if they
    updated_rights = lib.user.rights.update_rights(user_rights.id, json)
    if not updated_rights:
        return flask_helper.generate_response(data=None, code=400, message="could not update rights")
    return flask_helper.generate_response(data=updated_rights.to_dict())


@bp.post("who")
def who():
    json: dict = flask.request.json
    auth_token = json.get("auth_token")

    if not auth_token:
        return flask_helper.generate_response(data=None, code=400, message="token not supplied")

    token = lib.user.token.get_token(auth_token)
    if not token:
        return flask_helper.generate_response(data=None, code=400, message="token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return flask_helper.generate_response(data=None, code=400, message="token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="no user data")
    return flask_helper.generate_response(data=user.to_dict())


@bp.post("rights")
def rights():
    json: dict = flask.request.json
    user_id = json.get("user_id")

    if not user_id:
        return flask_helper.generate_response(data=None, code=400, message="user_id not supplied")

    rights = lib.user.rights.get_user_rights(user_id)
    if not rights:
        return flask_helper.generate_response(data=None, code=400, message="no data")

    return flask_helper.generate_response(data=rights.to_dict())


@bp.post("list_users")
def list_users():
    users = lib.user.user.get_all_users()
    users = [u.to_dict() for u in users]

    for u in users:
        u["email"] = None
        u["user_role"] = None

    return flask_helper.generate_response(data=users)


@bp.post("show_user")
def show_user():
    json: dict = flask.request.json
    user_id = json.get("user_id")

    if not user_id:
        return flask_helper.generate_response(data=None, code=400, message="user_id not provided")

    user = lib.user.user.get_user(user_id)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="user not found")

    user_dict = user.to_dict()
    user_dict["email"] = None
    user_dict["user_role"] = None

    return flask_helper.generate_response(data=user_dict)


@bp.post("edit_user")
def edit_user():
    json: dict = flask.request.json
    auth_token = json.get("auth_token")
    password = json.get("password")

    if None in [auth_token, password]:
        return flask_helper.generate_response(data=None, code=400, message="token or password not supplied")

    token = lib.user.token.get_token(auth_token)
    if not token:
        return flask_helper.generate_response(data=None, code=400, message="token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return flask_helper.generate_response(data=None, code=400, message="token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="no user data")

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return flask_helper.generate_response(data=None, code=400, message="invalid password")

    if json.get("new_password"):
        user.salt = lib.util.crypt.random_string(64)
        user.hash = lib.util.crypt.hash_with_salt(
            json.get("new_password"), user.salt)

    if json.get("firstname"):
        user.firstname = json.get("firstname")

    if json.get("lastname"):
        user.lastname = json.get("lastname")

    if json.get("new_email"):
        user.email = json.get("new_email")

    lib.user.user.save_user(user)
    return flask_helper.generate_response(data=user.to_dict())


@bp.post("delete_user")
def delete_user():
    json: dict = flask.request.json
    auth_token = json.get("auth_token")
    password = json.get("password")

    if None in [auth_token, password]:
        return flask_helper.generate_response(data=None, code=400, message="token or password not supplied")

    token = lib.user.token.get_token(auth_token)
    if not token:
        return flask_helper.generate_response(data=None, code=400, message="token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return flask_helper.generate_response(data=None, code=400, message="token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="no user data")

    pw_check = lib.util.crypt.hash_with_salt(password, user.salt)
    if pw_check != user.hash:
        return flask_helper.generate_response(data=None, code=400, message="invalid password")

    deleted = lib.user.user.delete_user(user.id)
    if not deleted:
        return flask_helper.generate_response(data=None, code=400, message="could not delete")

    return flask_helper.generate_response(data="user deleted")


@bp.post("refresh_token")
def refresh_token():
    json: dict = flask.request.json
    auth_token = json.get("auth_token")

    token = lib.user.token.get_token(auth_token)
    if not token:
        return flask_helper.generate_response(data=None, code=400, message="token invalid")

    if time.time() > token.expires_at:
        lib.user.token.delete_token(token.id)
        return flask_helper.generate_response(data=None, code=400, message="token expired")

    user = lib.user.user.get_user(token.user_id)
    if not user:
        return flask_helper.generate_response(data=None, code=400, message="no user data")

    lib.user.token.delete_token(token.id)
    new_token = lib.user.token.create_new_token(user.id)

    return flask_helper.generate_response(data=new_token.to_dict())


@bp.post("admin_test_creds")
def get_admin_test_creds():
    return flask_helper.generate_response(data=lib.util.user_api.get_admin_token()["data"])
