import flask
import time


def generate_response(data = None, code: int = 200, message: str = None):
    if message or code != 200:
        return flask.jsonify({
            "time": time.time(),
            "message": message or "Server failed",
            "data": data or {},
        }), code

    return flask.jsonify({
        "time": time.time(),
        "message": "OK",
        "data": data or {},
    }), code
