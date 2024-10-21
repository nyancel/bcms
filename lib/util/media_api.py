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

def get_media_parent_and_instances(media_parent_id: str) -> MediaJointParentInstances | None:
    response = lib.media.fetch.get_media_full(media_parent_id)
    if isinstance(response, MediaJointParentInstances):
        return response
    else:
        return None
    
def get_media_instance(media_instance_id: str) -> MediaInstance | None:
    return lib.media.fetch.get_specific_media_instance(media_instance_id)

def get_media_instance_url(media_instance_id: str) -> str:
    return f"{lib.util.env.SERVER_ADRESS}/media/fetch_media_instance?instance_ID={media_instance_id}"

def get_media_instance_for_resolution_height(media_parent_id: str, desired_height: int) -> MediaInstance | None:
    full_media_data = get_media_parent_and_instances(media_parent_id)
    
    if not isinstance(full_media_data, MediaJointParentInstances):
        return
    
    media_instances: list[MediaInstance] = sorted(full_media_data.instances, key=lambda instance: instance.y_dimension)
    
    for media_instance in media_instances:
        if media_instance.y_dimension >= desired_height:
            return media_instance
    
    # return the biggest image if none of the images are big enough
    return media_instances[-1]
    
def get_media_instance_for_resolution_width(media_parent_id: str, desired_width: int) -> MediaInstance | None:
    full_media_data = get_media_parent_and_instances(media_parent_id)
    
    if not isinstance(full_media_data, MediaJointParentInstances):
        return
    
    media_instances: list[MediaInstance] = sorted(full_media_data.instances, key=lambda instance: instance.x_dimension)
    
    for media_instance in media_instances:
        if media_instance.x_dimension >= desired_width:
            return media_instance
    
    # return the biggest image if none of the images are big enough
    return media_instances[-1]

    
if __name__ == "__main__":
    # print(get_media_parent_and_instances("oqnKpHcz1jm9-1729023946370702").parent.alt_text)
    # print(get_media_instance_for_resolution_height("0KTVEdnvxvDx-17290239464845142", 1080))
    # print(get_media_instance_url("2hfDwkxhSNju-17290239469021327"))
    print(get_all_media_parents())