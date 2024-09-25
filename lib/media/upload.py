import json
import os
import PIL.Image
import time
import io
import hashlib

import werkzeug.datastructures as flask_datastructures

import lib.util.crypt
import lib.media.media_db as media_db

# resolutions of the smallest axies every uploaded image should be available in
desired_image_resolutions = [
    2160,
    1080,  # will resize 2560x1440 to 1920x1080, and 1204x1514 to 1080x1358
    720,
    540,
    360,
    180,
    96,
    64
]


def save_files(files: list[flask_datastructures.FileStorage]) -> list[str, Exception]:
    """
        takes in a file and saves it using a suite of different functions
    """

    task_ID = lib.util.crypt.new_uid()

    return_payload = {
        "task_ID": task_ID,
        "results": []
    }

    for file in files:
        file_ID = lib.util.crypt.new_uid()

        success = save_file(file, file_ID)

        filename = file.filename.replace(" ", "_")

        if isinstance(success, Exception):
            return_payload["results"].append({
                "success": 0,
                "original_filename": filename,
                "key": file_ID,
                "message": success.args,
            })

        else:
            return_payload["results"].append({
                "success": 1,
                "original_filename": filename,
                "key": file_ID
            })

    return return_payload


def save_file(file: flask_datastructures.FileStorage, file_ID: str, uploader=None) -> str | Exception:
    success = 0

    file_bytes = io.BytesIO(file.stream.read())
    file_hash = hashlib.md5(file_bytes.read()).hexdigest()

    db_entry = media_db.Media()
    db_entry.id = file_ID
    db_entry.uploader_user_id = lib.util.crypt.new_uid()
    db_entry.filename = file.filename.rsplit(".")[0]
    db_entry.file_extention = file.filename.split(".")[-1]
    db_entry.file_mimetype = file.mimetype
    db_entry.file_hash = file_hash
    db_entry.creation_time = time.time()

    if file.mimetype in ["image/jpeg", "image/png", "image/webp"]:
        available_resolutions = _save_image(file, file_ID, file_bytes)

        db_entry.content_type = "image"
        db_entry.available_resolutions = available_resolutions

        success = 1

    if success:
        with media_db.Driver.SessionMaker() as db_session:
            db_session.add(db_entry)
            db_session.commit()

        return file_ID

    return Exception("an unknown error occured")


def _save_image(uploaded_image: flask_datastructures.FileStorage, image_ID: str, image_bytes: io.BytesIO) -> list[int]:
    image_path = f"volume/media/files/{image_ID}"
    file_extention = uploaded_image.filename.split(".")[-1]

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
