import flask

import blueprints.article

server = flask.Flask(__name__)
server.register_blueprint(blueprints.article.bp)

if __name__ == "__main__":
    server.run()

