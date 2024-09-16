import flask
import lib.user
import lib.user.user

bp = flask.Blueprint("user_bp", __name__)
bp.url_prefix = "/user/"


@bp.post("login")
def login():
    pass


@bp.post("logout")
def logout():
    pass


@bp.post("register_new_user")
def register_new_user():
    json: dict = flask.request.json
    new_user_email: str = json.get("email")
    new_user_password: str = json.get("password")

    if None in [new_user_email, new_user_password]:
        return flask.jsonify(
            {"error": "missing email or password"}
        ), 400

    new_user = lib.user.user.create_new_user(new_user_email, new_user_password)

    if json.get("firstname"):
        new_user.first_name = json.get("firstname")
    if json.get("lastname"):
        new_user.last_name = json.get("lastname")
    lib.user.user.save_user(new_user)

    return flask.jsonify(new_user.to_dict()), 200


@bp.post("me")
def me():
    """
    Returns info about who the current user is logged in as
    """
    pass


@bp.post("list_users")
def list_users():
    pass


@bp.post("show_user")
def show_user():
    pass


@bp.post("edit_user")
def edit_user():
    pass


@bp.post("delete_user")
def delete_user():
    pass
