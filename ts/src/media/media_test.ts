import { update_media_metadata, UpdateMediaMetadataRequest, MediaMetadata } from "./media_api";

export async function twig_test_function() {
    let metadata: MediaMetadata = {
        alt_text: "cool comic",
        is_unlisted: false,
    }
    
    let media_request: UpdateMediaMetadataRequest = {
        auth_token: "hi",
        media_ID: "FRVl6RhTeT5i-17290289321233373",
        metadata: metadata
    }

    console.log("hi")
    console.log(await update_media_metadata(media_request));
}
