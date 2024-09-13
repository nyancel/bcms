import flask
import lib.user

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
    pass


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
def list_users():
    pass


@bp.post("edit_user")
def edit_user():
    pass


@bp.post("delete_user")
def edit_user():
    pass
