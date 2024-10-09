import { get_local_user_data } from "../user/user_core";
import * as editor_core from "./editor_core";
import * as events from "../lib/events";

type DraftHtmlElements = {
    draft_preview_template: HTMLTemplateElement,
    editor_app_view: HTMLElement;
    draft_controlls_template: HTMLTemplateElement;
    draft_controlls: HTMLElement;
    new_draft_button: HTMLButtonElement;
    draft_render_list: HTMLOListElement;
}

type DraftTemplateElements = {
    delete_draft_button: HTMLButtonElement;
    edit_draft_button: HTMLButtonElement;
    draft_render_title: HTMLHeadingElement;
    draft_render_description: HTMLParagraphElement;
}

function get_draft_template_elements(entry: DocumentFragment) {
    let delete_draft_button = entry.querySelector(".delete-draft-button") as HTMLButtonElement | null;
    let edit_draft_button = entry.querySelector(".edit-draft-button") as HTMLButtonElement | null;
    let draft_render_title = entry.querySelector(".draft-render-title") as HTMLHeadingElement | null;
    let draft_render_description = entry.querySelector(".draft-render-description") as HTMLParagraphElement | null;

    if (
        !delete_draft_button ||
        !edit_draft_button ||
        !draft_render_title ||
        !draft_render_description
    ) { return null; }

    let elements: DraftTemplateElements = {
        delete_draft_button,
        edit_draft_button,
        draft_render_title,
        draft_render_description
    }
    return elements;
}

function init_all_html_elements() {
    // fetch static items and templates
    let draft_preview_template = document.getElementById("draft-preview-template") as HTMLTemplateElement | null;
    let editor_app_view = document.getElementById("editor-app-view") as HTMLTemplateElement | null;
    let draft_controlls_template = document.getElementById("draft-controlls-template") as HTMLTemplateElement | null;

    if (
        !draft_preview_template ||
        !editor_app_view ||
        !draft_controlls_template
    ) { return null; }

    // get and instantiate inner controlls
    let clone = draft_controlls_template.cloneNode(true) as HTMLTemplateElement;
    let entry = clone.content;
    let draft_controlls = entry.querySelector(".draft-controlls") as HTMLElement | null;
    let new_draft_button = entry.querySelector(".new-draft-button") as HTMLButtonElement | null;
    let draft_render_list = entry.querySelector(".draft-render-list") as HTMLOListElement | null;

    if (
        !draft_controlls ||
        !new_draft_button ||
        !draft_render_list
    ) {
        console.log("controlls not found")
        return null;
    }

    // insert into dom
    editor_app_view.innerHTML = "";
    editor_app_view.appendChild(entry);

    let elements: DraftHtmlElements = {
        draft_preview_template,
        editor_app_view,
        draft_controlls_template,
        draft_controlls,
        new_draft_button,
        draft_render_list
    }
    return elements;
}

function render_drafts(html_elements: DraftHtmlElements, all_drafts: editor_core.DraftArticleData[]) {
    html_elements.draft_render_list.innerHTML = "";
    for (let index = 0; index < all_drafts.length; index++) {
        let clone = html_elements.draft_preview_template.cloneNode(true) as HTMLTemplateElement;
        let entry = clone.content;
        let entry_elements = get_draft_template_elements(entry);
        if (!entry_elements) {
            throw new Error("could not instantiate draft template elements");
        }

        entry_elements.draft_render_title.innerText = all_drafts[index].title;
        entry_elements.draft_render_description.innerText = all_drafts[index].description;
        html_elements.draft_render_list.appendChild(entry);
    }
}

export default function main() {
    let user = get_local_user_data();
    if (!user) {
        throw new Error("User not logged in");
    }

    let html_elements = init_all_html_elements();
    if (!html_elements) {
        throw new Error("Draft items not found, cant render page");
    }

    events.EVENTBUS.on(events.EventTypeEnum.DraftsChanged, (data: any) => {
        render_drafts(html_elements, data)
    })

    let all_drafts = editor_core.load_local_drafts();
    if (!all_drafts) {
        all_drafts = [];
        editor_core.save_drafts_to_local(all_drafts);
    }
    events.EVENTBUS.emit(events.EventTypeEnum.DraftsChanged, all_drafts)

    html_elements.new_draft_button.onclick = () => {
        let new_draft = editor_core.new_empty_draft(user.user);
        all_drafts.push(new_draft);
        editor_core.save_drafts_to_local(all_drafts);
        events.EVENTBUS.emit(events.EventTypeEnum.DraftsChanged, all_drafts)
    }



    console.log("editor draft view");
}