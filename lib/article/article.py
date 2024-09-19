import lib.article.article_db as article_db

import time


def create_article(title: str, body: str, user_id: str) -> article_db.Article:
    """
    Creates and saves a new Article instance in the database.

    Parameters:
    title (str): The title of the article.
    body (str): The body content of the article.
    user_id (str): The ID of the user who created the article.

    Returns:
    article_db.Article: The newly created Article object.

    Example Usage:
    new_article = create_article("My First Article", "This is the body of the article.", "23948293482")
    """
    # Create new article instance and edit relevant fields
    new_article = article_db.Article()
    new_article.title = title
    new_article.body = body
    new_article.user_id = user_id

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
        try:
            db_session.query(article_db.Article).filter(
                article_db.Article.id == article_id
            ).delete()
            db_session.commit()
            return True
        except:
            return False


def update_article(article_id: str, title: str, body: str) -> article_db.Article:
    """
    Updates an existing article in the database with new title and/or body content.
    Also updates update_timestamp of the article.

    Parameters:
    article_id (str): The ID of the article to be updated.
    title (str): The new title for the article. If empty, the title will not be updated.
    body (str): The new body content for the article. If empty, the body will not be updated.

    Returns:
    article_db.Article: The updated Article object.
    """
    with article_db.Driver.SessionMaker() as db_session:
        article: article_db.Article = db_session.query(article_db.Article).get(
            article_id
        )
        if title:
            article.title = title
        if body:
            article.body = body

        article.update_timestamp = time.time()

        # Save changes
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

    return article


def list_all_articles() -> list:
    """
    Retrieves all articles from the database and returns a list of dictionaries representing the articles.

    The function truncates the body of each article to 200 characters.

    Returns:
    list: A list of dictionaries, each representing an article with its attributes.
    """
    articles_list = []

    # Get all articles from table
    with article_db.Driver.SessionMaker() as db_session:
        articles: list = db_session.query(article_db.Article).all()

    for article in articles:
        article.body = article.body[:200]
        articles_list.append(article.to_dict())

    return articles_list
