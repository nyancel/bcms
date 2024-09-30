import { isAssertionExpression } from "typescript";
import { get_local_user_data } from "./user";

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

// constant values
const LOCAL_ARTICLE_STORAGE_KEY = "editor-ts-local-article";

// internal storage functions
function load_local_article() {
    let article_string = localStorage.getItem(LOCAL_ARTICLE_STORAGE_KEY);
    if (!article_string) {
        return null;
    }

    let article: Article = JSON.parse(article_string);
    if (!article) {
        throw new Error("could not parse the local article, you fucked up somehow");
    }
    return article;
}

function save_article_to_local(article: Article) {
    let article_dump = JSON.stringify(article);
    localStorage.setItem(LOCAL_ARTICLE_STORAGE_KEY, article_dump);
}

function clear_local_article() {
    localStorage.removeItem(LOCAL_ARTICLE_STORAGE_KEY);
}

// internal init functions;
function init_empty_article() {
    let user_data = get_local_user_data();
    if (!user_data) {
        throw new Error("no user data found, not logged in");
    }

    let article: Article = {
        author_id: user_data.user.id,
        content: [],
        description: "",
        last_changed: time(),
        id: undefined,
        title: "",
    };
    save_article_to_local(article);
    return article;
}

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
        let article = load_local_article();
        if (!article) {
            throw new Error("could not load artilce");
        }

        let item = article.content[index];
        if (item.type != ItemTypeEnum.image) {
            return;
        }
        item.src_id = data;
        render_editor();
    };
}

function set_image_from_file_upload(index: number) {
    // select a file
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "png, jpg, jpeg";
    input.multiple = false;
    input.onchange = async () => {

        let article = load_local_article();
        if (!article) {
            throw new Error("could not load artilce");
        }

        let media_item = article.content[index];
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
        article.last_changed = time();
        save_article_to_local(article);
        render_editor();

    };
    input.click();
}

function render_image(entry: HTMLElement, index: number, article: Article) {
    let display = entry.querySelector(".image-display") as HTMLImageElement | null;
    if (!display) {
        throw new Error("media-display not found");
    }

    let media_item = article.content[index];
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
        let media_item = article.content[index];
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

function insert_template_in_editor(template: HTMLTemplateElement, editor: HTMLElement) {
    console.log(template);

    let entry = document.createElement("li");
    let clone = template.cloneNode(true) as HTMLTemplateElement | null;
    if (!clone) {
        throw new Error("could not clone template");
    }
    let item = clone.content;

    entry.appendChild(item);
    editor.appendChild(entry);
    return entry;
}

function editor_connect_paragraph(entry: HTMLElement, index: number) {
    let article = load_local_article();
    if (!article) {
        throw new Error("could not load article");
    }

    // init the text-area
    let textarea = entry.querySelector(".paragraph-input") as HTMLTextAreaElement | null;
    if (!textarea) {
        throw new Error("Could not find textarea");
    }
    let text_item = article.content[index];
    if (text_item.type != ItemTypeEnum.paragraph) {
        throw new Error("Article item at index is not a paragraph");
    }
    textarea.value = text_item.text;

    // commit changes when they occur
    textarea.onchange = () => {
        let article = load_local_article();
        if (!article) {
            throw new Error("could not load article");
        }
        let text_item = article.content[index];
        if (text_item.type != ItemTypeEnum.paragraph) {
            throw new Error("Article item at index is not a paragraph");
        }
        text_item.text = textarea.value;
        save_article_to_local(article);
    };
}

function editor_image_connect(entry: HTMLElement, index: number) {
    // connect the alt-text and its relevant update
    let article = load_local_article();
    if (!article) {
        throw new Error("could not load article");
    }

    // init the image-item alt text
    let image_item = article.content[index];
    if (image_item.type != ItemTypeEnum.image) {
        throw new Error("Article item at index is not a image");
    }

    let alt_text = entry.querySelector(".image-alt-text-input") as HTMLInputElement | null;
    if (!alt_text) {
        throw new Error("could not find alt_text element");
    }

    alt_text.value = image_item.alt_text;

    // commit alt text changes when they occurs
    alt_text.onchange = () => {
        let article = load_local_article();
        if (!article) {
            throw new Error("could not load article");
        }
        let image_item = article.content[index];
        if (image_item.type != ItemTypeEnum.image) {
            throw new Error("Article item at index is not a image");
        }
        image_item.alt_text = alt_text.value;
        save_article_to_local(article);
    };

    // connect the upload buttons
    let image_select_button = entry.querySelector(".image-gallery-select") as HTMLElement | null;
    let image_upload_button = entry.querySelector(".image-gallery-upload") as HTMLElement | null;

    if (image_select_button) {
        image_select_button.onclick = () => set_image_from_gallery_popup(index);
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
            article_delete_item(index);
            render_editor();
        };
    }

    // generic move up
    let move_up_button = entry.querySelector(".move-up-button") as HTMLElement | null;
    if (move_up_button) {
        move_up_button.onclick = () => {
            article_move_item(index, -1);
            render_editor();
        };
    }

    // generic move down
    let move_down_button = entry.querySelector(".move-down-button") as HTMLElement | null;
    if (move_down_button) {
        move_down_button.onclick = () => {
            article_move_item(index, 1);
            render_editor();
        };
    }
}

// view functions
function render_editor() {
    let article = load_local_article();
    if (!article) {
        throw new Error("could not load article");
    }

    let y_pos = window.scrollY;
    let editor = get_editor();
    let templates = get_templates();

    if (!editor) {
        throw new Error("Editor is not initialized");
    }

    if (!templates) {
        throw new Error("templates did not load");
    }

    editor.innerHTML = "";
    let entry;

    for (let index = 0; index < article.content.length; index++) {
        switch (article.content[index].type) {
            case ItemTypeEnum.paragraph:
                entry = insert_template_in_editor(templates.paragraph, editor);
                editor_connect_paragraph(entry, index);
                break;

            case ItemTypeEnum.image:
                entry = insert_template_in_editor(templates.image, editor);
                render_image(entry, index, article);
                editor_image_connect(entry, index);
                break;

            case ItemTypeEnum.heading:
                entry = insert_template_in_editor(templates.heading, editor);
                // editor_heading_connect(entry, index); TODO fix the editor heading connector
                break;

            // skip to next item if we dont have a template for the type
            default:
                console.log("Item type in editor-render is unknown, skipping")
                continue;
        }
        editor_connect_generic(entry, index);
    }

    save_article_to_local(article);

    requestAnimationFrame(() => {
        window.scrollTo(0, y_pos);
    });
}

// article functions
function article_add_item(item_type: ItemTypeEnum) {
    let article = load_local_article();
    if (!article) {
        throw new Error("could not load artilce");
    }

    let length = article.content.length;
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

    article.content.push(new_item);
    article.last_changed = time();

    save_article_to_local(article);
    render_editor();
}

function article_delete_item(index: number) {
    let article = load_local_article();
    if (!article) {
        throw new Error("could not load article");
    }

    article.content.splice(index, 1);
    article.last_changed = time();

    save_article_to_local(article);
    return article;
}

function article_move_item(index: number, move_by: number) {
    let article = load_local_article();
    if (!article) {
        throw new Error("could not load article");
    }

    let target = index + move_by;
    if (target < 0 || target >= article.content.length) {
        throw new Error("target position is out of bounds");
    }
    let [item_to_move] = article.content.splice(index, 1);
    article.content.splice(target, 0, item_to_move);
    article.last_changed = time();

    save_article_to_local(article);
    return article;
}


export default function main() {
    let user_data = get_local_user_data();
    if (!user_data) {
        // redirect out of editor if not logged in
        window.location.href = "/";
        return;
    }

    // load or initalize the article;
    let article = load_local_article();
    if (!article) {
        article = init_empty_article();
    }

    let controll_buttons = get_controll_buttons();
    if (!controll_buttons) {
        throw new Error("controll buttons not initialized");
    }

    controll_buttons.log_button.onclick = () => console.log(article);
    // insertion buttons
    controll_buttons.add_paragraph_button.onclick = () => article_add_item(ItemTypeEnum.paragraph);
    controll_buttons.add_image_button.onclick = () => article_add_item(ItemTypeEnum.image);
    controll_buttons.add_heading_button.onclick = () => article_add_item(ItemTypeEnum.heading);

    render_editor();
}