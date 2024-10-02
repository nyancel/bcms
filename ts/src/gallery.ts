import { get_smallest_res_from_src, post_formdata, post_json } from "./util";

function get_html_elements() {
    let input_source = document.getElementById("image-upload-source") as HTMLInputElement | null;
    let image_preview_template = document.getElementById("gallery-image-preview-template") as HTMLTemplateElement | null;
    let image_display = document.getElementById("gallery-image-display") as HTMLElement | null;
    let upload_button = document.getElementById("upload-image-button") as HTMLButtonElement | null;

    if (
        !input_source ||
        !image_preview_template ||
        !image_display ||
        !upload_button
    ) {
        return null;
    }

    let elements: GalleryHtmlElements = {
        input_source,
        image_preview_template,
        image_display,
        upload_button
    };
    return elements;
}

async function load_all_media(html_elements: GalleryHtmlElements) {
    let response = await post_json("/media/fetch_all_media_metadata", {});
    console.log(response);
    if (response.error) {
        throw new Error(response.error);
    }
    if (response.success == 0) {
        return null;
        // should throw new Error(response.message);
    }

    let all_media = response as Media[];
    console.log(all_media);
    if (all_media.length <= 0) {
        throw new Error("no media found");
    }
    all_media = all_media.filter((media) => media && media.id);


    let media_promises = all_media.map(async (media) => {
        // generate the entries and assign relevant functions etc
        let target_url = await get_smallest_res_from_src(
            media.id,
            html_elements.image_display.clientWidth
        );
        return {
            media,
            target_url
        }
    });
    let media_with_targets = await Promise.all(media_promises);
    if (media_with_targets.length > 1) {
        media_with_targets.sort((a, b) => b.media.creation_time - a.media.creation_time);
    }
    return media_with_targets;
}

async function upload_files(input_element: HTMLInputElement) {
    let files = input_element.files;
    if (!files) {
        throw new Error("no files attached to input source")
    }

    let formdata = new FormData();
    for (let index = 0; index <= files.length; index++) {
        formdata.append("media", files[index]);
    }

    await post_formdata("/media/upload_media", formdata);
    main();
    input_element.value = "";
}

async function render_gallery(html_elements: GalleryHtmlElements) {
    let all_media = await load_all_media(html_elements);
    if (!all_media) {
        html_elements.image_display.innerHTML = "";
        return;
    }

    // create all the entries that should go in to the dom
    let entry_promises = all_media.map((media) => {
        let entry = document.createElement("li");
        let clone = html_elements.image_preview_template.cloneNode(true) as HTMLTemplateElement;
        let clone_content = clone.content;
        entry.append(clone_content);
        let img_element = entry.querySelector("img") as HTMLImageElement | null;
        if (!img_element) {
            throw new Error("could not find img element")
        }
        img_element.src = media.target_url;
        return { entry, media };
    })
    let entries = await Promise.all(entry_promises);

    // hook up each remove-element button
    entries.forEach((e) => {
        let remove_media_button = e.entry.querySelector(".remove-image-button") as HTMLButtonElement | null;
        if (!remove_media_button) {
            throw new Error("could not find remove media button")
        }
        remove_media_button.onclick = async () => {
            await post_json("/media/update_media_metadata", {
                media_ID: e.media.media.id,
                is_unlisted: true,
            });
            main();
        };
    })

    html_elements.image_display.innerHTML = "";
    entries.forEach((entry) => html_elements.image_display.appendChild(entry.entry));
}

// startup
export default function main() {
    let html_elements = get_html_elements();
    if (!html_elements) {
        throw new Error("html_elements not loaded");
    }

    html_elements.upload_button.onclick = () => upload_files(html_elements.input_source);

    render_gallery(html_elements);
}
