if __name__ == "__main__":
    import sys
    sys.path.append(".")

import lib.media.fetch
import lib.util.env

from lib.media.media_db import MediaParent, MediaInstance, MediaJointParentInstances


def get_all_media_parents() -> list[MediaParent]:
    media_list = lib.media.fetch.get_all_media_parents()
    return media_list or []

def get_all_media_parents_and_intances() -> list[MediaJointParentInstances]:
    parent_list = lib.media.fetch.get_all_media_parents()
    
    full_media_list = []
    for parent in parent_list:
        full_media_list.append(get_media_parent_and_instances(parent.get("id")))
    
    return full_media_list or []

def get_media_parent_and_instances(media_id: str) -> MediaJointParentInstances | None:
    response = lib.media.fetch.get_media_full(media_id)
    if isinstance(response, dict):
        return response
    else:
        return None
    
def get_media_instance(media_instance_id: str) -> MediaInstance | None:
    return lib.media.fetch.get_specific_media_instance(media_instance_id)

def get_media_instance_url(media_instance_id: str) -> str:
    return f"{lib.util.env.SERVER_ADRESS}/media/fetch_media_instance?instance_ID={media_instance_id}"

def get_media_instance_for_resolution_height(media_id: str, min_height: int) -> MediaInstance | None:
    return lib.media.fetch.get_media_instance_for_resolution(media_id, "y_dimension", min_height)
    
def get_media_instance_for_resolution_width(media_id: str, min_width: int) -> MediaInstance | None:
    return lib.media.fetch.get_media_instance_for_resolution(media_id, "x_dimension", min_width)

    
if __name__ == "__main__":
    # print(get_media_parent_and_instances("oqnKpHcz1jm9-1729023946370702").parent.alt_text)
    # print(get_media_instance_for_resolution_height("0KTVEdnvxvDx-17290239464845142", 1080))
    # print(get_media_instance_url("2hfDwkxhSNju-17290239469021327"))
    print(get_all_media_parents())