The .env file is placed as: `./.env`

--- begin .env ---

IS_PROD = FALSE

SERVER_ADRESS = http://127.0.0.1:3000
USER_DB_PATH = ./volume/db/user.db
ARTICLE_DB_PATH = ./volume/db/article.db
EVENT_DB_PATH = ./volume/db/event.db
MEDIA_DB_PATH = ./volume/db/media.db
SECRET_KEY = secretkey123

SERVER_ADMIN_EMAIL = server.admin@test.no
SERVER_ADMIN_PASSWORD = 123

TEST_JOURNALIST_EMAIL = journalist@test.no
TEST_JOURNALIST_PASSWORD = 123

TEST_EDITOR_EMAIL = editor@test.no
TEST_EDITOR_PASSWORD = 123

SMTP_SENDER_ADRESS = 123
SMTP_SERVER_URL = 123
SMTP_SERVER_PORT = 123
SMTP_SERVER_USERNAME = 123
SMTP_SERVER_PASSWORD = 123

--- end .env ---
