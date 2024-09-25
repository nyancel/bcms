import time

if __name__ == "__main__":
    import sys
    sys.path.append(".")
    
import lib.media.media_db as media_db


def mark_media_as_deleted(media_ID: str, mark_as_deleted: bool) -> bool | Exception:
    """
        returns True if the media deletion state was changed, returns False if nothing changed
    """
    if mark_as_deleted not in [True, False]:
        return ValueError("mark_as_deleted is not a valid boolean")

    if not media_ID:
        return ValueError("no valid media_ID supplied")
    
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.Media)
        media_query = media_query.where(media_db.Media.id == media_ID)
        
        media = media_query.first()
        
        if not media:
            return ValueError("could not find any content matching that media_ID")
            
        if media.is_deleted == mark_as_deleted:
            return False

        if mark_as_deleted == True:
            media.is_deleted = True
            media.deletion_time = time.time()
        
        else:
            media.is_deleted = False
            media.deletion_time = 0        
        
        db_session.commit()
        return True
    

def mark_media_as_unlisted(media_ID: str, mark_as_unlisted: bool) -> bool | Exception:
    """
        returns True if the media deletion state was changed, returns False if nothing changed
    """
    if mark_as_unlisted not in [True, False]:
        return ValueError("mark_as_unlisted is not a valid boolean")

    if not media_ID:
        return ValueError("no valid media_ID supplied")
    
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.Media)
        media_query = media_query.where(media_db.Media.id == media_ID)
        
        media = media_query.first()
        
        if not media:
            return ValueError("could not find any content matching that media_ID")
            
        if media.is_unlisted == mark_as_unlisted:
            return False

        if mark_as_unlisted == True:
            media.is_unlisted = True
            media.unlisted_time = time.time()
        
        else:
            media.is_unlisted = False
            media.unlisted_time = 0        
        
        db_session.commit()
        return True

def update_media_metadata(media_ID: str, metadata: dict[str: str]) -> dict[str: str] | Exception:
    if not media_ID:
        return ValueError("no media_ID was supplied")
    
    if not isinstance(metadata, dict) or metadata == {}:
        return ValueError("invalid metadata was supplied")
    
    with media_db.Driver.SessionMaker() as db_session:
        media_query = db_session.query(media_db.Media)
        media_query = media_query.where(media_db.Media.id == media_ID)
        
        media = media_query.first()
        
        if not media:
            return ValueError("could not find any content matching that media_ID")
        
        # ensure that we don't overwrite restricted values
        valid_metadata_keys = [
            "alt_text"
        ]
        
        for key, value in metadata.items(): 
            if key in valid_metadata_keys:
                setattr(media, key, value)
        
        db_session.commit()
        
        
        return_payload = {}
        
        for metadata_key in valid_metadata_keys:
            return_payload[metadata_key] = getattr(media, metadata_key)
        
        return return_payload