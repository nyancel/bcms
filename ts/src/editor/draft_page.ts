import * as user_local from "../user/user_local";
import * as article_api from "../article/article_api";

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

async function load_all_drafts(user: user_local.UserStorageData) {
    let all_drafts = await article_api.list_all_articles(user.token.id);
    if (all_drafts.length > 0) {
        all_drafts = all_drafts.filter((a) => a.user_id == user.user.id);
    }
    return all_drafts;
}

async function new_empty_draft(user: user_local.UserStorageData) {
    let post_request_data: article_api.PostArticleRequest = {
        auth_token: user.token.id,
        body: [],
        desc: "New draft",
        title: "New draft",
    }
    let article = await article_api.post_new_article(post_request_data);
    return article;
}

async function delete_draft(draft_id: string, user: user_local.UserStorageData) {
    console.log("Not implemented yet");
}

function render_draft_list(drafts: article_api.ArticleSummary[], html_elements: DraftHtmlElements, user: user_local.UserStorageData) {
    let app_view = html_elements.editor_app_view;

    drafts.forEach((draft) => {
        let template_clone = html_elements.draft_preview_template.cloneNode(true) as HTMLTemplateElement;
        let content = template_clone.content;
        let template_elements = get_draft_template_elements(content);
        if (!template_elements) {
            throw new Error("could not instantiate draft template");
        }
        template_elements.draft_render_title.innerHTML = draft.title;
        template_elements.draft_render_description.innerHTML = draft.desc;
        template_elements.edit_draft_button.onclick = () => {
            window.location.href = `/editor?article-id=${draft.id}`;
        }
        template_elements.delete_draft_button.onclick = () => {
            delete_draft(draft.id, user)
        }
        app_view.appendChild(content);
    })
}

export default async function main() {
    let user = user_local.get_local_user_data();
    if (!user) {
        throw new Error("User not logged in");
    }

    let html_elements = init_all_html_elements();
    if (!html_elements) {
        throw new Error("Draft items not found, cant render page");
    }

    let all_drafts = await load_all_drafts(user);
    console.log(all_drafts);

    render_draft_list(all_drafts, html_elements, user);

    html_elements.new_draft_button.onclick = async () => {
        let new_draft = await new_empty_draft(user);
        window.location.href = `/editor?article-id=${new_draft.id}`
    }
}