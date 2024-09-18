import requests
import json

import lib.util.env as env


def fetch_user_from_token(token_id: str):
    target = f"{env.SERVER_ADRESS}/user/me"
    headers = {
        "content-type": "application/json"
    }
    data = {
        "user_token": token_id
    }
    r = requests.post(target, headers=headers, json=data)
    j: dict = json.loads(r.text)
    return j
