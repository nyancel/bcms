# TODO
# * media uploads
# * media thumbnails
# * media distribution

import flask
import lib.media.upload

bp = flask.Blueprint("media", __name__)

@bp.post("/media/upload_media")
def upload_media():
    """
        TODO user authentication
    """
    
    if "media" not in flask.request.files:
        return flask.jsonify(
            {"error": "post request is missing a file named 'media'"}
        ), 400
    
    media_file = flask.request.files["media"]
    success = lib.media.upload.save_media(media_file)
    
    if not success:
        return flask.jsonify(
            {"error": "an unknown error occured whilst saving the file"}
        ), 404

    return flask.jsonify({
        "message": f"File upload successful!"
    }), 200


# @blueprint.post("/media/delete")
# def delete():
#     return flask.jsonify(user)