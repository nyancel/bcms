
```ts
type Response = {
    data: any,
    message: string,
    time: number,
}

type MediaParent = {
    id: string
    uploader_user_id: string,
    filename: string,
    file_extention: string,
    file_mimetype: string,
    file_hash: string,
    alt_text: string,
    content_type: string,
    creation_time: number,
    is_unlisted: boolean,
    unlisted_state_update_time: number,
    is_deleted: boolean,
    deleted_state_update_time: number,
}

type MediaInstance = {
    instance_id: string,
    parent_id: string,
    x_dimension: number,
    y_dimension: number,
}

type MediaJointParentInstances = {
    parent: MediaParent,
    instances: Array<MediaInstance>,
}
```
--------------------------------------------------
```ts
type MediaUploadRequest = {
    auth_token: string,
    files: Array<File>,
}

upload_media(MediaUploadRequest): Response
```
--------------------------------------------------
```ts
type MediaMetadata = {
    alt_text?: string,
    filename?: string,
    is_unlisted?: boolean,
    is_deleted?: boolean,
}

type MediaUpdateRequest = {
    auth_token: string,
    media_ID: string,
    metadata: MediaMetadata,
}

update_media_metadata(MediaUpdateRequest): MediaParent
```
--------------------------------------------------
```ts
type MediaFetchRequest = {
    auth_token: string,
    media_ID: string,
}

fetch_media_parent_and_instances(MediaFetchRequest): MediaJointParentInstances
```
--------------------------------------------------
```ts
fetch_all_media_parents(auth_token): Array<MediaParent>
```
--------------------------------------------------
```ts
fetch_all_media_parents_and_instances(auth_token): Array<MediaJointParentInstances>
```
--------------------------------------------------
```ts
export type MediaMinimumResolutionRequest = {
    auth_token: string,
    media_ID: string,
    desired_size: number,
}

fetch_media_instance_for_resolution_height(MediaMinimumResolutionRequest): MediaInstance

fetch_media_instance_for_resolution_width(MediaMinimumResolutionRequest): MediaInstance
```
--------------------------------------------------
```ts
fetch_media_instance_file(instance_ID): File
fetch_media_instance_url(instance_ID): string
```
