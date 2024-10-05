import { post_json, get_smallest_res_from_src } from "./util";
// import { get_current_user_token_id } from "./user";

type Article = {
    id: string,
    title: string,
    desc: string,
    user_id: string,
    image: Record<string, any>
}

type ErrorResponse = {
    error: string,
}

const ARTICLE_TEMPLATE = document.querySelector("#list-article-template") as HTMLTemplateElement | null;
const ARTICLE_DISPLAY = document.querySelector("#list-article-display") as HTMLElement | null;

export default function main() {
    list_all();

}

function render_articles(articles: Article[]) {
    if (!ARTICLE_DISPLAY) {
        throw new Error("Display list_article not found");
    }

    if (!ARTICLE_TEMPLATE) {
        throw new Error("Template is not found")
    }

    ARTICLE_DISPLAY.innerHTML = ""

    for (let index = 0; index < articles.length; index++) {

        // Generate from template
        let clone = ARTICLE_TEMPLATE.cloneNode(true) as HTMLTemplateElement;
        // Alt unntatt <template>
        let entry = clone.content;
        let render_title = entry.querySelector(".list-article-title") as HTMLElement | null;
        if (!render_title) {
            throw new Error("title not found")
        }
        render_title.innerHTML = articles[index].title;


        // TODO: fetch local images from server with get_smalest_res_from_src

        // Render image if found in article
        if (articles[index].image["src_id"]) {

            let render_image = entry.querySelector(".list-article-image") as HTMLImageElement | null;
            let render_image_src = articles[index].image["src_id"];

            if (render_image) {
                render_image.src = render_image_src;
            }

        }

        let render_desc = entry.querySelector(".list-article-desc") as HTMLElement | null;
        if (!render_desc) {
            throw new Error("title not found")
        }
        render_desc.innerHTML = articles[index].desc;

        let render_user_id = entry.querySelector(".list-article-user_id") as HTMLElement | null;
        if (!render_user_id) {
            throw new Error("title not found")
        }
        render_user_id.innerHTML = articles[index].user_id;

        let entryElement = entry.querySelector(".list-article-link") as HTMLElement | null;
        if (!entryElement) {
            throw new Error("entry element not found");
        }
        entryElement.onclick = () => {
            window.location.href = `/view?article-id=${articles[index].id}`;
        }

        // Display faktiske artikkelen
        ARTICLE_DISPLAY.appendChild(entry);
    }
}

async function list_all() {
    let all_articles: Article[] | ErrorResponse = await post_json("/article/list_all_articles", {});
    if ("error" in all_articles) {
        throw new Error(all_articles.error);
    }

    render_articles(all_articles);

    window.setTimeout(() => { list_all(); }, 1000 * 60 * 10)
}
