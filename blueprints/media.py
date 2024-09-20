import threading

import flask
import lib.media.upload
import lib.media.fetch

bp = flask.Blueprint("media", __name__)


@bp.post("/media/upload_media")
def upload_media():
    if "media" not in flask.request.files:
        return (
            flask.jsonify({"error": "post request is missing a file labeled 'media'"}),
            400,
        )

    files = flask.request.files.getlist("media")
    success_check = lib.media.upload.save_files(files)

    return (
        flask.jsonify(
            {"message": "File upload request recieved", "data": success_check}
        ),
        200,
    )


@bp.post("/media/fetch_media")
def fetch_media():
    media_ID = flask.request.args.get("media_ID")
    
    if not media_ID:
        return flask.jsonify(
            {"error": "no media_ID given"},
            400
        )
    
    data = lib.media.fetch.get_media_full(media_ID)
    
    if isinstance(data, Exception):
        return flask.jsonify({"error": data.args[0]}), 400

    return flask.jsonify(data), 200
