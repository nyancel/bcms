"""
Populates the articles database with random articles and pictures

NOTE: You need to manually approve the articles in the database (SQL browser) 
for the articles to show on the website!
"""

from lib.article.article import create_article
from blueprints.article import approve_article

lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

if __name__ == "__main__":

    for i in range(10):
        article = create_article(
            title=f"Article {i}",
            desc=lorem[:200],
            body=[
                {"type": "paragraph", "text": lorem},
                {
                    "type": "image",
                    "src_id": "https://picsum.photos/200/100",
                    "text": "Random image",
                },
            ],
            user_id="journalist",
            draft=0,
        )
