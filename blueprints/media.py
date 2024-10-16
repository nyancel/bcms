import threading
import flask

import lib.media.upload
import lib.media.fetch
import lib.media.morph

import lib.util.env
import lib.util.user_api
import lib.util.flask_helper

from lib.media.media_db import MediaParent, MediaInstance, MediaJointParentInstances

bp = flask.Blueprint("media", __name__)

# don't mind me :3
@bp.get("/media/media_test")
def media_test():
    return flask.render_template("pages/base.jinja")



@bp.post("/media/upload_media")
def upload_media():
    auth_token = flask.request.form.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if rights.can_post_media != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)

    if "media" not in flask.request.files:
        return lib.util.flask_helper.generate_response(message="post request is missing a file labeled 'media'", code=400)

    files = flask.request.files.getlist("media")
    data = lib.media.upload.save_flask_files(files)

    if data:
        return lib.util.flask_helper.generate_response(data)
    else:
        return lib.util.flask_helper.generate_response(message="failed to save any files", code=500)


@bp.post("/media/update_media_metadata")
def update_media_metadata():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if rights.can_update_media != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)
    
    media_ID = json_body_data.get("media_ID")
    desired_metadata_update = json_body_data.get("metadata")
    
    if not media_ID:
        return lib.util.flask_helper.generate_response(message="no media_ID value was supplied", code=400)
        
    if not desired_metadata_update:
        return lib.util.flask_helper.generate_response(message="no new metadata was supplied", code=400)
    
    
    # ensure only certain values can be changed with this endpoint
    valid_metadata_morph_keys = [
        "alt_text",
        "is_unlisted",
        "is_deleted",
        "filename",
    ]
    
    new_metadata = {}
    
    for key in valid_metadata_morph_keys:
        new_metadata[key] = desired_metadata_update.get(key)
    
    updated_metadata = lib.media.morph.update_media_metadata(media_ID, new_metadata)

    if isinstance(updated_metadata, Exception):
        return lib.util.flask_helper.generate_response(message=f"an exception occured, {updated_metadata.args[0]}", code=400)
    
    if isinstance(updated_metadata, MediaParent):
        return lib.util.flask_helper.generate_response(updated_metadata.to_dict())

    return lib.util.flask_helper.generate_response(message="an unhandled exception occured", code=400)

@bp.post("/media/fetch_media_full")
def fetch_media():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if rights.can_update_media != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)
    
    media_ID = json_body_data.get("media_ID")
    

    if not media_ID:
        return lib.util.flask_helper.generate_response(message="no media_ID given", code=400)

    data = lib.media.fetch.get_media_full(media_ID)

    if isinstance(data, Exception):
        return lib.util.flask_helper.generate_response(message=f"an exception occured, {data.args[0]}", code=500)
    
    if isinstance(data, MediaJointParentInstances):
        return lib.util.flask_helper.generate_response(data.to_dict())


@bp.post("/media/fetch_all_media_metadata")
def fetch_all_media_metadata():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
        
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if rights.can_update_media != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)

    media_parents = lib.media.fetch.get_all_media_parents()

    if media_parents == []:
        return lib.util.flask_helper.generate_response(message="the server does not have any public media on it", code=400)

    if not media_parents:
        return lib.util.flask_helper.generate_response(message="no metadata could be found", code=400)

    if isinstance(media_parents[0], MediaParent):
        return_list = []
        for media_parent in media_parents:
            return_list.append(media_parent.to_dict())
        return lib.util.flask_helper.generate_response(return_list)


@bp.get("/media/fetch_media_instance")
def fetch_media_instance():
    instance_ID = flask.request.args.get("instance_ID")

    if not instance_ID:
        return lib.util.flask_helper.generate_response(message="no instance_ID was specified", code=400)

    data = lib.media.fetch.get_specific_media_instance(instance_ID)

    if not data:
        return lib.util.flask_helper.generate_response(message="an unhandled error occured whilst fetching instance data", code=500)

    parent_ID = data["parent_id"]
    media_parent = lib.media.fetch.get_media_parent(parent_ID)

    if not media_parent:
        return lib.util.flask_helper.generate_response(message="an unhandled error occured whilst fetching metadata", code=500)

    file_extention = media_parent.file_extention
    filename = media_parent.filename

    filepath = f"volume/media/files/{parent_ID}/{instance_ID}.{file_extention}"
    return flask.send_file(filepath, download_name=f"{filename}.{file_extention}")
