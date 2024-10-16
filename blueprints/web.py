import flask

bp = flask.Blueprint("web_bp", __name__)
bp.url_prefix = "/"


@bp.get("")
def web_index():
    return flask.render_template("pages/index.jinja")


@bp.get("signin")
def web_signin():
    return flask.render_template("pages/signin.jinja")


@bp.get("editor")
def web_editor():
    return flask.render_template("pages/editor.jinja")


@bp.get("article")
def web_article():
    return "hello world"


@bp.get("gallery")
def web_gallery():
    return flask.render_template("pages/gallery.jinja")


@bp.get("gallery-popup")
def web_gallery_select():
    return flask.render_template("pages/gallery_popup.jinja")


@bp.get("view")
def web_render():
    return flask.render_template("pages/view.jinja")
