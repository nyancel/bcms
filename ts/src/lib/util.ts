export function random_id() {
    return window.crypto.randomUUID();
}


export function time() {
    let d = new Date();
    let current_time = d.getTime() / 1000;
    return current_time;
}


export async function post_json(endpoint: string, data: any) {
    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response;
}

export async function post_formdata(endpoint: string, data: FormData) {
    let response = await fetch(endpoint, {
        method: "POST",
        body: data,
    });
    return response;
}

