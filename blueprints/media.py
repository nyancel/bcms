import threading
import flask

import lib.util.env
import lib.util.req

import lib.media.upload
import lib.media.fetch
import lib.media.morph
import lib.media.lib

bp = flask.Blueprint("media", __name__)


@bp.post("/media/upload_media")
def upload_media():
    auth_token = flask.request.form.get("auth_token")
    rights = lib.media.lib.get_user_rights_from_auth_token(auth_token)
    if not isinstance(rights, lib.util.req.UserRights):
        return rights
    
    if rights.can_post_media != True:
        return lib.media.lib.generic_error(f"you lack the permissions for this action", statuscode=401)

    if "media" not in flask.request.files:
        return lib.media.lib.generic_error("post request is missing a file labeled 'media'")

    files = flask.request.files.getlist("media")
    success_check = lib.media.upload.save_files(files)

    return flask.jsonify({
            "success": 1,
            "message": "File upload request recieved",
            "data": success_check
        }), 200

@bp.post("/media/update_media_metadata")
def update_media_metadata():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    rights = lib.media.lib.get_user_rights_from_auth_token(auth_token)
    if not isinstance(rights, lib.util.req.UserRights):
        return rights
    
    if rights.can_update_media != True:
        return lib.media.lib.generic_error(f"you lack the permissions for this action", statuscode=401)
    
    media_ID = json_body_data.get("media_ID")

    if not media_ID:
        return lib.media.lib.generic_error("no media_ID value was supplied")
    
    # ensure only certain values can be changed with this endpoint
    valid_metadata_morph_keys = [
        "alt_text",
        "is_unlisted",
        "is_deleted",
        "filename",
    ]
    
    new_metadata = {}
    
    for key in valid_metadata_morph_keys:
        new_metadata[key] = json_body_data.get(key)
    
    data = lib.media.morph.update_media_metadata(media_ID, new_metadata)

    if isinstance(data, dict):
        return flask.jsonify({
            "success": 1,
            "new_metadata": data
        }), 200

    if isinstance(data, Exception):
        return lib.media.lib.generic_error(
            "an exception occured",
            {"error": data.args[0]}
        )
    
    return flask.jsonify({"error": "an unhandled exception occured"}), 400

@bp.post("/media/fetch_media")
def fetch_media():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    rights = lib.media.lib.get_user_rights_from_auth_token(auth_token)
    if not isinstance(rights, lib.util.req.UserRights):
        return rights
    
    if rights.can_update_media != True:
        return lib.media.lib.generic_error(f"you lack the permissions for this action", statuscode=401)
    
    media_ID = json_body_data.get("media_ID")

    if not media_ID:
        return lib.media.lib.generic_error("no media_ID given")

    data = lib.media.fetch.get_media_full(media_ID)
    

    if isinstance(data, Exception):
        return lib.media.lib.generic_error(
            "an exception occured",
            {"error": data.args[0]}
        )
    
    return flask.jsonify(data), 200


@bp.post("/media/fetch_all_media_metadata")
def fetch_all_media_metadata():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    rights = lib.media.lib.get_user_rights_from_auth_token(auth_token)
    if not isinstance(rights, lib.util.req.UserRights):
        return rights
    
    if rights.can_update_media != True:
        return lib.media.lib.generic_error(f"you lack the permissions for this action", statuscode=401)
    
    data = lib.media.fetch.get_all_media_metadata()

    if data == []:
        return lib.media.lib.generic_error("the server does not have any public media on it")

    if not data:
        return lib.media.lib.generic_error("no metadata could be found")

    return flask.jsonify(data), 200


@bp.get("/media/fetch_media_instance")
def fetch_media_instance():
    instance_ID = flask.request.args.get("instance_ID")

    if not instance_ID:
        return lib.media.lib.generic_error("no instance_ID was specified")

    data = lib.media.fetch.get_specific_media_instance(instance_ID)

    if not data:
        return lib.media.lib.generic_error("an unhandled error occured whilst fetching instance data")

    parent_ID = data["parent_id"]
    metadata = lib.media.fetch.get_media_metadata(parent_ID)

    if not metadata:
        return lib.media.lib.generic_error("an unhandled error occured whilst fetching metadata")

    file_extention = metadata["file_extention"]
    filename = metadata["filename"]

    filepath = f"volume/media/files/{parent_ID}/{instance_ID}.{file_extention}"
    return flask.send_file(filepath, download_name=f"{filename}.{file_extention}")
