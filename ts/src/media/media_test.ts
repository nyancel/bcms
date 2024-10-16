import { update_media_metadata, UpdateMediaMetadataRequest, MediaMetadata } from "./media_api";

export async function twig_test_function() {
    let metadata: MediaMetadata = {
        alt_text: "cool comic",
        is_unlisted: false,
    }
    
    let media_request: UpdateMediaMetadataRequest = {
        auth_token: "hi",
        media_ID: "muG523y5o1tR-17290772079567983",
        metadata: metadata
    }

    console.log("hi")
    console.log(await update_media_metadata(media_request));
}
