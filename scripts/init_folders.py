import os


def run():
    folders = [
        "volume",
        "volume/db",
        "volume/media",
        "volume/media/metadata",
        "volume/media/files",
    ]

    for folder in folders:
        if not os.path.isdir(folder):
            os.mkdir(folder)
