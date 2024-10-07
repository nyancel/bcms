export type ApiResponse = {
    time: number,
    message: string,
    data: any,
    success: number,
    status_code: number
}

export async function post_json(endpoint: string, data: Object) {
    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    let status_code = response.status;
    let json = await response.json();
    let result: ApiResponse = {
        time: json.time,
        message: json.message,
        data: json.data,
        success: json.success,
        status_code: status_code,
    }
    return result;
}


export async function post_json_raw_response(endpoint: string, data: Object) {
    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    let status_code = response.status;
    let json = await response.json();
    return { json, status_code };
}