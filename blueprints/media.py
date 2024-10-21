import threading
import flask

import lib.media.upload
import lib.media.fetch
import lib.media.morph

import lib.util.env
import lib.util.user_api
import lib.util.flask_helper
import lib.util.media_api


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
    
    if not auth_token:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"could not fetch the rights for the supplied user", code=401)
    
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
    
    if not auth_token:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"could not fetch the rights for the supplied user", code=401)
        
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

@bp.post("/media/fetch_media_parent_and_instances")
def fetch_media_parent_and_instances():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    
    if not auth_token:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"could not fetch the rights for the supplied user", code=401)
        
    if rights.can_request_media_IDs != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)
    
    media_ID = json_body_data.get("media_ID")

    if not media_ID:
        return lib.util.flask_helper.generate_response(message="no media_ID given", code=400)

    data = lib.media.fetch.get_media_full(media_ID)

    if isinstance(data, Exception):
        return lib.util.flask_helper.generate_response(message=f"an exception occured, {data.args[0]}", code=500)
    
    if isinstance(data, MediaJointParentInstances):
        return lib.util.flask_helper.generate_response(data.to_dict())
    
    return lib.util.flask_helper.generate_response(message="an unhandled error occured", code=500)


@bp.post("/media/fetch_all_media_parents")
def fetch_all_media_parents():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    
    if not auth_token:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"could not fetch the rights for the supplied user", code=401)
        
    if rights.can_request_media_IDs != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)

    media_parents = lib.media.fetch.get_all_media_parents()

    if media_parents == []:
        return lib.util.flask_helper.generate_response(message="the server does not have any public media on it", code=400)

    if not media_parents:
        return lib.util.flask_helper.generate_response(message="no metadata could be found", code=400)

    if isinstance(media_parents[0], MediaParent):
        return lib.util.flask_helper.generate_response([parent.to_dict() for parent in media_parents])
    
    return lib.util.flask_helper.generate_response(message="an unhandled error occured", code=500)

@bp.post("/media/fetch_all_media_parents_and_instances")
def fetch_all_media_parents_and_instances():
    json_body_data: dict = flask.request.json
    
    auth_token = json_body_data.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    
    if not auth_token:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"could not fetch the rights for the supplied user", code=401)
        
    if rights.can_request_media_IDs != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)

    media_parents = lib.media.fetch.get_all_media_parents()
    
    full_media_list: list[MediaJointParentInstances] = []
    for parent in media_parents:
        full_media_list.append(lib.util.media_api.get_media_parent_and_instances(parent.id))
    
    if full_media_list == []:
        return lib.util.flask_helper.generate_response(message="the server does not have any public media on it", code=400)

    if not full_media_list:
        return lib.util.flask_helper.generate_response(message="no metadata could be found", code=400)

    if isinstance(full_media_list[0], MediaJointParentInstances):
        return lib.util.flask_helper.generate_response([joint.to_dict() for joint in full_media_list])

# generic function for the two endpoints underneath
def fetch_media_instance_for_resolution_bureaucracy(flask_request: flask.request, dimension_check: str):
    if dimension_check not in ["height", "width"]:
        return lib.util.flask_helper.generate_response(message=f"tried fetching instance for invalid dimension", code=401)
    
    json_body_data: dict = flask_request.json
    
    auth_token = json_body_data.get("auth_token")
    user, rights = lib.util.user_api.get_user_and_rights_from_auth_token(auth_token)
    
    if not auth_token:
        return lib.util.flask_helper.generate_response(message=f"no auth_token was supplied with the request", code=401)
    
    if not rights:
        return lib.util.flask_helper.generate_response(message=f"could not fetch the rights for the supplied user", code=401)
        
    if rights.can_request_media_IDs != True:
        return lib.util.flask_helper.generate_response(message=f"you lack the permissions for this action", code=401)

    media_ID = json_body_data.get("media_ID")
    if not media_ID:
        return lib.util.flask_helper.generate_response(message=f"no media_ID was supplied", code=401)
    
    desired_size = json_body_data.get("desired_size")
    if not desired_size:
        return lib.util.flask_helper.generate_response(message=f"no desired_size was supplied", code=401)
    
    if dimension_check == "height":
        media_instance = lib.util.media_api.get_media_instance_for_resolution_height(media_ID, desired_size)
    else:
        media_instance = lib.util.media_api.get_media_instance_for_resolution_width(media_ID, desired_size)
    
    if isinstance(media_instance, MediaInstance):
        return lib.util.flask_helper.generate_response(media_instance.to_dict())
    
    return lib.util.flask_helper.generate_response(message="an unhandled error occured", code=500)

@bp.post("/media/fetch_media_instance_for_resolution_height")
def fetch_media_instance_for_resolution_height():
    response: flask.Response = fetch_media_instance_for_resolution_bureaucracy(flask.request, "height")
    return response

@bp.post("/media/fetch_media_instance_for_resolution_width")
def fetch_media_instance_for_resolution_width():
    response: flask.Response = fetch_media_instance_for_resolution_bureaucracy(flask.request, "width")
    return response


@bp.get("/media/fetch_media_instance")
def fetch_media_instance():
    instance_ID = flask.request.args.get("instance_ID")

    if not instance_ID:
        return lib.util.flask_helper.generate_response(message="no instance_ID was specified", code=400)

    data = lib.media.fetch.get_specific_media_instance(instance_ID)

    if not data:
        return lib.util.flask_helper.generate_response(message="an unhandled error occured whilst fetching instance data", code=500)

    parent_ID = data.parent_id
    media_parent = lib.media.fetch.get_media_parent(parent_ID)

    if not media_parent:
        return lib.util.flask_helper.generate_response(message="an unhandled error occured whilst fetching metadata", code=500)

    file_extention = media_parent.file_extention
    filename = media_parent.filename

    filepath = f"volume/media/{parent_ID}/{instance_ID}.{file_extention}"
    return flask.send_file(filepath, download_name=f"{filename}.{file_extention}")

