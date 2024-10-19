import { isStringLiteral } from "typescript";
import { get_local_user_data } from "../user/user_local";
import { update_media_metadata, MediaUpdateRequest, MediaMetadata, fetch_media_parent_and_instances, MediaFetchRequest, fetch_all_media_parents, MediaParent, fetch_media_instance, fetch_all_media_parents_and_instances, fetch_media_instance_for_resolution_width, MediaMinimumResolutionRequest, fetch_media_instance_file, fetch_media_instance_url, fetch_media_instance_for_resolution_height } from "./media_api";

let auth_token = get_local_user_data()?.token.id as string
if (typeof auth_token != "string") {
    auth_token = "missing"
} 
let media_ID = "missing"

export async function twig_test_function() {
    // await test_update_metadata()
    let media_parents: Array<MediaParent> = await test_get_all_media_parents()
    
    if (media_parents.length > 0) {
        media_ID = media_parents[0].id
    }

    await test_fetch_media_full()
    console.log("-".repeat(15), " all media parents: ", "-".repeat(15))
    console.log(await fetch_all_media_parents(auth_token))
    console.log("-".repeat(15), " all media parents and instances: ", "-".repeat(15))
    console.log(await test_get_all_media_parents_and_instances())

    let media_collection = await test_get_all_media_parents_and_instances()
    if (!(media_collection.length > 0)) {
        return
    }
    
    let media_instance_request_width: MediaMinimumResolutionRequest = {
        auth_token,
        media_ID: media_collection[6].parent.id,
        desired_size: 700,
    }
    
    let media_instance_request_height: MediaMinimumResolutionRequest = {
        auth_token,
        media_ID: media_collection[2].parent.id,
        desired_size: 700,
    }

    let test_image_instance_width = await fetch_media_instance_for_resolution_width(media_instance_request_width)
    let test_image_instance_height = await fetch_media_instance_for_resolution_height(media_instance_request_height)

    let img1 = document.createElement('img');
    img1.src = await fetch_media_instance_url(test_image_instance_width.instance_id);
    let img2 = document.createElement('img');
    img2.src = await fetch_media_instance_url(test_image_instance_height.instance_id);


    document.body.appendChild(img1);
    document.body.appendChild(img2);
}

async function test_fetch_media_full() {
    const media_request: MediaFetchRequest = {
        auth_token,
        media_ID
    }

    return await fetch_media_parent_and_instances(media_request)
}

async function test_get_all_media_parents_and_instances() {
    return await fetch_all_media_parents_and_instances(auth_token)
}

async function test_update_metadata() {
    let metadata: MediaMetadata = {
        alt_text: "cool comic",
        is_unlisted: false,
    }
    
    let media_request: MediaUpdateRequest = {
        auth_token,
        media_ID,
        metadata 
    }

    return await update_media_metadata(media_request) as MediaParent;
}

async function test_get_all_media_parents() {
    return await fetch_all_media_parents(auth_token)
}