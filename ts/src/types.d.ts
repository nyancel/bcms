// general types
type Media = {
    id: string,
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

// Gallery types

// util types
type UtilCacheItem = {
    key: string,
    item: string,
    expires_at: number
}