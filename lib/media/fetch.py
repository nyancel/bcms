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

if __name__ == "__main__":
    import json
    with open("temp.json", "w") as f:
        json.dump(get_media_full("17268277315119011-3Bxb8mmE3kQH"), f)