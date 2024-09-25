import flask

def generate_generic_error(error_message: str, **kwargs: dict[str: str]) -> flask.Response:
    response_payload = {
        "success": 0,
        "message": error_message
    }
    response_payload.update(kwargs)
    
    return flask.jsonify(response_payload), 400