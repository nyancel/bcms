
import * as util from "../util";
import * as user_api from "../bcms/user";

export type UserStorageData = {
    user: user_api.UserData,
    token: user_api.UserTokenData,
}

const USER_TOKEN_KEY: string = "BCMS_USERTS_LOCALTOKEN";
const USER_DATA_KEY: string = "BCMS_USERTS_LOCALUSER";

// core functions
export function get_local_user_data() {
    let token_string = localStorage.getItem(USER_TOKEN_KEY);
    let user_string = localStorage.getItem(USER_DATA_KEY)
    if (!token_string || !user_string) {
        return null;
    }

    let token = JSON.parse(token_string);
    let user = JSON.parse(user_string);
    if (!token || !user) {
        return null;
    }

    let userData: UserStorageData = {
        token: token,
        user: user
    }

    return userData;
}

export function clear_local_user_data() {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(USER_TOKEN_KEY);
    return true;
}

export function save_user_data_to_local(userdata: UserStorageData) {
    let token = JSON.stringify(userdata.token);
    let data = JSON.stringify(userdata.user);
    localStorage.setItem(USER_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, data);
    return true;
}

export async function revalidate_token() {
    let user_data = get_local_user_data();
    if (!user_data) {
        return null;
    }

    // check if current token is expired
    if (util.time() > user_data.token.expires_at) {
        clear_local_user_data();
        return null;
    }

    // refresh if less then 10 minutes left of the token
    if ((util.time() + 600) > user_data.token.expires_at) {
        let token = await user_api.refresh_token(user_data.token.id);
        if (!token.token) {
            throw new Error(token.response.message);
        }

        user_data.token = token.token;
        save_user_data_to_local(user_data);
    }

    // validate the current user token
    let user = await user_api.who(user_data.token.id);
    if (!user.userdata) {
        throw new Error(user.response.message);
    }

    if (user.userdata.id != user_data.token.user_id) {
        clear_local_user_data();
        throw new Error("aquired invalid token");
    }

    user_data.user = user.userdata;
    save_user_data_to_local(user_data);
    return user_data.token;
}

export async function get_admin_credenitals() {
    let admin_creds = await user_api.testing_admin_credentials();
    console.log(admin_creds);
    if (!admin_creds.admin) {
        throw new Error(admin_creds.response.message);
    }

    let admin_data = await user_api.who(admin_creds.admin.id);
    console.log(admin_data);
    if (!admin_data.userdata) {
        throw new Error(admin_data.response.message);
    }

    let user_data: UserStorageData = {
        token: admin_creds.admin,
        user: admin_data.userdata,
    }

    save_user_data_to_local(user_data);
    return user_data;
}
