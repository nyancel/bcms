import requests
import json

import lib.util.env as env


class UserRights:
    def __init__(self, data: dict) -> "UserRights":
        self.can_post_draft: bool = data.get("can_post_draft") == True
        self.can_approve_draft: bool = data.get("can_approve_draft") == True
        self.can_publish_article: bool = data.get(
            "can_publish_article") == True
        self.can_delete_article: bool = data.get("can_delete_article") == True
        self.can_post_media: bool = data.get("can_post_media") == True
        self.can_unlist_media: bool = data.get("can_unlist_media") == True
        self.can_delete_media: bool = data.get("can_delete_media") == True
        self.can_read_drafts: bool = data.get("can_read_drafts") == True
        self.can_assign_journalist: bool = data.get(
            "can_assign_journalist") == True
        self.can_assign_editorial: bool = data.get(
            "can_assign_editorial") == True
        self.can_assign_admin: bool = data.get("can_assign_admin") == True
        self.can_delete_other_user: bool = data.get(
            "can_delete_other_user") == True
        self.can_change_other_email: bool = data.get(
            "can_change_other_email") == True
        self.can_change_other_password: bool = data.get(
            "can_change_other_password") == True
        self.can_change_other_details: bool = data.get(
            "can_change_other_details") == True
        self.can_edit_user_rights: bool = data.get(
            "can_edit_user_rights") == True
        self.can_submit_event: bool = data.get("can_submit_event") == True


def fetch_user_from_token(token_id: str) -> tuple[dict, int]:
    target = f"{env.SERVER_ADRESS}/user/who"
    headers = {
        "content-type": "application/json"
    }
    data = {
        "user_token": token_id
    }
    r = requests.post(target, headers=headers, json=data)
    j: dict = json.loads(r.text)
    return j, r.status_code


def fetch_rights_from_user(user_id: str) -> tuple[UserRights | dict, int]:
    target = f"{env.SERVER_ADRESS}/user/rights"
    headers = {
        "content-type": "application/json"
    }
    data = {
        "user_id": user_id
    }
    r = requests.post(target, headers=headers, json=data)
    if r.status_code != 200:
        return json.loads(r.text), r.status_code
    return UserRights(json.loads(r.text)), r.status_code


def get_admin_token() -> tuple[dict, int]:
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
