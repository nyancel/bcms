import scripts.init_article_db
import scripts.init_media_db
import scripts.init_user_db
import scripts.init_folders
import scripts.init_event_db

import lib.util.env

if __name__ == "__main__":
    if not lib.util.env.USER_DB_PATH:
        print("could not find `USER_DB_PATH` in your environment, perhaps you forgot your .env file?")
        exit()
    
    scripts.init_folders.run()
    scripts.init_user_db.run()  # USER is the first DB, to init test users that others depend on.
    scripts.init_media_db.run()
    scripts.init_article_db.run()
    scripts.init_event_db.run()
