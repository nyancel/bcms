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
            {"error": "post request is missing a file labeled 'media'"}
        ), 400
    
    media_file = flask.request.files["media"]
    success_check = lib.media.upload.save_media(media_file)
    
    if success_check == 1:
        return flask.jsonify({
            "message": f"File upload successful!"
        }), 200
            
    if isinstance(success_check, FileExistsError):
        return flask.jsonify(success_check.args), 400
    
    if isinstance(success_check, Exception):
        return flask.jsonify({
            "error": f"an unhandled error '{str(success_check)}' occured whilst uploading the file"
        })
    return flask.jsonify({
        "error": "an unknown error occured whilst uploading the file"
    }), 500




# @blueprint.post("/media/delete")
# def delete():
#     return flask.jsonify(user)