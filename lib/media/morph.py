import time

if __name__ == "__main__":
    import sys
    sys.path.append(".")
    
import lib.media.media_db as media_db
from lib.media.media_db import MediaParent, MediaInstance, MediaJointParentInstances

def update_media_metadata(media_ID: str, metadata: dict[str: str]) -> MediaParent | Exception:
    if not media_ID:
        return ValueError("no media_ID was supplied")
    
    if not isinstance(metadata, dict) or metadata == {}:
        return ValueError("invalid metadata was supplied")
    
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(MediaParent)
        media_query = media_query.where(MediaParent.id == media_ID)
        
        media = media_query.first()
        
        if not media:
            return ValueError("could not find any content matching that media_ID")
        
        if metadata.get("alt_text"):
            media.alt_text = metadata["alt_text"]
        
        if metadata.get("filename"):
            media.filename = metadata["filename"].replace(" ", "_")
        
        if metadata.get("is_unlisted"):
            media.is_unlisted = metadata["is_unlisted"]
            media.unlisted_state_update_time = time.time()
        
        if metadata.get("is_deleted"):
            media.is_deleted = metadata["is_deleted"]
            media.deleted_state_update_time = time.time()
        
        db_session.commit()
        
        return media