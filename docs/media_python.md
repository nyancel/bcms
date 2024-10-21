```py
class MediaParent:
    id: str
    uploader_user_id: str
    filename: str
    file_extention: str
    file_mimetype: str
    file_hash: str
    alt_text: str
    content_type: str
    creation_time: float
    is_unlisted: bool
    unlisted_state_update_time: float
    is_deleted: bool
    deleted_state_update_time: float

class MediaInstance:
    instance_id: str
    parent_id: str
    x_dimension: int
    y_dimension: int

class MediaJointParentInstances:
    parent: MediaParent
    instances: list[MediaInstance]

def get_all_media_parents() -> list[MediaParent]:
def get_all_media_parents_and_intances() -> list[MediaJointParentInstances]:
def get_media_parent_and_instances(media_parent_id) -> MediaJointParentInstances | None:
def get_media_instance(media_instance_id) -> MediaInstance | None:
def get_media_instance_url(media_instance_id) -> str:
def get_media_instance_for_resolution_height(media_parent_id, desired_height: int) -> MediaInstance | None:
def get_media_instance_for_resolution_width(media_parent_id, desired_width: int) -> MediaInstance | None:
```