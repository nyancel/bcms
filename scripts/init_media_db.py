import lib.media.media_db

import os

def init_default_media():
    images_path = "scripts/init_default_media/"
    
    images_name = os.listdir(images_path)

    images = []
    for image in images_name:
        images.append(images_path + images_name)
    
def run():
    DRIVER = lib.media.media_db.Driver
    DRIVER.BASE.metadata.drop_all(DRIVER.engine)
    DRIVER.BASE.metadata.create_all(DRIVER.engine)
