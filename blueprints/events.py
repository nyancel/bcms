import flask

bp = flask.Blueprint("event_blueprint", __name__)
bp.url_prefix = "/event/"

@bp.post("subscribe")
def subscribe():
    json: dict = flask.request.json
    endpoint = json.get("endpoint")
    key = json.get("key")

    subscribers.add(endpoint, key)

@bp.post("submit")
def submit():
    json: dict = flask.request.json
    event_data = json.get("event_data")
    key = json.get("key")

    for s in subscribers:
        request.send(s.endpoint, payload=event_data)

@bp.post("lookup")
def lookup():
    json : dict = flask.request.json
    datalook = json.get("looking")
    key = json.get("key")
    
    if None in [datalook, key]:
        return flask.jsonify(
            {"error": "missing info, idk"}
        ), 400
    
    