import { time, post_formdata, get_smallest_res_from_src } from "./util";

// types and declerations
declare global {
    interface Window {
        receive_data: (data: string) => void;
    }
}

enum ItemTypeEnum {
    paragraph,
    image,
    heading
}

type TextItem = {
    type: ItemTypeEnum.heading | ItemTypeEnum.paragraph,
    text: string,
    index: number,
}

type MediaItem = {
    type: ItemTypeEnum.image,
    alt_text: string,
    src_id: string | undefined,
    index: number,
}

type Article = {
    id: undefined | string,
    author_id: string;
    title: string;
    description: string;
    content: Array<TextItem | MediaItem>;
    last_changed: number;
}

type Templates = {
    paragraph: HTMLTemplateElement,
    image: HTMLTemplateElement,
    heading: HTMLTemplateElement,
}

type ControllButtons = {
    log_button: HTMLButtonElement;
    add_paragraph_button: HTMLButtonElement;
    add_image_button: HTMLButtonElement;
    add_heading_button: HTMLButtonElement;
}

// internal init functions;
function get_controll_buttons() {
    let log_button = document.getElementById("log-article") as HTMLButtonElement | null;
    let add_paragraph_button = document.getElementById("add-paragraph") as HTMLButtonElement | null;
    let add_image_button = document.getElementById("add-image") as HTMLButtonElement | null;
    let add_heading_button = document.getElementById("add-heading") as HTMLButtonElement | null;

    if (
        !log_button ||
        !add_paragraph_button ||
        !add_image_button ||
        !add_heading_button
    ) {
        return null;
    }

    let controll_buttons: ControllButtons = {
        log_button,
        add_paragraph_button,
        add_image_button,
        add_heading_button
    }

    return controll_buttons;
}

function get_templates() {
    let paragraph_templte = document.getElementById("article-paragraph-template") as HTMLTemplateElement | null;
    let image_templte = document.getElementById("article-image-template") as HTMLTemplateElement | null;
    let heading_templte = document.getElementById("article-heading-template") as HTMLTemplateElement | null;

    if (
        !paragraph_templte ||
        !image_templte ||
        !heading_templte
    ) {
        return null;
    }

    let templates: Templates = {
        paragraph: paragraph_templte,
        image: image_templte,
        heading: heading_templte,
    }

    return templates;
}

function get_editor() {
    return document.getElementById("editor-container") as HTMLElement | null;
}


// editor image functions
function set_image_from_gallery_popup(index: number) {
    const popup = window.open(
        "/gallery-popup",
        "popupWindow",
        "width=600,height=400"
    );

    window.receive_data = function (data: string) {
        if (!ARTICLE.content) {
            return;
        }

        let item = ARTICLE.content[index];
        if (item.type != ItemTypeEnum.image) {
            return;
        }
        item.src_id = data;
        editor_generate_preview();
    };
}

function set_image_from_file_upload(index: number) {
    // select a file
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "png, jpg, jpeg";
    input.multiple = false;
    input.onchange = async () => {
        if (!ARTICLE.content) {
            return;
        }
        let media_item = ARTICLE.content[index];
        if (media_item.type != ItemTypeEnum.image) {
            return;
        }
        // retrieve the selected file
        let input_files = input.files;
        if (!input_files) {
            return;
        }
        let files = Array.from(input_files);
        let file = files[0];
        input.remove();

        // upload the file to the gallery
        let formdata = new FormData();
        formdata.append("media", file);
        let image = await post_formdata("/media/upload_media", formdata);
        let image_id = image.data.results[0].key;
        // set the item source
        media_item.src_id = image_id;
        ARTICLE.last_changed = time();
        editor_generate_preview();
    };
    input.click();
}

function render_image(entry: HTMLElement, index: number) {
    let display = entry.querySelector(".image-display") as HTMLImageElement | null;
    if (!display) {
        throw new Error("media-display not found");
    }

    if (!ARTICLE.content) {
        throw new Error("article content not initialized");
    }

    let media_item = ARTICLE.content[index];
    if (media_item.type != ItemTypeEnum.image) {
        throw new Error("item type is not image");
    }

    // if src_id is undefined we have not yet chosen an image.
    if (!media_item.src_id) {
        display.classList.toggle("hidden", true);
        return;
    }

    // else image_id is defined and we render the image
    const load = async () => {
        if (!ARTICLE.content) {
            throw new Error("article content not initialized");
        }
        let media_item = ARTICLE.content[index];
        if (media_item.type != ItemTypeEnum.image) {
            throw new Error("item type is not image");
        }
        if (!media_item.src_id) {
            throw new Error("src_id not found");
        }
        display.src = await get_smallest_res_from_src(
            media_item.src_id,
            entry.clientWidth
        );
        display.classList.toggle("hidden", false);
    };
    load();
}

function insert_template_in_editor(template: HTMLTemplateElement) {
    console.log(template);
    if (!EDITOR) {
        throw new Error("Editor has not been initalized");
    }

    let entry = document.createElement("li");
    let clone = template.cloneNode(true) as HTMLTemplateElement | null;
    if (!clone) {
        throw new Error("could not clone template");
    }
    let item = clone.content;

    entry.appendChild(item);
    EDITOR.appendChild(entry);
    return entry;
}

function editor_connect_paragraph(entry: HTMLElement, index: number) {
    let textarea = entry.querySelector(".paragraph-input") as HTMLTextAreaElement | null;
    if (!textarea) {
        throw new Error("Could not find textarea");
    }
    let text_item = ARTICLE.content[index];
    if (text_item.type != ItemTypeEnum.paragraph) {
        throw new Error("Article item at index is not a paragraph");
    }
    textarea.value = text_item.text;
    textarea.onchange = () => {
        text_item.text = textarea.value;
    };
}

function editor_image_connect(entry: HTMLElement, index: number) {
    // connect the alt-text and its relevant update
    let alt_text = entry.querySelector(".image-alt-text-input") as HTMLInputElement | null;
    if (!alt_text) {
        throw new Error("could not find alt_text element");
    }
    let image_item = ARTICLE.content[index];
    if (image_item.type != ItemTypeEnum.image) {
        throw new Error("Article item at index is not a image");
    }
    if (image_item.alt_text) {
        alt_text.value = image_item.alt_text;
    }
    alt_text.onchange = () => {
        image_item.alt_text = alt_text.value;
    };

    // connect the upload buttons
    let image_select_button = entry.querySelector(".image-gallery-select") as HTMLElement | null;
    let image_upload_button = entry.querySelector(".image-gallery-upload") as HTMLElement | null;

    if (image_select_button) {
        image_select_button.onclick = () => editor_gallery_pop_up_select(index);
    }
    if (image_upload_button) {
        image_upload_button.onclick = () => set_image_from_file_upload(index);
    }
}

function editor_connect_generic(entry: HTMLElement, index: number) {
    // generic delete
    let delete_button = entry.querySelector(".delete-button") as HTMLElement | null;
    if (delete_button) {
        delete_button.onclick = () => {
            remove_item_from_article(index);
            editor_generate_preview();
        };
    }

    // generic move up
    let move_up_button = entry.querySelector(".move-up-button") as HTMLElement | null;
    if (move_up_button) {
        move_up_button.onclick = () => {
            editor_move_item_up(index);
            editor_generate_preview();
        };
    }

    // generic move down
    let move_down_button = entry.querySelector(".move-down-button") as HTMLElement | null;
    if (move_down_button) {
        move_down_button.onclick = () => {
            editor_move_item_down(index);
            editor_generate_preview();
        };
    }
}

// view functions
function editor_generate_preview() {
    let y_pos = window.scrollY;
    if (!EDITOR) {
        throw new Error("Editor is not initialized");
    }

    if (!ARTICLE) {
        throw new Error("Article is not initialized");
    }

    EDITOR.innerHTML = "";

    let entry;

    for (let index = 0; index < ARTICLE.content.length; index++) {
        switch (ARTICLE.content[index].type) {
            case ItemTypeEnum.paragraph:
                if (!TEMPLATES.paragraph) {
                    throw new Error("paragraph template not initialized");
                }
                entry = insert_template_in_editor(TEMPLATES.paragraph);
                editor_connect_paragraph(entry, index);
                break;

            case ItemTypeEnum.image:
                if (!TEMPLATES.image) {
                    throw new Error("image template not initialized");
                }
                console.log("inserting image");
                entry = insert_template_in_editor(TEMPLATES.image);
                editor_image_render(entry, index);
                editor_image_connect(entry, index);
                break;

            case ItemTypeEnum.heading:
                if (!TEMPLATES.heading) {
                    throw new Error("image template not initialized");
                }
                entry = insert_template_in_editor(TEMPLATES.heading);
                // editor_heading_connect(entry, index); // TODO fix the editor heading connector
                break;

            // skip to next item if we dont have a template for the type
            default:
                console.log("Item type in editor-render is unknown, skipping")
                continue;
        }
        editor_connect_generic(entry, index);
    }

    requestAnimationFrame(() => {
        window.scrollTo(0, y_pos);
    });
}

// article functions
function editor_add_item(item_type: ItemTypeEnum) {

    if (!ARTICLE.content) {
        ARTICLE.content = [];
    }

    let length = ARTICLE.content.length;
    let new_item: TextItem | MediaItem;

    switch (item_type) {
        case ItemTypeEnum.paragraph:
        case ItemTypeEnum.heading:
            new_item = {
                type: item_type,
                text: "",
                index: length
            }
            break;
        case ItemTypeEnum.image:
            new_item = {
                type: item_type,
                alt_text: "",
                index: length,
                src_id: undefined,
            }
            break;
    }

    ARTICLE.content.push(new_item);
    ARTICLE.last_changed = time();
    editor_generate_preview();
}

function remove_item_from_article(index: number) {
    ARTICLE.content?.splice(index, 1);
    ARTICLE.last_changed = time();
}

function editor_move_item_down(index_to_change: number) {
    if (!ARTICLE.content) {
        return;
    }

    if (index_to_change >= ARTICLE.content.length - 1) {
        return;
    }

    let item = ARTICLE.content[index_to_change];
    ARTICLE.content[index_to_change] = ARTICLE.content[index_to_change + 1];
    ARTICLE.content[index_to_change + 1] = item;
    // assign new indexes
    ARTICLE.content[index_to_change].index = index_to_change;
    ARTICLE.content[index_to_change + 1].index = index_to_change + 1;

    ARTICLE.last_changed = time();
}

function editor_move_item_up(index_to_change: number) {
    if (!ARTICLE.content) {
        return;
    }

    if (index_to_change < 1) {
        return;
    }
    let item = ARTICLE.content[index_to_change];
    ARTICLE.content[index_to_change] = ARTICLE.content[index_to_change - 1];
    ARTICLE.content[index_to_change - 1] = item;
    // assign new indexes
    ARTICLE.content[index_to_change].index = index_to_change;
    ARTICLE.content[index_to_change - 1].index = index_to_change - 1;

    ARTICLE.last_changed = time();
}

function editor_log_article() {
    console.log(ARTICLE.content);
}

export default function main() {
    let controll_buttons = get_controll_buttons();
    if (!controll_buttons) {
        throw new Error("controll buttons not initialized");
    }

    controll_buttons.log_button.onclick = () => editor_log_article();
    controll_buttons.add_paragraph_button.onclick = () => editor_add_item(ItemTypeEnum.paragraph);
    controll_buttons.add_image_button.onclick = () => editor_add_item(ItemTypeEnum.image);
    controll_buttons.add_heading_button.onclick = () => editor_add_item(ItemTypeEnum.heading);
}