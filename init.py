import scripts.init_article_db
import scripts.init_media_db
import scripts.init_user_db
import scripts.init_folders

if __name__ == "__main__":
    scripts.init_folders.run()
    scripts.init_article_db.run()
    scripts.init_media_db.run()
    scripts.init_user_db.run()
