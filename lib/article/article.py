import lib.article.article_db as article_db


def create_article(title: str, body: str, user_id: str) -> article_db.Article:
    # Add the article to the database session and commit the changes
    new_article = article_db.Article()
    new_article.title = title
    new_article.body = body
    new_article.user_id = user_id

    with article_db.Driver.SessionMaker() as db_session:
        db_session.add(new_article)  # Overskriver hvis ID er det samme!
        db_session.commit()

    return new_article
