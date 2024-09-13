import os 

folders = [
    "volume",
    "volume/media",
    "volume/media/uploads",
]

for folder in folders:
    if not os.path.isdir(folder):
        os.mkdir(folder)
