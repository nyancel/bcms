import flask
import lib.events.event_db as event_db

import lib.events.events as events

bp = flask.Blueprint("event_blueprint", __name__)
bp.url_prefix = "/event/"

@bp.post("subscribe")
def subscribe():
    json: dict = flask.request.json
    endpoint = json.get("endpoint")
    key = json.get("key")

    events.notify_subscribers(key,endpoint)
    
    # subscribers.add(endpoint, key)

@bp.post("submit")
def submit():
    json: dict = flask.request.json
    event_data = json.get("event_data")
    key = json.get("key")

    if None in [event_data, key]:
        return flask.jsonify(
            {"error": "missing event data or key"}
        ), 400

    # Create a new event using the `submit_event` function
    event_id = events.submit_event(key, event_data)
    
    # Notify all subscribers
    # events.notify_subscribers(key, event_id)

    return flask.jsonify({"success": True, "event_id": event_id}), 200


@bp.post("lookup")
def lookup():
    json : dict = flask.request.json
    datalook = json.get("looking")
    key = json.get("key")
    
    if None in [datalook, key]:
        return flask.jsonify(
            {"error": "missing info, idk"}
        ), 400
    
    