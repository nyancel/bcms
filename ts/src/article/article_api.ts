
type Response = {
    data: any,
    message: string,
    time: number,
}

export type ArticleSummary = {
    id: string,
    title: string,
    desc: string,
    user_id: string,
    image: string,
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
    let articles = res.body.data as ArticleSummary[];
    return articles;
}
