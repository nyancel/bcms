import dotenv
import os

dotenv.load_dotenv()

IS_PROD: bool = os.getenv("IS_PROD") == "TRUE"
SECRET_KEY: str = os.getenv("SECRET_KEY")
SERVER_ADRESS: str = os.getenv("SERVER_ADRESS")

SERVER_ADMIN_EMAIL: str = os.getenv("SERVER_ADMIN_EMAIL")
SERVER_ADMIN_PASSWORD: str = os.getenv("SERVER_ADMIN_PASSWORD")

ARTICLE_DB_PATH: str = os.getenv("ARTICLE_DB_PATH")
MEDIA_DB_PATH: str = os.getenv("MEDIA_DB_PATH")
USER_DB_PATH: str = os.getenv("USER_DB_PATH")
EVENT_DB_PATH: str = os.getenv("EVENT_DB_PATH")

SMTP_SENDER_ADRESS: str = os.getenv("SMTP_SENDER_ADRESS")
SMTP_SERVER_URL: str = os.getenv("SMTP_SERVER_URL")
SMTP_SERVER_PORT: str = os.getenv("SMTP_SERVER_PORT")
SMTP_SERVER_USERNAME: str = os.getenv("SMTP_SERVER_USERNAME")
SMTP_SERVER_PASSWORD: str = os.getenv("SMTP_SERVER_PASSWORD")
