import { post_json, get_smallest_res_from_src } from "./util";



function get_gallery_elements() {
    let image_preview_template = document.getElementById("gallery-image-preview-template") as HTMLElement | null;
    let image_display = document.getElementById("gallery-image-display") as HTMLElement | null;

    if (!image_display || !image_preview_template) {
        return null;
    }

    return {
        image_preview_template,
        image_display
    }
}


async function get_all_media() {
    let response = await post_json("/media/fetch_all_media_metadata", {})
    if (response.error) {
        throw new Error(response.error);
    }

    let all_media: Media[] = response;

    if (all_media.length > 1) {
        all_media.sort((a: Media, b: Media) => b.creation_time - a.creation_time);
    }
    all_media = all_media.filter((m) => m && m.id)
    return all_media as Media[]
}

export default async function main() {
    let html_elements = get_gallery_elements();
    if (!html_elements) {
        throw new Error("Gallery HTML elements not initialized");
    }

    let all_media = await get_all_media();
    let target_url_promises = all_media.map(async (m) => {
        let target = await get_smallest_res_from_src(m.id, html_elements.image_display.clientWidth);
        return { target, media: m };
    })
    let targets = await Promise.all(target_url_promises);

    let entry_promises = targets.map((t) => {
        let entry = document.createElement("li");
        let clone = html_elements.image_preview_template.cloneNode(true) as HTMLTemplateElement;
        let clone_content = clone.content;

        entry.appendChild(clone_content);
        let img = entry.querySelector("img") as HTMLImageElement | null;
        if (!img) {
            throw new Error("could not find image element, something went wrong");
        }
        img.src = t.target;
        return { entry, ...t };
    })
    let entries = await Promise.all(entry_promises);

    entries.forEach((e) => {
        e.entry.onclick = () => {
            window.opener.receive_data(e.media.id);
            window.close();
        }
    })

    html_elements.image_display.innerHTML = "";
    entries.forEach((e) => {
        html_elements.image_display.appendChild(e.entry);
    });
}
