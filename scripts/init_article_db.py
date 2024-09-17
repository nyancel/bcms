import os
import sys

# move up one step for imports to work decently when ran from root
dirname = os.path.dirname(__file__)
parent_path = os.path.join(dirname, "../")
sys.path.append(parent_path)

import lib.article.article_db

DRIVER = lib.article.article_db.Driver
DRIVER.BASE.metadata.drop_all(DRIVER.engine)
DRIVER.BASE.metadata.create_all(DRIVER.engine)
