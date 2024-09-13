import flask
import lib.user

bp = flask.Blueprint()

@bp.post("/user/login")
def login():
    return flask.jsonify(user)