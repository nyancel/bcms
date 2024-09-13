# TODO
# * media uploads
# * media thumbnails
# * media distribution

import flask
import lib.media as media

blueprint = flask.Blueprint()

@blueprint.post("/media/upload_media")
def upload_media():
    """
        TODO user authentication
    """
    
    if "media" not in flask.request.files:
        return flask.jsonify(
            {"error": "post request is missing a 'media' paramater"}
        ), 400
    
    media = flask.request.files["media"]
    success = media.upload.save_media(media)
    
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