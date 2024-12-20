import lib.article.article_db as article_db

import time
import json
from typing import Optional


def create_article(
    title: str, body: str, user_id: str, draft: bool, desc: Optional[str]
) -> article_db.Article:
    """
    Creates and saves a new Article instance in the database.

    Parameters:
    title (str): The title of the article.
    body (str): The body content of the article.
    user_id (str): The ID of the user who created the article.
    draft (bool):

    Returns:
    article_db.Article: The newly created Article object.

    Example Usage:
    new_article = create_article("My First Article", "This is the body of the article.", "23948293482")
    """
    # Create new article instance and edit relevant fields
    new_article = article_db.Article()
    new_article.title = title
    new_article.user_id = user_id

    # If direct post without draft
    if draft == False:
        new_article.isDraft = draft

    # Convert body:list to JSON string
    new_article.body = json.dumps(body)

    new_article.desc = desc if desc else ""

    # Add to database
    with article_db.Driver.SessionMaker() as db_session:
        db_session.add(new_article)
        db_session.commit()

    return new_article


def delete_article(article_id: str) -> bool:
    """
    Deletes an article from the database by its ID.

    Parameters:
    article_id (str): The ID of the article to be deleted.

    Returns:
    bool: True if the article was successfully deleted, False otherwise.
    """
    with article_db.Driver.SessionMaker() as db_session:
        article = (
            db_session.query(article_db.Article)
            .filter(article_db.Article.id == article_id)
            .first()
        )
        db_session.commit()

        if not article:
            return False

        article.isDeleted = True
        article.isDraft = False
        article.isListed = False
        db_session.add(article)
        db_session.commit()

    return True


def update_article(
    article_id: str, user_id: str, rights: str, title: str, body: str, desc: str
) -> article_db.Article:
    """
    Update an article in the database.

    Args:
        article_id (str): The ID of the article to update.
        user_id (str): The ID of the user attempting to update the article.
        rights (str): The rights of the user (e.g., admin rights).
        title (str): The new title for the article.
        body (str): The new body content for the article.
        desc (str): The new description for the article.

    Returns:
        article_db.Article: The updated article object if the update was successful.
        None: If the article does not exist or the user does not have the rights to update it.
    """
    with article_db.Driver.SessionMaker() as db_session:
        article: article_db.Article = db_session.query(article_db.Article).get(
            article_id
        )
        if not article:
            return None

        # Additonal check if user owns article
        if not rights:
            if user_id != article.user_id:
                return None

        if title:
            article.title = title

        if body:
            article.body = body

        if desc:
            article.desc = desc

        db_session.add(article)
        db_session.commit()

    return article


def approve_article(article_id: str, approved_id: str) -> article_db.Article:
    """
    Approve an article by updating its status and setting the approved ID.

    This function marks an article as accepted, listed, and no longer a draft.
    It also sets the `accepted_id` to the provided `approved_id`.

    Args:
        article_id (str): The ID of the article to approve.
        approved_id (str): The ID to set as the approved ID for the article.

    Returns:
        article_db.Article: The updated article object if the approval was successful.
        None: If the article does not exist.
    """
    with article_db.Driver.SessionMaker() as db_session:
        article: article_db.Article = db_session.query(article_db.Article).get(
            article_id
        )
        if not article:
            return None

        article.isDraft = False
        article.isAccepted = True
        article.isListed = True
        article.accepted_id = approved_id
        db_session.add(article)
        db_session.commit()

    return article


def get_article(article_id: str) -> article_db.Article:
    """
    Retrieves an article from the database by its ID.

    Parameters:
    article_id (str): The ID of the article to be retrieved.

    Returns:
    article_db.Article: The Article object corresponding to the provided ID.
    """
    with article_db.Driver.SessionMaker() as db_session:
        article: article_db.Article = db_session.query(article_db.Article).get(
            article_id
        )
        if not article:
            return None

        # Return body as JSON string
        article.body = json.loads(article.body)

    return article


def save_article(article: article_db.Article):
    """
    Saves an article to the database, updating its timestamp.

    Parameters:
    article (article_db.Article): The Article object to be saved.

    Returns:
    bool: True if the article was successfully saved, False otherwise.
    """
    with article_db.Driver.SessionMaker() as db_session:
        try:
            article.update_timestamp = time.time()

            # Ensure the body is serialized to a JSON string
            if isinstance(article.body, list):
                article.body = json.dumps(article.body)

            # Save changes
            db_session.add(article)
            db_session.commit()
        except Exception as error:
            print("An exception occurred:", type(error).__name__, error)
            return False

    return True


def list_all_articles() -> list[article_db.Article]:
    # Get all articles from table
    with article_db.Driver.SessionMaker() as db_session:
        articles = db_session.query(article_db.Article).all()
    return articles


def to_summary(articles: list[article_db.Article]) -> list[dict]:
    articles_list = []

    for article in articles:
        article_body = json.loads(article.body)

        image = ""
        for item in article_body:
            try:
                if item.get("type") == "image":
                    image = item
            except:
                pass

        articles_list.append(
            {
                "id": article.id,
                "title": article.title,
                "desc": article.desc,
                "user_id": article.user_id,
                "image": image,
            }
        )
    return articles_list
