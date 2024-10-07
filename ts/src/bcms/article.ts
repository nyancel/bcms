import * as core_api from "./core";


export type ArticleData = {
    title: string
    body: string
    desc: string
    user_id: string
    isdraft: boolean
}

export async function post_article(data: ArticleData) {
    let request_data = { ...data };
    let response = await core_api.post_json_raw_response("/article/post_article", request_data);
    return response;
}

export async function delete_article(article_id: string) {
    let id = article_id;
    let request_data = { id };
    let response = await core_api.post_json_raw_response("/article/delete_article", request_data);
    return response;
}

export async function update_article(article_id: string, data: ArticleData) {
    let id = article_id;
    let request_data = { ...data, id };
    let response = await core_api.post_json_raw_response("/article/update_article", request_data);
    return response;
}

export async function list_all_articles() {
    let response = await core_api.post_json_raw_response("/article/list_all_articles", {});
    return response;
}

export async function get_article(article_id: string) {
    let id = article_id;
    let request_data = { id };
    let response = await core_api.post_json_raw_response("/article/get_article", request_data);
    return response;
}

export async function approve_article(article_id: string, auth_token: string) {
    let id = article_id;
    let request_data = { id, auth_token };
    let response = await core_api.post_json_raw_response("/article/approve_article", request_data);
    return response;
}

