import flask

import blueprints.article
import blueprints.user

server = flask.Flask(__name__)
server.register_blueprint(blueprints.article.bp)
server.register_blueprint(blueprints.user.bp)

@server.post("/ping")
def sanity():
    return "pong"

if __name__ == "__main__":
    server.debug = True
    server.run("0.0.0.0", port=3000)

