
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

export type MediaFetchRequest = {
    auth_token: string,
    media_ID: string,
}

export type MediaMinimumResolutionRequest = {
    auth_token: string,
    media_ID: string,
    desired_size: number,
}


async function make_post_request(endpoint: string, body: any) {
    let request = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( body ),
    });

    return {
        status_code: request.status,
        body: await request.json() as Response
    }
}

export async function upload_media(request_data: MediaUploadRequest) {
    let formdata = new FormData()

    formdata.append("auth_token", request_data.auth_token)
    request_data.files.forEach((file) => {
        formdata.append("media", file)
    })

    let request = await fetch("/media/upload_media", {
        method: "POST",
        body: formdata,
    })

    if (request.status != 200) {
        let request_json = await request.json() as Response
        throw new Error(request_json.message)
    }

    return await request.json() as Response
}

export async function update_media_metadata(request_data: MediaUpdateRequest) {
    let response = await make_post_request(
        "/media/update_media_metadata",
        request_data
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as MediaParent
}

export async function fetch_media_parent_and_instances(request_data: MediaFetchRequest) {
    let response = await make_post_request(
        "/media/fetch_media_parent_and_instances",
        request_data
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as MediaJointParentInstances
}

export async function fetch_all_media_parents(auth_token: string) {
    let response = await make_post_request(
        "/media/fetch_all_media_parents",
        { auth_token: auth_token }
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as Array<MediaParent>
}

export async function fetch_all_media_parents_and_instances(auth_token: string) {
    let response = await make_post_request(
        "/media/fetch_all_media_parents_and_instances",
        { auth_token }
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as Array<MediaJointParentInstances>
}

export async function fetch_media_instance_for_resolution_height(request_data: MediaMinimumResolutionRequest) {
    let response = await make_post_request(
        "/media/fetch_media_instance_for_resolution_height",
        request_data
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as MediaInstance
}


export async function fetch_media_instance_for_resolution_width(request_data: MediaMinimumResolutionRequest) {
    let response = await make_post_request(
        "/media/fetch_media_instance_for_resolution_width",
        request_data
    )

    if (response.status_code != 200) {
        throw new Error(response.body.message)
    }

    return response.body.data as MediaInstance
}

export async function fetch_media_instance_file(instance_ID: string) {
    let request = await fetch("/media/fetch_media_instance", {
        method: "GET",
        body: JSON.stringify({ instance_ID }),
    });

    if (request.status != 200) {
        let request_json: Response = await request.json()
        throw new Error(request_json.message)
    }

    return await request.blob() as File
}

export function fetch_media_instance_url(media_instance_id: string) {
    return `/media/fetch_media_instance?instance_ID=${media_instance_id}` as string
}
