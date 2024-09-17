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
    
    files = flask.request.files.getlist("media")
    success_check = lib.media.upload.save_files(files)
    
    print(success_check)
    
    # if isinstance(success_check, FileExistsError):
    #     return flask.jsonify(success_check), 400
    
    # if isinstance(success_check, Exception):
    #     return flask.jsonify({
    #         "error": f"an unhandled error '{str(success_check)}' occured whilst uploading the file"
    #     }), 500
    
    return flask.jsonify({
        "message": "File upload successful!",
        "data": success_check
    }), 200




# @blueprint.post("/media/delete")
# def delete():
#     return flask.jsonify(user)