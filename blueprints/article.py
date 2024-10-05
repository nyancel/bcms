import flask

from typing import Any, Dict, Optional

import lib.article.article as article
import lib.util.req as req
from lib.user.user_db import UserRole


def generate_error(reason: str, code: int = 400) -> flask.Response:
    return flask.jsonify({"error": reason}), code


bp = flask.Blueprint("article", __name__, url_prefix="/article/")


# TODO: hente token, hent bruker fra token, hent rettigheter fra bruker
# Sjekk om bruker kan poste artikkel
@bp.post("post_article")
def post_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return generate_error("Invalid JSON data")

    # Get relevant fields for creation
    title: str = data.get("title")
    body: str = data.get("body")

    # Description may be empty, but should be updated before posting!
    desc: str = data.get("desc")

    user_id: str = data.get("user_id")
    draft: bool = data.get("isdraft")

    if not title or not body:
        return generate_error("Post or title is empty!")
    if not user_id:
        return generate_error("User_id could not be found!")

    # Create new article instance
    new_article = article.create_article(
        title=title, body=body, desc=desc, user_id=user_id, draft=draft
    )
    if not new_article:
        return generate_error("Could not create article!")

    return flask.jsonify(new_article.to_dict()), 201


@bp.post("delete_article")
def delete_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return generate_error("Invalid JSON data!")

    # Get id from JSON
    id: str = data.get("id")
    if not id:
        return generate_error("Article_id is empty!")

    # Delete article
    delete_code: bool = article.delete_article(id)
    if not delete_code:
        return generate_error("Could not delete article!")

    return flask.jsonify({"success": "Article successfully deleted"}), 200


@bp.post("update_article")
def update_article() -> None:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return generate_error("Invalid JSON data")

    # Get relevant fields from JSON
    id: str = data.get("id")
    title: str = data.get("title")
    body: str = data.get("body")
    desc: str = data.get("desc")

    if not id:
        return generate_error("Article ID is empty!")

    # Atleast title or the body needs to be edited
    if not title and not body and not desc:
        return generate_error("Nothing to change (title/body/desc are empty)")

    fetched_article = article.get_article(id)
    if not fetched_article:
        return generate_error("No articles found with id!")

    if title:
        fetched_article.title = title
    if body:
        fetched_article.body = body
    if desc:
        fetched_article.desc = desc

    save_code = article.save_article(fetched_article)
    if not save_code:
        return generate_error("Could not save article!")

    return flask.jsonify(fetched_article.to_dict()), 200


@bp.post("list_all_articles")
def list_all_articles() -> dict:
    article_list = article.list_all_articles()
    if len(article_list) == 0:
        return generate_error("No articles to list!")

    return flask.jsonify(article_list), 200


@bp.post("get_article")
def get_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return generate_error("Invalid JSON data")

    # Get relevant fields from JSON
    id: str = data.get("id")

    if not id:
        return generate_error("Article ID is empty!")

    fetched_article = article.get_article(id)
    if not fetched_article:
        return generate_error("Article is not found!")

    # Return anyways if the fetched_article is listed on website
    if fetched_article.isListed:
        return flask.jsonify(fetched_article.to_dict()), 200

    # Check user rights for unlisted article
    auth_token = data.get("auth_token")
    if not auth_token:
        return generate_error("auth_token not found")

    user, status_code = req.fetch_user_from_token(auth_token)
    if status_code != 200:
        return generate_error("user data not found")

    rights, status_code = req.fetch_rights_from_user(user.get("id"))
    if status_code != 200:
        return generate_error("could not fetch user rights")

    if rights.can_read_drafts != True:
        return generate_error("Not allowed to fetch unlisted article", 401)

    return flask.jsonify(fetched_article.to_dict()), 200


@bp.post("approve_article")
def approve_article() -> dict:
    # Get the JSON data from the request
    data: Optional[Dict[str, Any]] = flask.request.get_json()
    if data is None:
        return generate_error("Invalid JSON data!")

    # First, check if user can approve
    auth_token = data.get("auth_token")
    if not auth_token:
        return generate_error("auth_token not found")

    user, status_code = req.fetch_user_from_token(auth_token)
    if status_code != 200:
        return generate_error("user data not found")

    user_id = user.get("id")

    rights, status_code = req.fetch_rights_from_user(user_id)
    if status_code != 200:
        return generate_error("could not fetch user rights")

    if rights.can_approve_draft != True:
        return generate_error("Not allowed to approve articles", 401)

    # Get relevant fields from JSON
    id: str = data.get("id")

    if not id:
        return generate_error("Article ID is empty!")

    fetched_article = article.get_article(id)
    if not fetched_article:
        return generate_error("Article is not found!")

    fetched_article.isDraft = False
    fetched_article.isAccepted = True
    fetched_article.isListed = True
    fetched_article.accepted_id = user_id

    save_code = article.save_article(fetched_article)
    if not save_code:
        return generate_error("Could not save article!")

    return flask.jsonify(fetched_article.to_dict()), 200
