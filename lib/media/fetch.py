if __name__ == "__main__":
    import sys
    sys.path.append(".")
    
import lib.media.media_db as media_db
from lib.media.media_db import MediaParent, MediaInstance, MediaJointParentInstances

# get the metadata for a media piece and only the metadata
def get_media_parent(media_id: str) -> MediaParent | None:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(MediaParent)
        media_query = media_query.where(MediaParent.id == media_id)
        media_query = media_query.where(MediaParent.is_deleted == False)
        media_parent = media_query.first()
    
    return media_parent or None

def get_all_media_parents() -> list[MediaParent] | None:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(MediaParent)
        media_query = media_query.where(MediaParent.is_unlisted == False)
        media_query = media_query.where(MediaParent.is_deleted == False)
        media_parents = media_query.all()
    
    returnlist = []
    
    for media in media_parents:
        returnlist.append(media)
    
    return returnlist

# get a specific resolution
def get_specific_media_instance(instance_id: str) -> MediaInstance | None:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(MediaInstance)
        media_query = media_query.where(MediaInstance.instance_id == instance_id)
        media_instance = media_query.first()
    
    return media_instance or None


def get_media_full(media_id: str) -> MediaJointParentInstances | Exception:
    joint_object = MediaJointParentInstances()
    joint_object.parent = get_media_parent(media_id)
        
    if not joint_object.parent:
        return KeyError("invalid media_ID given")

    if joint_object.parent.is_deleted:
        return PermissionError("the content you're looking for has been marked as deleted")
    
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(MediaInstance)
        media_query = media_query.where(MediaInstance.parent_id == media_id)
        joint_object.instances = []
        for instance in media_query.all():
            joint_object.instances.append(instance)
    
    return joint_object

def get_media_instance_for_resolution(media_id: str, dimension: str, minimum_value: int) -> MediaInstance | None:
    if dimension not in ["x_dimension", "y_dimension"]:
        msg = "get_media_instance_for_resolution() was supplied an invalid dimension, please use a wrapper functions instead"
        print(msg)
        return {"message": msg}

    full_media_data = get_media_full(media_id)
    
    if not isinstance(full_media_data, MediaJointParentInstances):
        return
    
    media_instances: list[MediaInstance] = full_media_data.instances
    
    if not media_instances:
        return
    
    media_instances = sorted(media_instances, key=lambda instance: instance.get(dimension, 0))
    
    for media_instance in media_instances:
        if media_instance.get(dimension, 0) >= minimum_value:
            return media_instance
    
    # return the biggest image if none of the images are big enough
    return media_instances[-1]

if __name__ == "__main__":
    import json
    with open("temp.json", "w") as f:
        json.dump(get_media_full("17268277315119011-3Bxb8mmE3kQH"), f)