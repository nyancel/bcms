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
    id: undefined | number,
    author_id: undefined | number;
    last_changed: undefined | number;
    content: Array<TextItem | MediaItem>;
}

// global constants
const ARTICLE: Article = {
    id: undefined,
    author_id: undefined,
    last_changed: undefined,
    content: [],
};

const TEMPLATES = {
    paragraph: document.getElementById("article-paragraph-template") as HTMLTemplateElement | null,
    image: document.getElementById("article-image-template") as HTMLTemplateElement | null,
    heading: document.getElementById("article-heading-template") as HTMLTemplateElement | null,
}

const EDITOR = document.getElementById("editor-container");


// editor image functions
function editor_gallery_pop_up_select(index: number) {
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

function editor_image_upload(index: number) {
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

function editor_image_render(entry: HTMLElement, index: number) {
    let display = entry.querySelector(".image-display") as HTMLImageElement;
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

function editor_insert_template(template: HTMLTemplateElement) {
    console.log(template);
    if (!EDITOR) {
        throw new Error("Editor has not been initalized");
    }

    let entry = document.createElement("li");
    let clone = template.cloneNode(true) as HTMLTemplateElement;
    let item = clone.content;

    entry.appendChild(item);
    EDITOR.appendChild(entry);
    return entry;
}

function editor_connect_paragraph(entry: HTMLElement, index: number) {
    let textarea = entry.querySelector(".paragraph-input") as HTMLTextAreaElement;
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
    let alt_text = entry.querySelector(".image-alt-text-input") as HTMLInputElement;
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
        image_upload_button.onclick = () => editor_image_upload(index);
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
                entry = editor_insert_template(TEMPLATES.paragraph);
                editor_connect_paragraph(entry, index);
                break;

            case ItemTypeEnum.image:
                if (!TEMPLATES.image) {
                    throw new Error("image template not initialized");
                }
                console.log("inserting image");
                entry = editor_insert_template(TEMPLATES.image);
                editor_image_render(entry, index);
                editor_image_connect(entry, index);
                break;

            case ItemTypeEnum.heading:
                if (!TEMPLATES.heading) {
                    throw new Error("image template not initialized");
                }
                entry = editor_insert_template(TEMPLATES.heading);
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
    let log_button = document.getElementById("log-article");
    if (log_button) {
        log_button.onclick = () => editor_log_article();
    }

    let add_paragraph_button = document.getElementById("add-paragraph");
    if (add_paragraph_button) {
        add_paragraph_button.onclick = () => editor_add_item(ItemTypeEnum.paragraph);
    }

    let add_image_button = document.getElementById("add-image");
    if (add_image_button) {
        add_image_button.onclick = () => editor_add_item(ItemTypeEnum.image);
    }

    let add_heading_button = document.getElementById("add-heading");
    if (add_heading_button) {
        add_heading_button.onclick = () => editor_add_item(ItemTypeEnum.heading);
    }
}