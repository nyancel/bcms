import * as user_api from "./user_api";

export type UserStorageData = {
    user: user_api.UserResponse,
    token: user_api.TokenResponse
}

const USER_TOKEN_KEY: string = "BCMS_USERTS_LOCALTOKEN";
const USER_DATA_KEY: string = "BCMS_USERTS_LOCALUSER";

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
