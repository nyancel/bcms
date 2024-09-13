import os 

folders = [
    "volume",
    "volume/media",
    "volume/media/metadata",
    "volume/media/files",
]

for folder in folders:
    if not os.path.isdir(folder):
        os.mkdir(folder)
