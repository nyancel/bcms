import flask

import lib.util.env as env
import lib.util.req as req

import blueprints.article
import blueprints.media
import blueprints.user
import blueprints.web


server = flask.Flask(__name__)
server.register_blueprint(blueprints.article.bp)
server.register_blueprint(blueprints.media.bp)
server.register_blueprint(blueprints.user.bp)
server.register_blueprint(blueprints.web.bp)

server.secret_key = env.SECRET_KEY


# temporary test routes
if not env.IS_PROD:
    @server.post("/ping")
    def sanity():
        return "pong"

    @server.get("/admin")
    def sanity_admin():
        return flask.jsonify(req.get_admin_token())


if __name__ == "__main__":
    server.debug = True
    server.run("0.0.0.0", port=3000)
