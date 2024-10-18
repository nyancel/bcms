import { isStringLiteral } from "typescript";
import { get_local_user_data } from "../user/user_local";
import { update_media_metadata, MediaUpdateRequest, MediaMetadata, fetch_media_parent_and_instances, MediaFetchRequest, fetch_all_media_parents } from "./media_api";

let auth_token = get_local_user_data()?.token.id as string
if (typeof auth_token != "string") {
    auth_token = "missing"
} 
const media_ID = "muG523y5o1tR-17290772079567983"
async function get_largest_instance_id() {return (await test_fetch_media_full()).instances[0].instance_id}

export async function twig_test_function() {
    // await test_update_metadata()
    await test_fetch_media_full()
    console.log(await fetch_all_media_parents(auth_token))
    // console.log(await get_largest_instance_id())
}

async function test_fetch_media_full() {
    const media_request: MediaFetchRequest = {
        auth_token,
        media_ID
    }

    return await fetch_media_parent_and_instances(media_request)
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

    console.log(await update_media_metadata(media_request));
}