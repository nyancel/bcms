import flask

bp = flask.Blueprint("article", __name__)


@bp.post("/article/post")
def post_article():
    pass


@bp.post("/article/delete")
def delete_article():
    pass


@bp.post("/article/edit")
def edit_article():
    pass


@bp.post("/article/list_all")
def list_all_article():
    pass


@bp.post("/article/retrieve")
def retrieve_article():
    pass
