import flask

import lib.util.env as env

import blueprints.article
import blueprints.media
import blueprints.user


server = flask.Flask(__name__)
server.register_blueprint(blueprints.article.bp)
server.register_blueprint(blueprints.media.bp)
server.register_blueprint(blueprints.user.bp)

server.secret_key = env.SECRET_KEY

@server.post("/ping")
def sanity():
    return "pong"


if __name__ == "__main__":
    server.debug = True
    server.run("0.0.0.0", port=3000)
