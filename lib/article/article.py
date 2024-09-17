import lib.article.article_db as article_db


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
