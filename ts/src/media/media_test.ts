import { update_media_metadata, UpdateMediaMetadataRequest, MediaMetadata } from "./media_api";

export async function twig_test_function() {
    let metadata: MediaMetadata = {
        alt_text: "hi:3",
    }
    
    let media_request: UpdateMediaMetadataRequest = {
        auth_token: "hi",
        media_ID: "test",
        metadata: metadata
    }

    console.log("hi")
    console.log(await update_media_metadata(media_request));
}
