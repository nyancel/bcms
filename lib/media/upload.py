import json
import os
import PIL.Image
import time
import math
import io

import werkzeug.datastructures as flask_datastructures

# a list of all the resolutions uploaded images should be available in
# if a file is not 16x9 the image width or height will be bigger
# the original file's resolution is also saved if it's not in this list
desired_image_resolutions = [
    1080,
    720,
    540,
    360,
]

def save_media(file: flask_datastructures.FileStorage) -> hash:
    """
        takes in a file and saves it using a suite of different functions
        
        returns a hash of the file, or 0 if it failed
    """
    
    print(file.mimetype)
    if file.mimetype in ["image/jpeg", "image/png"]:
        hash = file.__hash__()
        
        metadata = _save_image(file, hash)
        if not metadata:
            return metadata

        success = _save_metadata(metadata, f"volume/media/metadata/{hash}.json")
        if not success:
            return success

        return hash

def _save_metadata(metadata, file_path):
    if os.path.exists(file_path):
        return FileExistsError("metadata with that filename already exists")
    
    with open(file_path, "w") as f:
        json.dump(metadata, f)
    
    return 1

def _save_image(uploaded_image: flask_datastructures.FileStorage, image_hash) -> dict:
    """
        takes in an image and uploads it to an S3 buckets
    """
    image_path = f"volume/media/files/{image_hash}"
    filename = uploaded_image.filename.rsplit(".")[0]
    file_extention = uploaded_image.filename.split(".")[-1]
    
    available_image_resolutions = []
    
    def _save_image_to_S3(image: PIL.Image):
        available_image_resolutions.append(image.size)
        
        image_size = f"{image.size[0]}_{image.size[1]}"
        image.save(f"{image_path}/{image_size}.{file_extention}", optimize=True, quality=95)
    
    if os.path.isdir(image_path):
        return FileExistsError("an image with that hash is already saved")
    
    os.mkdir(image_path)
    image_bytes = io.BytesIO(uploaded_image.stream.read())
    pillow_image_data = PIL.Image.open(image_bytes)
    
    image_width, image_height = pillow_image_data.size
    _save_image_to_S3(pillow_image_data)
    
    for resolution in desired_image_resolutions:
        if resolution != min(image_width, image_height): # make sure we don't save two images of the same resolution
            resized_image = resize_pillow_image(pillow_image_data, resolution)
            _save_image_to_S3(resized_image)
        

    
    metadata = {
        "filename": filename,
        "file_extention": file_extention,
        "file_mimetype": uploaded_image.mimetype,
        "creation_time": time.time(), # the creation time is saved after everything is done, unsure if this should be changed to when the request to save is recieved
        "is_deleted": False,
        "available_image_resolutions": available_image_resolutions
    }
    
    return metadata

def _save_video():
    """
        TODO
    """
    
    return None

def resize_pillow_image(image: PIL.Image, desired_resolution: int) -> PIL.Image:
    image_width, image_height = image.size
    
    smallest_axis_size = min(image_width, image_height)
    
    image_scale = desired_resolution / smallest_axis_size
    
    new_width = int(image_width * image_scale)
    new_height = int(image_height * image_scale)
    
    return image.resize((new_width, new_height), PIL.Image.Resampling.BICUBIC)