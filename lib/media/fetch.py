if __name__ == "__main__":
    import sys
    sys.path.append(".")
    
import lib.media.media_db as media_db


# get the metadata for a media piece and only the metadata
def get_media_metadata(media_id: str) -> dict | None:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.Media)
        media_query = media_query.where(media_db.Media.id == media_id)
        media_query = media_query.where(media_db.Media.is_deleted == False)
        media_metadata = media_query.first()
    
    if media_metadata:
        return media_metadata.to_dict()

def get_all_media_metadata() -> list[dict] | None:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.Media)
        media_query = media_query.where(media_db.Media.is_unlisted == False)
        media_query = media_query.where(media_db.Media.is_deleted == False)
        media_metadata = media_query.all()
    
    returnlist = []
    
    for media in media_metadata:
        returnlist.append(media.to_dict())
    
    return returnlist

# get a specific resolution
def get_specific_media_instance(instance_id: str) -> dict | None:
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.MediaInstance)
        media_query = media_query.where(media_db.MediaInstance.instance_id == instance_id)
        media_instance = media_query.first()
    
    if media_instance:
        return media_instance.to_dict()


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
            instance_dict = instance.to_dict()
            if instance_dict:
                media_content["instances"].append(instance_dict)
    
    return media_content


if __name__ == "__main__":
    import json
    with open("temp.json", "w") as f:
        json.dump(get_media_full("17268277315119011-3Bxb8mmE3kQH"), f)