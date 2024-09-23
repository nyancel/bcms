import time

if __name__ == "__main__":
    import sys
    sys.path.append(".")
    
import lib.media.media_db as media_db


def mark_media_as_deleted(media_ID: str, mark_as_deleted: bool) -> bool:
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
        
        desired_media = media_query.first()
        
        if not desired_media:
            return ValueError("could not find any content matching that media_ID")
            
        if desired_media.is_deleted == mark_as_deleted:
            return False

        if mark_as_deleted == True:
            desired_media.is_deleted = True
            desired_media.deletion_time = time.time()
        
        else:
            desired_media.is_deleted = False
            desired_media.deletion_time = 0        
        
        db_session.commit()
        return True
    

def mark_media_as_unlisted(media_ID: str, mark_as_unlisted: bool) -> bool:
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
        
        desired_media = media_query.first()
        
        if not desired_media:
            return ValueError("could not find any content matching that media_ID")
            
        if desired_media.is_unlisted == mark_as_unlisted:
            return False

        if mark_as_unlisted == True:
            desired_media.is_unlisted = True
            desired_media.unlisted_time = time.time()
        
        else:
            desired_media.is_unlisted = False
            desired_media.unlisted_time = 0        
        
        db_session.commit()
        return True