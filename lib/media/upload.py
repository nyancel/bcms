import json
import os
import PIL.Image
import time
import io
import hashlib

import werkzeug.datastructures as flask_datastructures

# resolutions of the smallest axies every uploaded image should be available in 
desired_image_resolutions = [
    1080, #will resize 2560x1440 to 1920x1080, and 1204x1514 to 1080x1358
    720,
    540,
    360,
]

    
def save_media(file: flask_datastructures.FileStorage) -> int | Exception:
    """
        takes in a file and saves it using a suite of different functions
    """
    
    file_bytes = io.BytesIO(file.stream.read())
    hash = hashlib.md5(file_bytes.read()).hexdigest()
    
    if os.path.isdir(f"volume/media/files/{hash}"):
        return FileExistsError({
            "error": "a file with that hash is already saved",
            "hash": hash
        })
    
    if file.mimetype in ["image/jpeg", "image/png"]:
        metadata = _save_image(file, file_bytes, hash)
        _save_metadata(metadata, f"volume/media/metadata/{hash}.json")

        return 1

def _save_metadata(metadata, file_path):
    with open(file_path, "w") as f:
        json.dump(metadata, f)
    
    return 1

def _save_image(uploaded_image: flask_datastructures.FileStorage, image_bytes: io.BytesIO, image_hash) -> dict:
    image_path = f"volume/media/files/{image_hash}"
    filename = uploaded_image.filename.rsplit(".")[0]
    file_extention = uploaded_image.filename.split(".")[-1]
    
    available_image_resolutions = []
    
    def __save_image_to_S3(image: PIL.Image):
        available_image_resolutions.append(image.size)
        
        image_size = f"{image.size[0]}_{image.size[1]}"
        image.save(f"{image_path}/{image_size}.{file_extention}", optimize=True, quality=95)
    
    os.mkdir(image_path)
    pillow_image_data = PIL.Image.open(image_bytes)
    
    image_width, image_height = pillow_image_data.size
    __save_image_to_S3(pillow_image_data)
    
    for resolution in desired_image_resolutions:
        if resolution != min(image_width, image_height): # make sure we don't save two images of the same resolution
            resized_image = _resize_pillow_image(pillow_image_data, resolution)
            __save_image_to_S3(resized_image)
    
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

def _resize_pillow_image(image: PIL.Image, desired_resolution: int) -> PIL.Image:
    image_width, image_height = image.size
    
    smallest_axis_size = min(image_width, image_height)
    
    image_scale = desired_resolution / smallest_axis_size
    
    new_width = int(image_width * image_scale)
    new_height = int(image_height * image_scale)
    
    return image.resize((new_width, new_height), PIL.Image.Resampling.BICUBIC)