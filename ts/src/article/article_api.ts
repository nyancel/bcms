
type Response = {
    data: any,
    message: string,
    time: number,
}

export enum ArticleItemTypeEnum {
    paragraph,
    image,
    heading
}

export type ArticleTextItem = {
    type: ArticleItemTypeEnum.heading | ArticleItemTypeEnum.paragraph,
    text: string,
    index: number,
}

export type ArticleMediaItem = {
    type: ArticleItemTypeEnum.image,
    alt_text: string,
    src_id: string | undefined,
    index: number,
}

export type Article = {
    id: string,
    title: string,
    body: Array<ArticleTextItem | ArticleMediaItem>,
    desc: string,
    user_id: string,
    timestamp: number,
    update_timestamp: number,
    accepted_id: string,
    isAccepted: boolean,
    isListed: boolean,
    isDraft: boolean,
    isDeleted: boolean,
}

export type ArticleSummary = {
    id: string,
    title: string,
    desc: string,
    user_id: string,
    image: string,
}

export type PostArticleRequest = {
    title: string,
    body: Array<ArticleTextItem | ArticleMediaItem>,
    desc: string,
    auth_token: string,
}

async function req(endpoint: string, payload: any) {
    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    let json = await response.json();
    return { status_code: response.status, body: json as Response };
}

export async function list_all_articles(auth_token: string) {
    let res = await req("/article/list_all_articles", { auth_token });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    console.log(res);
    let articles = res.body.data as ArticleSummary[];
    return articles;
}

export async function post_new_article(request: PostArticleRequest) {
    let res = await req("/article/post_article", request);
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let article = res.body.data as Article;
    return article;
}
