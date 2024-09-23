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
    title: str = data.get("title")
    body: str = data.get("body")

    # Description may be empty, but should be updated before posting!
    desc: str = data.get("desc")

    user_id: str = data.get("user_id")
    draft: bool = data.get("isdraft")

    if not title or not body:
        return flask.jsonify({"error": "Post or title is empty!"}), 400
    if not user_id:
        return flask.jsonify({"error": "User_id could not be found in JSON!"}), 400

    # Create new article instance
    new_article = article.create_article(
        title=title, body=body, desc=desc, user_id=user_id, draft=draft
    )
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
    id: str = data.get("id")
    if not id:
        return flask.jsonify({"error": "Article_id is empty!"}), 400

    # Delete article
    delete_code: bool = article.delete_article(id)
    if not delete_code:
        return flask.jsonify({"error": "Could not delete article!"}), 500

    return flask.jsonify({"success": "Article successfully deleted"}), 200


@bp.post("update_article")
def update_article() -> None:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return flask.jsonify({"error": "Invalid JSON data"}), 400

    # Get relevant fields from JSON
    id: str = data.get("id")
    title: str = data.get("title")
    body: str = data.get("body")
    desc: str = data.get("desc")

    if not id:
        return flask.jsonify({"error": "Article ID is empty!"}), 400

    # Atleast title or the body needs to be edited
    if not title and not body and not desc:
        return flask.jsonify({"error": "Title/body/desc is empty!"}), 400

    fetched_article = article.get_article(id)
    if not fetched_article:
        return flask.jsonify({"error": "Article not found!"}), 400

    if title:
        fetched_article.title = title
    if body:
        fetched_article.body = body
    if desc:
        fetched_article.desc = desc

    save_code = article.save_article(fetched_article)
    if not save_code:
        return flask.jsonify({"error": "Could not save article!"}), 400

    return flask.jsonify(fetched_article.to_dict()), 200


@bp.post("list_all_articles")
def list_all_articles() -> dict:
    article_list = article.list_all_articles()
    if len(article_list) == 0:
        return flask.jsonify({"error": "No articles to list!"}), 400

    return flask.jsonify(article_list), 200


@bp.post("get_article")
def get_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return flask.jsonify({"error": "Invalid JSON data"}), 400

    # Get relevant fields from JSON
    id: str = data.get("id")

    if not id:
        return flask.jsonify({"error": "Article ID is empty!"}), 400

    fetched_article = article.get_article(id)
    if not fetched_article:
        return flask.jsonify({"error": "Article is not found!"}), 400

    return flask.jsonify(fetched_article.to_dict()), 200


@bp.post("approve_article")
def approve_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return flask.jsonify({"error": "Invalid JSON data"}), 400

    # Get relevant fields from JSON
    id: str = data.get("id")
    approved_id: str = data.get("approved_id")

    if not id or not approved_id:
        return flask.jsonify({"error": "Article ID or user ID is empty!"}), 400

    fetched_article = article.get_article(id)
    if not fetched_article:
        return flask.jsonify({"error": "Article is not found!"}), 400

    fetched_article.isDraft = False
    fetched_article.isAccepted = True
    fetched_article.isListed = True
    fetched_article.accepted_id = approved_id

    save_code = article.save_article(fetched_article)
    if not save_code:
        return flask.jsonify({"error": "Could not save article!"}), 400

    return flask.jsonify(fetched_article.to_dict()), 200
