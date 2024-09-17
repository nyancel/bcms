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
    delete_code: bool = article.delete_article(id)
    if not delete_code:
        return flask.jsonify({"error": "Could not delete article!"}), 500

    return flask.jsonify({"success": "Article successfully deleted"}), 200


@bp.post("update_article")
def update_article():
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return flask.jsonify({"error": "Invalid JSON data"}), 400

    # Get relevant fields from JSON
    id: str = data["id"]
    title: str = data["title"]
    body: str = data["body"]

    if not id:
        return flask.jsonify({"error": "Article ID is empty!"}), 400

    # Atleast title or the body needs to be edited
    if not title and not body:
        return flask.jsonify({"error": "Title/body is empty!"}), 400

    updated_article = article.update_article(id, title, body)
    if not updated_article:
        return flask.jsonify({"error": "Could not update article!"}), 400

    return flask.jsonify(updated_article.to_dict()), 200


# @bp.route("/article/list_all", methods=["GET"])
# def get_all_articles():
#     pass


# @bp.route("/article/retrieve/<int:id>", methods=["GET"])
# def get_article():
#     pass
