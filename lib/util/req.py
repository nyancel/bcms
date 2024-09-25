import requests
import json

import lib.util.env as env


def fetch_user_from_token(token_id: str):
    target = f"{env.SERVER_ADRESS}/user/who"
    headers = {
        "content-type": "application/json"
    }
    data = {
        "user_token": token_id
    }
    r = requests.post(target, headers=headers, json=data)
    j: dict = json.loads(r.text)
    return j


def fetch_rights_from_user(user_id: str):
    target = f"{env.SERVER_ADRESS}/user/rights"
    headers = {
        "content-type": "application/json"
    }
    data = {
        "user_id": user_id
    }
    r = requests.post(target, headers=headers, json=data)
    j: dict = json.loads(r.text)
    return j


def get_admin_token():
    target = f"{env.SERVER_ADRESS}/user/login"
    headers = {
        "content-type": "application/json"
    }
    data = {
        "email": env.SERVER_ADMIN_EMAIL,
        "password": env.SERVER_ADMIN_PASSWORD
    }
    r = requests.post(target, headers=headers, json=data)
    j: dict = json.loads(r.text)
    return j
