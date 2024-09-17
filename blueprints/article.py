import flask

from typing import Any, Dict, Optional

import lib.article.article as article

bp = flask.Blueprint("article", __name__, url_prefix="/article/")

# INPUT - JSON, OUTPUT - JSON


@bp.post("new_article")
def post_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return flask.jsonify({"error": "Invalid JSON data"}), 400

    # Get relevant fields for creation
    title: str = data["title"]
    body: str = data["body"]
    user_id: str = data["user_id"]

    if not title or not body:
        return flask.jsonify({"error": "Post or title is empty!"}), 400
    if not user_id:
        return flask.jsonify({"error": "User_id could not be found in JSON!"}), 400

    # Create new article instance
    new_article = article.create_article(title=title, body=body, user_id=user_id)
    if not new_article:
        return flask.jsonify({"error": "Could not create article!"}), 400

    return flask.jsonify(new_article.to_dict()), 201


@bp.post("delete_article")
def delete_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return flask.jsonify({"error": "Invalid JSON data"}), 400

    # Get id from JSON
    id: str = data["id"]
    if not id:
        return flask.jsonify({"error": "Article_id is empty!"}), 400

    # Delete article
    delete_code = article.delete_article(id)
    if not delete_code:
        return flask.jsonify({"error": "Could not delete article!"}), 500

    return flask.jsonify({"success": "Article successfully deleted"}), 200


# @bp.route("/article/edit/<int:id>", methods=["PUT"])
# def update_article(id: int):
#     # Get the relevant article from database
#     db_session = article_db.Driver.SessionMaker()

#     article = db_session.get(Article, {"id": id})
#     if article == None:
#         return flask.jsonify({"error": "Could not find post!"}), 400

#     data = request.get_json()

#     if "title" not in data and "body" not in data:
#         return flask.jsonify({"error": "Updates to article is empty!"}), 400

#     with article_db.Driver.SessionMaker() as db_session:
#         """
#         TODO
#         - check if title or body has changed, update row if yes
#         """
#         db_session.query(Article).filter(Article.id == id).update.({"title": data["title"]})
#         db_session.query(Article).filter(Article.id == id).update.({"body": data["body"]})
#         db_session.commit()

#     # Modify title or body
#     if "title" in data and data["title"] != db_session.title:
#         return flask.jsonify({"error": "Could not find post!"}), 400

#     ## UPDATER FUNCTION

#     db_session.close()


# @bp.route("/article/list_all", methods=["GET"])
# def get_all_articles():
#     pass


# @bp.route("/article/retrieve/<int:id>", methods=["GET"])
# def get_article():
#     pass
