if __name__ == "__main__":
    import sys
    sys.path.append(".")

import lib.media.media_db
import lib.media.upload
import lib.util.crypt

import mimetypes
import io
import os

def init_default_media():
    images_path = "scripts/init_default_media/"
    
    images_name = os.listdir(images_path)

    images = []
    for image in images_name:
        images.append(images_path + image)
    
    for image in images:
        with open(image, "rb") as f:
            image_bytes = io.BytesIO(f.read())
        
        filename = image.rsplit("/", 1)[1]
        file_ID = lib.util.crypt.new_uid()
        mimetype = mimetypes.guess_type(filename)[0]
        
        success = lib.media.upload.save_file(image_bytes, filename, mimetype, file_ID)

    
def run():
    DRIVER = lib.media.media_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)
    init_default_media()


if __name__ == "__main__":
    init_default_media()