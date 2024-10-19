if __name__ == "__main__":
    import sys
    sys.path.append(".")

import lib.media.media_db
import lib.media.upload
import lib.util.crypt

import mimetypes
import io
import os

import threading

def init_default_media():
    images_path = "scripts/init_default_media/"
    
    images_name = os.listdir(images_path)

    images = []
    for image in images_name:
        images.append(images_path + image)
    
    threads = []
    for image in images:
        with open(image, "rb") as f:
            image_bytes = io.BytesIO(f.read())
        
        filename = image.rsplit("/", 1)[1]
        mimetype = mimetypes.guess_type(filename)[0]
        
        thread = threading.Thread(target=lib.media.upload.save_file, args=(
            image_bytes, filename, mimetype, []
        ))
        threads.append(thread)
        thread.start()

def run():
    DRIVER = lib.media.media_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)
    init_default_media()


if __name__ == "__main__":
    init_default_media()