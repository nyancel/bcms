"""
Testing for article blueprint <33
NOTE: Unit test may not be accurate if the underlying database with fields are changed!
TODO: Etterpå - test med user auth
"""

import json

import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import server

server.server.testing = True
client = server.server.test_client()


class articleTest:
    def __init__(self) -> None:
        self.id = None
        self.input_data = {
            "title": "Tittel 1",
            "body": [
                {"type": "paragraph", "content": "Dette er det andre paragrafet"},
                {"type": "paragraph", "content": "Dette er det første paragrafet"},
                {
                    "type": "image",
                    "src": "https://cdn.bifrost.com/media123.png",
                    "alt": "bilde av en hund",
                },
            ],
            "user_id": "22324",
        }

        self.run()

    def run(self):
        self.test_post_article()
        self.test_update_article()
        self.test_get_article()
        self.test_approve_article()
        self.test_delete_article()

    def test_post_article(self):
        request = client.post("/article/post_article", json=self.input_data)
        request_data = json.loads(request.data)
        assert request.status_code == 201
        assert all(item in request_data for item in self.input_data)

        # Set article id so it can be used later
        self.id = request_data["id"]

    def test_update_article(self):
        update_data = {"id": self.id, "desc": "Description"}

        request = client.post("/article/update_article", json=update_data)
        request_data = json.loads(request.data)
        assert request.status_code == 200
        assert all(item in request_data for item in update_data)

    def test_get_article(self):
        article_id = {"id": self.id}
        request = client.post("/article/get_article", json=article_id)
        request_data = json.loads(request.data)
        assert request.status_code == 200
        assert request_data["id"] == self.id

    def test_approve_article(self):
        approve_data = {"id": self.id, "approved_id": "23424sdfwa345"}
        request = client.post("/article/approve_article", json=approve_data)
        request_data = json.loads(request.data)
        assert request.status_code == 200
        assert all(item in request_data for item in self.input_data)

    def test_delete_article(self):
        article_id = {"id": self.id}
        request = client.post("/article/delete_article", json=article_id)
        assert request.status_code == 200


if __name__ == "__main__":
    articleTest()
