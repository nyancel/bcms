import flask

import lib.article.article as article

import lib.util.flask_helper as helper
import lib.util.user_api as user_api


bp = flask.Blueprint("article", __name__, url_prefix="/article/")


@bp.post("post_article")
def post_article() -> dict:
    # Get JSON data
    data: dict = flask.request.json
    if data is None:
        return helper.generate_response(
            data=None, code=400, message="Invalid JSON data"
        )

    auth_token: str = data.get("auth_token")

    (user, rights) = user_api.get_user_and_rights_from_auth_token(auth_token)
    if not user:
        return helper.generate_response(data=None, code=400, message="User Not found")

    article_id: str = data.get("article_id")
    # Edit existing article
    if article_id:

        # Approve article
        approve: bool = data.get("approve")
        if approve:
            if not rights.can_approve_draft:
                return helper.generate_response(
                    data=None, code=400, message="Not allowed to approve article!"
                )
            fetched_article = article.approve_article(
                article_id=article_id, approved_id=user.id
            )

            if fetched_article == None:
                return helper.generate_response(
                    data=None, code=400, message="Could not save article!"
                )
            else:
                return helper.generate_response(data=fetched_article.to_dict())

        # Delete article
        delete: bool = data.get("delete")
        if delete:
            if not rights.can_delete_article:
                return helper.generate_response(
                    data=None, code=400, message="Permission to delete article"
                )

            fetched_article = article.delete_article(article_id=article_id)
            if fetched_article:
                return helper.generate_response(
                    data={"success": "Article successfully deleted"}
                )
            else:
                return helper.generate_response(
                    data=None, code=400, message="Could not delete article"
                )

        # Update article
        title: str = data.get("title")
        body: str = data.get("body")
        desc: str = data.get("desc")

        # Atleast title or the body needs to be edited
        if not (title or (body or desc)):
            return helper.generate_response(
                data=None,
                code=400,
                message="Nothing to change (title/body/desc are empty)",
            )

        if not (rights.can_edit_article):
            return helper.generate_response(
                data=None, code=400, message="Permission denied"
            )

        # Validation in library (own author can edit its own article)
        fetched_article = article.update_article(
            article_id=article_id,
            user_id=user.id,
            rights=rights.can_edit_article,
            title=title,
            body=body,
            desc=desc,
        )

        if not fetched_article:
            return helper.generate_response(
                data=None,
                code=400,
                message="Could not save article, or not appropriate rights!",
            )
        return fetched_article

    # Create new article

    # Get relevant fields for creation
    draft = True  # should always be a draft
    title: str = data.get("title")
    body: str = data.get("body")
    desc: str = data.get("desc")

    if not rights.can_post_draft:
        return helper.generate_response(
            data=None, code=400, message="Not permitted to post draft"
        )

    # Create new article instance
    new_article = article.create_article(
        title=title, body=body, desc=desc, user_id=user.id, draft=draft
    )
    if not new_article:
        return helper.generate_response(
            data=None, code=400, message="Could not create article!"
        )
    return helper.generate_response(data=new_article.to_dict())


@bp.post("list_all_articles")
def list_all_articles() -> dict:
    auth_token: str = flask.request.json.get("auth_token")
    (user, rights) = (None, None)
    if auth_token:
        (user, rights) = user_api.get_user_and_rights_from_auth_token(auth_token)

    article_list = article.list_all_articles()
    if len(article_list) == 0:
        return helper.generate_response(data=[])

    if not user:
        # only show public
        article_list = [a for a in article_list if not a.isDeleted and a.isListed]

    if not rights.can_read_all_drafts:
        # only only public and personal
        article_list = [a for a in article_list if (not a.isDeleted and a.isListed)] + [
            a for a in article_list if a.user_id == user.id
        ]

    # else we show all articles, which requires no conditionals (editorial/admin)
    articles = article.to_summary(article_list)
    return helper.generate_response(data=articles)


@bp.post("get_article")
def get_article() -> dict:
    # Get the JSON data from the request
    data: dict = flask.request.get_json()
    if data is None:
        return helper.generate_response(
            data=None, code=400, message="Invalid JSON data"
        )

    # Get relevant fields from JSON
    article_id: str = data.get("article_id")
    auth_token: str = data.get("auth_token")
    if not auth_token:
        return helper.generate_response(
            data=None, code=400, message="Missing validation"
        )

    (user, rights) = user_api.get_user_and_rights_from_auth_token(auth_token)
    if not user:
        return helper.generate_response(data=None, code=400, message="User Not found")

    if not article_id:
        return helper.generate_response(
            data=None, code=400, message="Article ID is empty!"
        )

    fetched_article = article.get_article(article_id)
    if not fetched_article:
        return helper.generate_response(
            data=None, code=400, message="Article is not found!"
        )

    can_read = False
    if not fetched_article.isDeleted and fetched_article.isListed:
        can_read = True
    if user and fetched_article.user_id == user.id:
        can_read = True
    if rights and rights.can_read_all_drafts:
        can_read = True

    if not can_read:
        return helper.generate_response(data=None, code=400, message="Not permitted")
    return helper.generate_response(data=fetched_article.to_dict())
