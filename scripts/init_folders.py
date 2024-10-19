import os


def run():
    folders = [
        "volume",
        "volume/db",
        "volume/media",
    ]

    for folder in folders:
        if not os.path.isdir(folder):
            os.mkdir(folder)
