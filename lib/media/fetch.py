if __name__ == "__main__":
    import sys
    sys.path.append(".")
    
import lib.media.media_db as media_db

# get the metadata for a media piece and only the metadata
def get_media_metadata(media_id: str) -> media_db.Media | None:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.Media)
        media_query = media_query.where(media_db.Media.id == media_id)
        media_query = media_query.where(media_db.Media.is_deleted == False)
        media_metadata = media_query.first()
    
    if media_metadata:
        return media_metadata.to_dict()

# get a specific resolution
def get_specific_media_instance(instance_id: str) -> media_db.MediaInstance:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.MediaInstance)
        media_query = media_query.where(media_db.MediaInstance.instance_id == instance_id)
        media_instance = media_query.first()
    return media_instance

def get_media_full(media_id: str) -> Exception | dict[str: media_db.Media, str: list[media_db.MediaInstance]]:
    media_content = {}
    media_content["metadata"] = get_media_metadata(media_id)
    
    if not media_content["metadata"]:
        return KeyError("invalid media_ID given")

    if media_content["metadata"].get("is_deleted", True):
        return PermissionError("the content you're looking for has been marked as deleted")
    
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.MediaInstance)
        media_query = media_query.where(media_db.MediaInstance.parent_id == media_id)
        media_content["instances"] = []
        for instance in media_query.all():
            instance_data = instance.to_dict()
            # i swear this is temporary
            instance_data["url"] = f"http://localhost:8080/volume/media/files/{media_id}/{instance_data['instance_id']}.{media_content['metadata']['file_extention']}"
            media_content["instances"].append(instance_data)
    
    return media_content

if __name__ == "__main__":
    import json
    with open("temp.json", "w") as f:
        json.dump(get_media_full("17268277315119011-3Bxb8mmE3kQH"), f)