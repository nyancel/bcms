import flask
import lib.util.req

def generic_error(error_message: str, statuscode = 400, **kwargs: dict[str: str]) -> flask.Response:
    response_payload = {
        "success": 0,
        "message": error_message
    }
    response_payload.update(kwargs)
    
    return flask.jsonify(response_payload), statuscode

def get_user_rights_from_auth_token(auth_token: str) -> lib.util.req.UserRights | flask.Response:
    if not auth_token:
        return generic_error("auth_token not found")

    user, status_code = lib.util.req.fetch_user_from_token(auth_token)
    if status_code != 200:
        return generic_error("user data not found")

    rights, status_code = lib.util.req.fetch_rights_from_user(user.get("id"))
    if status_code != 200:
        return generic_error("could not fetch user rights")

    return rights