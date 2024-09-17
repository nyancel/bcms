import smtplib
import threading

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import lib.util.env


class SmtpMessage:
    to: str
    subject: str
    message: str


class SmtpClient:
    def __init__(self) -> None:
        self.sender = lib.util.env.SMTP_SENDER_ADRESS
        self.server = lib.util.env.SMTP_SERVER_URL
        self.port = lib.util.env.SMTP_SERVER_PORT
        self.username = lib.util.env.SMTP_SERVER_USERNAME
        self.password = lib.util.env.SMTP_SERVER_PASSWORD
        self.client: smtplib.SMTP

    def _connect(self):
        """ use "with"-pattern instead of this """
        if lib.util.env.IS_PROD:
            self.client = smtplib.SMTP(self.server, self.port)
            self.client.ehlo()
            self.client.starttls()
            self.client.login(self.username, self.password)

    def _disconnect(self):
        """ use "with"-pattern instead of this """
        if lib.util.env.IS_PROD and self.client:
            self.client.close()

    def _send(self, msg: SmtpMessage):
        mail = MIMEMultipart('alternative')
        mail['From'] = self.sender
        mail['To'] = msg.to
        mail['Subject'] = msg.subject
        mail.attach(MIMEText(msg.message, 'html'))

        header = f"To: {msg.to}\n"
        header += f"From: {self.sender}\n"
        header += f"Subject: {msg.subject}\n\n"
        body = header + msg.message

        if lib.util.env.IS_PROD:
            self.client.sendmail(mail['From'], mail['To'], mail.as_string())
        else:
            print(body)

    def __enter__(self):
        self._connect()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self._disconnect()


def _send_thread(msg: SmtpMessage):
    with SmtpClient() as c:
        c._send(msg)


def send_message(msg: SmtpMessage):
    t = threading.Thread(target=_send_thread, args=[msg])
    t.start()
    return
