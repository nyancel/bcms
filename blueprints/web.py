import flask

bp = flask.Blueprint("web_bp", __name__)
bp.url_prefix = "/"


@bp.get("")
def web_index():
    return "hello world"


@bp.get("/signin")
def web_signin():
    return "hello world"


@bp.get("/editor")
def web_editor():
    return "hello world"


@bp.get("/article/<string:id>")
def web_article():
    return "hello world"
