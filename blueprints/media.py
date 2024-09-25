import threading

import flask
import lib.util.env

import lib.media.upload
import lib.media.fetch
import lib.media.morph

bp = flask.Blueprint("media", __name__)


@bp.post("/media/upload_media")
def upload_media():
    if "media" not in flask.request.files:
        return (
            flask.jsonify(
                {"error": "post request is missing a file labeled 'media'"}),
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

@bp.post("/media/update_media_metadata")
def update_media_metadata():
    json_data: dict = flask.request.json
    media_ID = json_data.get("media_ID")

    if not media_ID:
        return flask.jsonify({"error": "no media_ID value was supplied"})
    
    # ensure only certain values can be changed with this endpoint
    valid_metadata_morph_keys = [
        "alt_text",
        "is_unlisted",
        "is_deleted",
        "filename",
    ]
    
    new_metadata = {}
    
    for key in valid_metadata_morph_keys:
        new_metadata[key] = json_data.get(key)
    
    data = lib.media.morph.update_media_metadata(media_ID, new_metadata)

    if isinstance(data, dict):
        return flask.jsonify({
            "success": 1,
            "new_metadata": data
        }), 200

    if isinstance(data, Exception):
        return flask.jsonify({"error": data.args[0]}), 400

    return flask.jsonify({"error": "an unhandled exception occured"}), 400

@bp.post("/media/fetch_media")
def fetch_media():
    json_data: dict = flask.request.json
    media_ID = json_data.get("media_ID")

    if not media_ID:
        return flask.jsonify(
            {"error": "no media_ID given"},
            400
        )

    data = lib.media.fetch.get_media_full(media_ID)
    

    if isinstance(data, Exception):
        return flask.jsonify({"error": data.args[0]}), 400
    
    return flask.jsonify(data), 200


@bp.post("/media/fetch_all_media_metadata")
def fetch_all_media_metadata():
    data = lib.media.fetch.get_all_media_metadata()

    if data == []:
        return flask.jsonify({"error": "the server does not have any public media on it"}), 400

    if not data:
        return flask.jsonify({"error": "no metadata could be found"}), 400

    return flask.jsonify(data), 200


@bp.get("/media/fetch_media_instance")
def fetch_media_instance():
    instance_ID = flask.request.args.get("instance_ID")

    if not instance_ID:
        return flask.jsonify(
            {"error": "no instance_ID given"},
            400
        )

    data = lib.media.fetch.get_specific_media_instance(instance_ID)

    if not data:
        return flask.jsonify(
            {"error": "an unhandled error occured whilst fetching instance data"},
            400
        )

    parent_ID = data["parent_id"]
    metadata = lib.media.fetch.get_media_metadata(parent_ID)

    if not metadata:
        return flask.jsonify(
            {"error": "an unhandled error occured whilst fetching metadata"},
            400
        )

    file_extention = metadata["file_extention"]
    filename = metadata["filename"]

    filepath = f"volume/media/files/{parent_ID}/{instance_ID}.{file_extention}"
    return flask.send_file(filepath, download_name=f"{filename}.{file_extention}")
