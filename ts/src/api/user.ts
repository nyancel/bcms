type UserApiResponse = {
    time: number,
    message: string,
    data: any,
    success: number,
    status_code: number
}

type UserTokenData = {
    id: string,
    user_id: string,
    created_at: number,
    expires_at: number,
}

type UserData = {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    last_edited: number,
    created_at: number,
}


async function post_json(endpoint: string, data: Object) {
    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    let status_code = response.status;
    let json = await response.json();
    let result = { ...json, status_code } as UserApiResponse;
    return result;
}


export async function login(email: string, password: string) {
    let login_data = { email, password }
    let response = await post_json("/user/login", login_data);
    if (response.success == 0) {
        return response;
    }
    let token = response.data as UserTokenData;
    return { response, token };
}

export async function logout(auth_token: string) {
    let logout_data = { auth_token }
    let response = await post_json("/user/login", logout_data);
    return response;
}

export async function register(email: string, password: string, firstname: string, lastname: string) {
    let register_data = { email, password, firstname, lastname }
    let response = await post_json("user/register", register_data);
    if (response.success == 0) {
        return response
    }
    let userdata = response.data as UserData;
    return { response, userdata }
}