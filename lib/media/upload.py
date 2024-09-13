import werkzeug.datastructures as flask_datastructures

def save_image(image: flask_datastructures.FileStorage) -> hash:
    """
        takes in an image and uploads it to an S3 buckets
        
        returns a hash of the file
    """
    
    image_hash = image.__hash__()
    
    if not image.save(f"volume/media/uploads/{image_hash}"):
        return 0
    
    return image_hash

def save_video():
    """
        TODO
    """
    
    return None