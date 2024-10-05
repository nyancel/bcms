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


# TODO: ENDRE FUNKSJON, slik at man får bilde, id til title, author_id
# TENK PÅ ALT FRONTEND TRENGER FOR Å DISPLAYE <33
def list_all_articles() -> list:
    """
    Retrieves all articles from the database and returns a list of dictionaries representing the articles.

    The function truncates the total paragraphs of each article to 200 characters.

    Returns:
    list: A list of dictionaries, each representing an article with its attributes.
    """
    articles_list = []

    # Get all articles from table
    with article_db.Driver.SessionMaker() as db_session:
        articles: list = db_session.query(article_db.Article).all()

    for article in articles:
        if article.isDeleted or not article.isListed:
            continue

        article_body = json.loads(article.body)

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
