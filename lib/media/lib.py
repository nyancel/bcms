import flask

def generic_error(error_message: str, statuscode = 400, **kwargs: dict[str: str]) -> flask.Response:
    response_payload = {
        "success": 0,
        "message": error_message
    }
    response_payload.update(kwargs)
    
    return flask.jsonify(response_payload), statuscode
