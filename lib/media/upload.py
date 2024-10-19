import json
import os
import PIL.Image
import time
import io
import hashlib

import werkzeug.datastructures as flask_datastructures

import lib.util.crypt
import lib.media.media_db as media_db
from lib.media.media_db import MediaParent, MediaInstance, MediaJointParentInstances

import threading

# resolutions of the smallest axies every uploaded image should be available in
desired_image_resolutions = [
    # 4320,
    # 2880,
    # 2160,
    1440,
    1080,  # will resize 2560x1440 to 1920x1080, and 1204x1514 to 1080x1358
    720,
    650,
    540,
    360,
    240,
    180,
    144,
    96,
    64,
    32
]


def save_flask_files(files: list[flask_datastructures.FileStorage]) -> list[str, Exception]:
    threads = []
    results = []

    for file in files:
        file_bytes = io.BytesIO(file.stream.read())
        
        thread = threading.Thread(target=save_file, args=(
            file_bytes, file.filename, file.mimetype, results
        ))
        
        threads.append(thread)
        thread.start()
    
    while True:
        if len(threads) == len(results):
            time.sleep(0.05)
        else:
            return results


def save_file(file: io.BytesIO, raw_filename: str, mimetype: str, results, uploader=None) -> str | Exception:
    success = 0

    file_hash: str = hashlib.md5(file.read()).hexdigest()
    file_ID = lib.util.crypt.new_uid()
    
    file_extention: str = raw_filename.split(".")[-1]

    db_entry = media_db.MediaParent()
    db_entry.id = file_ID
    db_entry.uploader_user_id = lib.util.crypt.new_uid()
    db_entry.filename = raw_filename.rsplit(".")[0]
    db_entry.file_extention = file_extention
    db_entry.file_mimetype = mimetype
    db_entry.file_hash = file_hash
    db_entry.creation_time = time.time()

    if mimetype in ["image/jpeg", "image/png", "image/webp"]:
        available_resolutions = _save_image(file_ID, file, file_extention)

        db_entry.content_type = "image"
        db_entry.available_resolutions = available_resolutions

        success = 1

    if success:
        with media_db.Driver.SessionMaker() as db_session:
            db_session.add(db_entry)
            db_session.commit()

        results.append({
            "original_filename": raw_filename,
            "success": 1,
            "file_ID": file_ID
        })
        return

    results.append({
        "original_filename": raw_filename,
        "success": 0,
        "file_ID": ""
    })


def _save_image(image_ID: str, image_bytes: io.BytesIO, file_extention: str) -> list[int]:
    image_path = f"volume/media/{image_ID}"

    available_image_resolutions = []

    def __save_image_to_S3(image: PIL.Image, db_parent_ID):
        instance_id = lib.util.crypt.new_uid()
        media_instance = media_db.MediaInstance()
        media_instance.instance_id = instance_id
        media_instance.parent_id = db_parent_ID
        media_instance.x_dimension = image.size[0]
        media_instance.y_dimension = image.size[1]

        image.save(f"{image_path}/{instance_id}.{file_extention}", optimize=True, quality=95)

        with media_db.Driver.SessionMaker() as db_session:
            db_session.add(media_instance)
            db_session.commit()

    os.mkdir(image_path)
    pillow_image_data = PIL.Image.open(image_bytes)

    image_width, image_height = pillow_image_data.size
    __save_image_to_S3(pillow_image_data, image_ID)

    for resolution in desired_image_resolutions:
        # make sure we don't save two images of the same resolution
        if resolution != min(image_width, image_height):
            if image_height > resolution and image_height > resolution:
                resized_image = _resize_pillow_image(
                    pillow_image_data, resolution)
                __save_image_to_S3(resized_image, image_ID)

    return available_image_resolutions


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
