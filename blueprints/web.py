import flask

bp = flask.Blueprint("web_bp", __name__)
bp.url_prefix = "/"


@bp.get("")
def web_index():
    return flask.render_template("pages/index.jinja")


@bp.get("signin")
def web_signin():
    return "hello world"


@bp.get("editor")
def web_editor():
    return flask.render_template("pages/editor.jinja")


@bp.get("article")
def web_article():
    return "hello world"


@bp.get("gallery")
def web_gallery():
    return flask.render_template("pages/gallery.jinja")
