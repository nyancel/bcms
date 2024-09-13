# TODO
# * media uploads
# * media thumbnails
# * media distribution

import flask
import lib.media as media

blueprint = flask.Blueprint()

@blueprint.post("/media/upload")
def upload():
    """
        TODO user authentication
    """
    
    if "image" not in flask.request.files:
        return flask.jsonify(
            {"error": "post request is missing a 'image' paramater"}
        ), 400
    
    image = flask.request.files["image"]
    success = media.upload.save_image(image)
    
    if not success:
        return flask.jsonify(
            {"error": "an unknown error occured whilst saving the image"}
        ), 404

    return flask.jsonify({
        "message": f"File upload successful!"
    }), 200


# @blueprint.post("/media/delete")
# def delete():
#     return flask.jsonify(user)