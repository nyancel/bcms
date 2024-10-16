
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


export type MediaUploadRequest = {
    auth_token: string,
    files: Array<File>,
}

export type MediaUpdateRequest = {
    auth_token: string,
    media_ID: string,
    metadata: MediaMetadata,
}


async function make_post_request(endpoint: string, body: any) {
    let request = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body,
    });

    return {
        status_code: request.status,
        body: await request.json() as Response
    }
}

export async function upload_media(request_data: MediaUploadRequest) {
    let formdata = new FormData()

    formdata.append("auth_token", request_data.auth_token)
    for (let i = 0; i < request_data.files.length; i++) {
        formdata.append("media", request_data.files[i])
    }

    let request = await fetch("/media/upload_media", {
        method: "POST",
        body: formdata,
    })

    if (request.status === 200) {
        return await request.json() as Response
    } else {
        let jsondata = await request.json() as Response
        throw new Error(jsondata.message)
    }
}

export async function update_media_metadata(request_data: MediaUpdateRequest) {
    let response = await make_post_request(
        "/media/update_media_metadata",
        JSON.stringify( request_data )
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as MediaParent
}

export async function fetch_media() {}

export async function fetch_all_media_metadata() {}

export async function fetch_media_instance() {}