import json
import os
import time

import werkzeug.datastructures as flask_datastructures

def save_media(file: flask_datastructures.FileStorage) -> hash:
    """
        takes in a file and saves it using a suite of different functions
        
        returns a hash of the file, or 0 if it failed
    """
    
    print(file.mimetype)
    if file.mimetype in ["jpeg", "jpg", "png"]:
        data, hash = _save_image(file)

        success = _save_metadata(data, f"volume/media/metadata/{hash}")
        if not success:
            return success

        return hash

def _save_metadata(data, file_path):
    if os.path.exists(file_path):
        return FileExistsError("file with that hash already exists")
    
    with open(file_path, "w") as f:
        json.dump(data, f)
    
    return 1

def _save_image(image: flask_datastructures.FileStorage) -> hash:
    """
        takes in an image and uploads it to an S3 buckets
        
        returns a hash of the file
    """
    
    image_hash = image.__hash__()
    
    if not image.save(f"volume/media/files/{image_hash}"):
        return 0
    
    json_data = {
        "filename": image.name,
        "creation_date": time.time(),
        "is_deleted": False
    }
    
    return json_data, image_hash

def _save_video():
    """
        TODO
    """
    
    return None