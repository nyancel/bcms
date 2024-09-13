import json
import os
import PIL.Image
import time

import werkzeug.datastructures as flask_datastructures

# a list of all the resolutions uploaded images should be available in
# if a file is not 16x9 the image width or height will be bigger
# the original file's resolution is also saved if it's not in this list
image_resolutions = [
    (1920, 1080),
    (1280, 720),
    (960, 540),
    (640, 360),
]

def save_media(file: flask_datastructures.FileStorage) -> hash:
    """
        takes in a file and saves it using a suite of different functions
        
        returns a hash of the file, or 0 if it failed
    """
    
    print(file.mimetype)
    if file.mimetype in ["jpeg", "jpg", "png"]:
        metadata, hash = _save_image(file)

        success = _save_metadata(metadata, f"volume/media/metadata/{hash}")
        if not success:
            return success

        return hash

def _save_metadata(metadata, file_path):
    if os.path.exists(file_path):
        return FileExistsError("metadata with that filename already exists")
    
    with open(file_path, "w") as f:
        json.dump(metadata, f)
    
    return 1

def _save_image(uploaded_image: flask_datastructures.FileStorage) -> hash:
    """
        takes in an image and uploads it to an S3 buckets
        
        returns a hash of the file
    """
    
    image_hash = uploaded_image.__hash__()

    image_path = f"volume/media/files/{image_hash}"
    
    if os.path.exists(image_path):
        return FileExistsError("image with that filename already exists")
    
    if not uploaded_image.save(image_path):
        return 0
    
    # load the image using PIL and resize it to the specified resolutions
    pillow_image_data = PIL.Image.open(image_path)
    image_width, image_height = pillow_image_data.size
    image_resolutions = []
    
    for resolution in image_resolutions:
        if (image_width, image_height) != resolution:
            resized_image = resize_image(pillow_image_data, resolution)
            image_resolutions.append(resized_image.size)
            
            resized_image.save(f"{image_path}_{resized_image.size}", optimize=True, quality=95)
    
    metadata = {
        "filename": uploaded_image.name,
        "creation_date": time.time(),
        "is_deleted": False,
        "available_image_resolutions": image_resolutions
    }
    
    return metadata, image_hash

def _save_video():
    """
        TODO
    """
    
    return None

def resize_image(image: PIL.Image, desired_resolution: tuple[int, int]) -> PIL.Image:
    image_width, image_height = image.size
    
    width_scale = max(desired_resolution[0] / image_width, 1)
    height_scale = max(desired_resolution[1] / image_height, 1)
    
    scale = max(width_scale, height_scale)
    
    new_width = int(image_width * scale)
    new_height = int(image_height * scale)
    
    return image.resize((new_width, new_height), PIL.Image.ANTIALIAS)