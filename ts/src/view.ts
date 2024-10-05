
import { post_json, time } from "./util";
// Typescript

// type ArticleTextItem = {
//     type: string,
//     content: string,
// }

// type ArticleImageItem = {
//     type: string,
//     src_id: string
//     text: string
// }

type Article = {
    accepted_id: string,
    body: Record<string, any>,
    desc: string,
    id: string,
    isAccepted: boolean,
    isDeleted: boolean,
    isDraft: boolean,
    isListed: boolean,
    timestamp: number,
    title: string,
    update_timestamp: number,
    user_id: string
}

type ErrorResponse = {
    error: string,
}

const ARTICLE_DISPLAY = document.querySelector("#article-display") as HTMLElement | null;

const ARTICLE_TEMPLATE_IMAGE = document.querySelector("#article-image") as HTMLTemplateElement | null;
const ARTICLE_TEMPLATE_TITLE = document.querySelector("#article-title") as HTMLTemplateElement | null;
const ARTICLE_TEMPLATE_METADATA = document.querySelector("#article-metadata") as HTMLTemplateElement | null;
const ARTICLE_TEMPLATE_DESC = document.querySelector("#article-desc") as HTMLTemplateElement | null;
const ARTICLE_TEMPLATE_TEXT = document.querySelector("#article-text") as HTMLTemplateElement | null;

export default function main() {
    // 1. Hente artikkelid fra urlen som view urlen går inn på
    let urlParam = new URLSearchParams(window.location.search);
    let article_id = urlParam.get("article-id");
    if (article_id == null) {
        throw new Error("Article not found!");
    }

    get_article(article_id);
}

function render_article(article: Article) {

    if (!ARTICLE_DISPLAY) {
        throw new Error("Display_article not found");
    }

    if (!ARTICLE_TEMPLATE_IMAGE) {
        throw new Error("Template IMAGE is not found")
    }

    if (!ARTICLE_TEMPLATE_TITLE) {
        throw new Error("Template TITLE is not found")
    }

    if (!ARTICLE_TEMPLATE_METADATA) {
        throw new Error("Template METADATA is not found")
    }

    if (!ARTICLE_TEMPLATE_DESC) {
        throw new Error("Template DESC is not found")
    }

    if (!ARTICLE_TEMPLATE_TEXT) {
        throw new Error("Template TEXT is not found")
    }

    ARTICLE_DISPLAY.innerHTML = ""

    // Render title
    let clone = ARTICLE_TEMPLATE_TITLE.cloneNode(true) as HTMLTemplateElement;
    let entry = clone.content;
    let render_title = entry.querySelector(".article-title") as HTMLElement | null;
    if (!render_title) {
        throw new Error("title not found")
    }
    render_title.innerHTML = article.title;
    ARTICLE_DISPLAY.append(entry);

    // Render desc
    clone = ARTICLE_TEMPLATE_DESC.cloneNode(true) as HTMLTemplateElement;
    entry = clone.content;
    let render_desc = entry.querySelector(".article-desc") as HTMLElement | null;
    if (!render_desc) {
        throw new Error("description not found!");
    }
    render_desc.innerHTML = article.desc;
    ARTICLE_DISPLAY.append(entry);

    // Render metadata
    clone = ARTICLE_TEMPLATE_METADATA.cloneNode(true) as HTMLTemplateElement;
    entry = clone.content;

    // Created timestamp
    let render_timestamp = entry.querySelector(".article-timestamp") as HTMLElement | null;
    if (!render_timestamp) {
        throw new Error("created timestamp not found")
    }
    let timestamp = new Date(0);
    timestamp.setUTCSeconds(article.timestamp);
    render_timestamp.innerHTML = `Skrevet: ${timestamp.toLocaleString()}`;

    // update timestamp
    let render_update_timestamp = entry.querySelector(".article-update-timestamp") as HTMLElement | null;
    if (!render_update_timestamp) {
        throw new Error("update timestamp not found");
    }
    let update_timestamp = new Date(0);
    update_timestamp.setUTCSeconds(article.update_timestamp);
    render_update_timestamp.innerHTML = `Oppdatert: ${update_timestamp.toLocaleString()}`;

    // Author
    let render_author = entry.querySelector(".article-author") as HTMLElement | null;
    if (!render_author) {
        throw new Error("author not found");
    }
    render_author.innerHTML = `Skrevet av ${article.user_id}`;
    ARTICLE_DISPLAY.append(entry);


    // Render body

    // TODO sortere slik at index i body blir rett rekkefølge
    for (let index = 0; index < article.body.length; index++) {
        switch (article.body[index].type) {
            // TODO hente rett resolution av image
            case "image":
                clone = ARTICLE_TEMPLATE_IMAGE.cloneNode(true) as HTMLTemplateElement;
                entry = clone.content;
                let render_image = entry.querySelector(".article-image") as HTMLImageElement | null;
                let render_image_src = article.body[index].src_id;

                if (render_image) {
                    render_image.src = render_image_src;
                }
                ARTICLE_DISPLAY.appendChild(entry);
                break;
            case "paragraph":
                clone = ARTICLE_TEMPLATE_TEXT.cloneNode(true) as HTMLTemplateElement;
                entry = clone.content;
                let render_text = entry.querySelector(".article-text") as HTMLElement | null;
                if (!render_text) {
                    throw new Error("text not found")
                }
                render_text.innerHTML = article.body[index].text;
                ARTICLE_DISPLAY.appendChild(entry);
                break;
        }

    }


}

async function get_article(article_id: string | null) {
    // Post request til blueprint for å hente artikkel json
    let article: Article | ErrorResponse = await post_json("/article/get_article", { "id": article_id });
    if ("error" in article) {
        throw new Error(article.error);
    }

    console.log(article)

    render_article(article);
}

