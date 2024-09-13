import flask
import lib.user

bp = flask.Blueprint("user_bp", __name__)
bp.url_prefix = "/user/"


@bp.post("login")
def login():
    return flask.jsonify(user)
