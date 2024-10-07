import * as core_api from "./core";

export type UserTokenData = {
    id: string,
    user_id: string,
    created_at: number,
    expires_at: number,
}

export type UserData = {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    last_edited: number,
    created_at: number,
}

export type UserRights = {
    can_post_draft: boolean,
    can_approve_draft: boolean,
    can_publish_article: boolean,
    can_delete_article: boolean,
    can_post_media: boolean,
    can_update_media: boolean,
    can_assign_journalist: boolean,
    can_assign_editorial: boolean,
    can_assign_admin: boolean,
    can_delete_other_user: boolean,
    can_change_other_email: boolean,
    can_change_other_password: boolean,
    can_change_other_details: boolean,
    can_submit_event: boolean,
}

export async function login(email: string, password: string) {
    let login_data = { email, password }
    let response = await core_api.post_json("/user/login", login_data);
    if (response.success == 0) {
        return { response };
    }
    let token = response.data as UserTokenData;
    return { response, token };
}

export async function logout(auth_token: string) {
    let logout_data = { auth_token }
    let response = await core_api.post_json("/user/login", logout_data);
    return { response };
}

export async function register(email: string, password: string, firstname: string, lastname: string) {
    let register_data = { email, password, firstname, lastname }
    let response = await core_api.post_json("user/register", register_data);
    if (response.success == 0) {
        return { response }
    }
    let userdata = response.data as UserData;
    return { response, userdata }
}

export async function edit_rights(new_rights: UserRights, auth_token: string) {
    let request_data = { ...new_rights, auth_token };
    let response = await core_api.post_json("user/edit_user_rights", request_data);
    if (response.success == 0) {
        return { response }
    }
    let userdata = response.data as UserRights;
    return { response, userdata }
}

export async function who(auth_token: string) {
    let token_data = { auth_token }
    let response = await core_api.post_json("/user/who", token_data);
    console.log(response);
    if (response.success == 0) {
        throw new Error(response.message);
    }
    let userdata = response.data as UserData;
    console.log(userdata);
    return { response, userdata };
}

export async function get_rights(user_id: string) {
    let user_data = { user_id }
    let response = await core_api.post_json("/user/rights", user_data);
    if (response.success == 0) {
        return { response }
    }
    let token = response.data as UserTokenData;
    return { response, token };
}

export async function list_users() {
    let response = await core_api.post_json("/user/list_users", {});
    if (response.success == 0) {
        return { response }
    }
    let token = response.data as UserData[];
    return { response, token };
}

export async function show_user(user_id: string) {
    let user_data = { user_id }
    let response = await core_api.post_json("/user/show_user", user_data);
    if (response.success == 0) {
        return { response }
    }
    let token = response.data as UserData;
    return { response, token };
}

export async function edit_user_details(
    auth_token: string,
    password: string,
    new_password: string | null = null,
    firstname: string | null = null,
    lastname: string | null = null,
    new_email: string | null = null,
) {
    let request_data = {
        auth_token,
        password,
        new_password,
        firstname,
        lastname,
        new_email
    };
    let response = await core_api.post_json("/user/edit_user", request_data);
    if (response.success == 0) {
        return { response }
    }
    let token = response.data as UserData;
    return { response, token };
}

export async function delete_user(auth_token: string, password: string) {
    let request_data = { auth_token, password, };
    let response = await core_api.post_json("/user/edit_user", request_data);
    return { response };
}

export async function refresh_token(auth_token: string) {
    let request_data = { auth_token };
    let response = await core_api.post_json("/user/edit_user", request_data);
    if (response.success == 0) {
        return { response }
    }
    let token = response.data as UserTokenData;
    return { response, token };
}

export async function testing_admin_credentials() {
    let response = await core_api.post_json("/user/admin_test_creds", {});
    if (response.success == 0) {
        throw new Error(response.message);
    }
    let admin = response.data as UserTokenData;
    return { response, admin };
}