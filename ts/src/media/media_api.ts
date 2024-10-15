
type Response = {
    data: any,
    message: string,
    time: number,
}

export type MediaParent = {
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

export type MediaInstance = {
    instance_id: string,
    parent_id: string,
    x_dimension: number,
    y_dimension: number,
}

export type MediaJointParentInstances = {
    parent: MediaParent,
    instances: Array<MediaInstance>,
}

export type MediaMetadata = {
    alt_text?: string,
    filename?: string,
    is_unlisted?: boolean,
    is_deleted?: boolean,
}

export type UpdateMediaMetadataRequest = {
    auth_token: string,
    media_ID: string,
    metadata: MediaMetadata,
}


async function make_request(endpoint: string, request_data: any) {
    let request = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( request_data )
    });

    return {
        status_code: request.status,
        body: await request.json() as Response
    }
}

export async function update_media_metadata(request_data: UpdateMediaMetadataRequest) {
    let response = await make_request(
        "/media/update_media_metadata",
        request_data
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as Media
}
