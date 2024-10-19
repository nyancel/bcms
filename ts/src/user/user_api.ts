
type Response = {
    data: any,
    message: string,
    time: number,
}

export type TokenResponse = {
    id: string,
    user_id: string,
    created_at: number,
    expires_at: number,
}

export type UserResponse = {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    last_edited: number,
    created_at: number,
}

export type RightsResponse = {
    user_id: string,
    can_post_draft: boolean,
    can_approve_draft: boolean,
    can_publish_article: boolean,
    can_delete_article: boolean,
    can_post_media: boolean,
    can_update_media: boolean,
    can_request_media_IDs: boolean,
    can_assign_journalist: boolean,
    can_assign_editorial: boolean,
    can_assign_admin: boolean,
    can_delete_other_user: boolean,
    can_change_other_email: boolean,
    can_change_other_password: boolean,
    can_change_other_details: boolean,
    can_submit_event: boolean,
    can_edit_article: boolean,
}

export type LoginRequest = {
    email: string,
    password: string,
}

export type RegisterRequest = {
    email: string,
    password: string,
    firstname: string,
    lastname: string,
}

export type EditRightsRequest = {
    // meta
    auth_token: string,
    user_id: string,
    // rights
    can_post_draft?: boolean,
    can_approve_draft?: boolean,
    can_read_all_drafts?: boolean,
    can_publish_article?: boolean,
    can_delete_article?: boolean,
    can_post_media?: boolean,
    can_update_media?: boolean,
    can_request_media_IDs?: boolean,
    can_assign_journalist?: boolean,
    can_assign_editorial?: boolean,
    can_assign_admin?: boolean,
    can_delete_other_user?: boolean,
    can_change_other_email?: boolean,
    can_change_other_password?: boolean,
    can_change_other_details?: boolean,
    can_edit_user_rights?: boolean,
    can_submit_event?: boolean,
}

export type EditUserRequest = {
    auth_token: string,
    password: string,
    firstname: string,
    lastname: string,
    new_password: string,
    new_email: string,
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


export async function login(request: LoginRequest) {
    let res = await req("/user/login", request);
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let token = res.body.data as TokenResponse;
    return token;
}

export async function logout(auth_token: string) {
    let res = await req("/user/logout", { auth_token });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    return true;
}

export async function register(request: RegisterRequest) {
    let res = await req("/user/register", request);
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let user = res.body.data as UserResponse;
    return user;
}

export async function edit_user_rights(request: EditRightsRequest) {
    let res = await req("/user/edit_user_rights", request);
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let rights = res.body.data as RightsResponse;
    return rights;
}

export async function who(auth_token: string) {
    let res = await req("/user/who", { auth_token });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let user = res.body.data as UserResponse;
    return user;
}

export async function rights(user_id: string) {
    let res = await req("/user/rights", { user_id });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let rights = res.body.data as RightsResponse;
    return rights;
}

export async function list_users(auth_token: string) {
    let res = await req("/user/list_users", { auth_token });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let users = res.body.data as UserResponse[];
    return users;
}

export async function show_user(user_id: string) {
    let res = await req("/user/show_user", { user_id });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let user = res.body.data as UserResponse;
    return user;
}

export async function edit_user(request: EditUserRequest) {
    let res = await req("/user/edit_user", request);
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let user = res.body.data as UserResponse;
    return user;
}

export async function delete_user(auth_token: string, password: string) {
    let res = await req("/user/delete_user", { auth_token, password });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    return true;
}

export async function refresh_token(auth_token: string) {
    let res = await req("/user/refresh_token", { auth_token });
    if (res.status_code != 200) {
        throw new Error(res.body.message)
    }
    let token = res.body.data as TokenResponse;
    return token;
}
