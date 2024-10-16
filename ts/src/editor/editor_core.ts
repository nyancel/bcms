import * as user_api from "../bcms/user";
import * as user_core from "../user/user_core";
import * as util from "../lib/util"

enum ArticleItemTypeEnum {
    paragraph,
    image,
    heading
}

type ArticleTextItem = {
    type: ArticleItemTypeEnum.heading | ArticleItemTypeEnum.paragraph,
    text: string,
    index: number,
}

type ArticleMediaItem = {
    type: ArticleItemTypeEnum.image,
    alt_text: string,
    src_id: string | undefined,
    index: number,
}

export type DraftArticleData = {
    draft_id: string,
    author_id: string;
    title: string;
    description: string;
    content: Array<ArticleTextItem | ArticleMediaItem>;
    last_changed: number;
}

const LOCAL_DRAFTS_STORAGE_KEY = "BCMS_EDITORTS_LOCAL_DRAFTS";

export function load_local_drafts() {
    let drafts_string = localStorage.getItem(LOCAL_DRAFTS_STORAGE_KEY);
    if (!drafts_string) {
        return null;
    }

    let Drafts: DraftArticleData[] = JSON.parse(drafts_string);
    if (!Drafts) {
        throw new Error("could not parse the local drafts, you fucked up somehow");
    }
    return Drafts;
}

export function save_drafts_to_local(drafts: DraftArticleData[]) {
    let drafts_dump = JSON.stringify(drafts);
    localStorage.setItem(LOCAL_DRAFTS_STORAGE_KEY, drafts_dump);
}

export function clear_local_drafts() {
    localStorage.removeItem(LOCAL_DRAFTS_STORAGE_KEY);
}

export function new_empty_draft(userdata: user_api.UserData) {
    let article: DraftArticleData = {
        author_id: userdata.id,
        content: [],
        description: "This is a draft article",
        last_changed: util.time(),
        draft_id: util.random_id(),
        title: "New article",
    };
    return article;
}


// article functions
function article_add_item(article: DraftArticleData, item_type: ArticleItemTypeEnum) {
    let length = article.content.length;
    let new_item: ArticleTextItem | ArticleMediaItem;

    switch (item_type) {
        case ArticleItemTypeEnum.paragraph:
        case ArticleItemTypeEnum.heading:
            new_item = {
                type: item_type,
                text: "",
                index: length
            }
            break;
        case ArticleItemTypeEnum.image:
            new_item = {
                type: item_type,
                alt_text: "",
                index: length,
                src_id: undefined,
            }
            break;
    }

    article.content.push(new_item);
    article.last_changed = util.time();

    return article;
}

function article_delete_item(article: DraftArticleData, index: number) {
    article.content.splice(index, 1);
    article.last_changed = util.time();
    return article;
}

function article_move_item(article: DraftArticleData, index: number, move_by: number) {
    let target = index + move_by;
    if (target < 0 || target >= article.content.length) {
        throw new Error("target position is out of bounds");
    }
    let [item_to_move] = article.content.splice(index, 1);
    article.content.splice(target, 0, item_to_move);
    article.last_changed = util.time();

    return article;
}