import { post_json, time } from "./util";

// types
type Token = {
    id: string,
    user_id: string,
    created_at: number,
    expires_at: number,
}

type User = {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    last_edited: number,
    created_at: number,
}

type UserData = {
    token: Token,
    user: User
}

type Inputs = {
    registration: {
        first_name: HTMLInputElement,
        last_name: HTMLInputElement,
        email: HTMLInputElement,
        password: HTMLInputElement,
        repeat_password: HTMLInputElement,
        submit: HTMLButtonElement,
    },
    signin: {
        email: HTMLInputElement,
        password: HTMLInputElement,
        submit: HTMLButtonElement,
    }
}

type Elements = {
    login_template: HTMLTemplateElement,
    profile_template: HTMLTemplateElement,
    details_container: HTMLElement,
}

// global constants
const USER_LOCAL_TOKEN_STORAGE_KEY = "userts-local-user-token";
const USER_LOCAL_DATA_STORAGE_KEY = "userts-local-user-data";

// core functions
export function get_local_user_data() {
    let token_string = localStorage.getItem(USER_LOCAL_TOKEN_STORAGE_KEY);
    let user_string = localStorage.getItem(USER_LOCAL_DATA_STORAGE_KEY)
    if (!token_string || !user_string) {
        return null;
    }

    let token = JSON.parse(token_string);
    let user = JSON.parse(user_string);
    if (!token || !user) {
        return null;
    }

    let userData: UserData = {
        token: token,
        user: user
    }
    return userData;
}

function clear_local_user_data() {
    localStorage.removeItem(USER_LOCAL_DATA_STORAGE_KEY);
    localStorage.removeItem(USER_LOCAL_TOKEN_STORAGE_KEY);
}

function save_user_data_to_local(userdata: UserData) {
    let token = JSON.stringify(userdata.token);
    let data = JSON.stringify(userdata.user);
    localStorage.setItem(USER_LOCAL_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_LOCAL_DATA_STORAGE_KEY, data);
    return true;
}

function get_html_elements() {
    let login_template = document.querySelector(".user-details-login-template") as HTMLTemplateElement | null;
    let profile_template = document.querySelector(".user-details-profile-template") as HTMLTemplateElement | null;
    let details_container = document.querySelector(".user-details-container") as HTMLElement | null;

    if (
        !login_template ||
        !profile_template ||
        !details_container
    ) {
        return null;
    }

    let elements: Elements = {
        login_template: login_template,
        profile_template: profile_template,
        details_container: details_container,
    }
    return elements;
}

function get_input_fields() {
    let registration_first_name = document.querySelector("#user-register-first-name-input") as HTMLInputElement | null;
    let registration_last_name = document.querySelector("#user-register-last-name-input") as HTMLInputElement | null;
    let registration_email = document.querySelector("#user-register-email-input") as HTMLInputElement | null;
    let registration_password = document.querySelector("#user-register-password-input") as HTMLInputElement | null;
    let registration_repeat_password = document.querySelector("#user-register-password-repeat-input") as HTMLInputElement | null;
    let registration_submit = document.querySelector("#user-register-submitt-button") as HTMLButtonElement | null;

    let signin_email = document.querySelector("#user-signin-email-input") as HTMLInputElement | null;
    let signin_password = document.querySelector("#user-signin-password-input") as HTMLInputElement | null;
    let signin_submit = document.querySelector("#user-signin-submitt-button") as HTMLButtonElement | null;

    if (
        !registration_first_name ||
        !registration_last_name ||
        !registration_email ||
        !registration_password ||
        !registration_repeat_password ||
        !registration_submit ||
        !signin_email ||
        !signin_password ||
        !signin_submit
    ) {
        return null;
    }

    let inputs: Inputs = {
        registration: {
            email: registration_email,
            first_name: registration_first_name,
            last_name: registration_last_name,
            password: registration_password,
            repeat_password: registration_repeat_password,
            submit: registration_submit
        },
        signin: {
            email: signin_email,
            password: signin_password,
            submit: signin_submit
        }
    }

    return inputs
}

// api coms functions - stuff that talks to the server
function logout() {
    let userdata = get_local_user_data();
    if (!userdata) {
        throw new Error("No local user-data");
    }

    // tell the server to clear the token, the clear local data;
    post_json("/user/logout", { user_token: userdata.token.id });
    clear_local_user_data();

    // reload the user state etc.
    main();
}

function render_user() {
    let elements = get_html_elements();
    if (!elements) {
        throw new Error("could not load html elements");
    }

    elements.details_container.innerHTML = "";

    let userdata = get_local_user_data();
    if (!userdata) {
        let clone = elements.login_template.cloneNode(true) as HTMLTemplateElement;
        elements.details_container.appendChild(clone.content);
        return;
    }

    let clone = elements.profile_template.cloneNode(true) as HTMLTemplateElement;
    let profile_template = clone.content;
    let firstname_element = profile_template.querySelector("#user-profile-first-name") as HTMLElement | null;
    if (!firstname_element) {
        throw new Error("fistname_element not found");
    }
    firstname_element.innerHTML = userdata.user.first_name;

    let lastname_element = profile_template.querySelector("#user-profile-last-name") as HTMLElement | null;
    if (!lastname_element) {
        throw new Error("lastname_element not found");
    }
    lastname_element.innerHTML = userdata.user.last_name;

    let logout_button = profile_template.querySelector("#user-profile-logout-button") as HTMLElement | null;
    if (!logout_button) {
        throw new Error("logout_button not found");
    }
    logout_button.onclick = () => {
        logout();
    };

    elements.details_container.appendChild(profile_template);
    return;
}

function enable_register_submit_button(is_valid: boolean, reason: string | undefined) {
    let inputs = get_input_fields();
    if (!inputs) {
        throw new Error("input fields not initialized");
    }

    if (!is_valid) {
        inputs.registration.submit.innerHTML = reason ?? "invalid registration-data";
        inputs.registration.submit.classList.toggle("bg-green-600", false);
        inputs.registration.submit.classList.toggle("bg-gray-600", true);
        return;
    }

    inputs.registration.submit.innerHTML = "Register";
    inputs.registration.submit.classList.toggle("bg-gray-600", false);
    inputs.registration.submit.classList.toggle("bg-green-600", true);
}

function validate_registration_inputs(inputs: Inputs) {
    let valid: boolean = true;
    let reason: string = "";

    if (inputs.registration.password.value != inputs.registration.repeat_password.value) {
        valid = false;
        reason = "passwords dont match";
    }

    if (!inputs.registration.first_name.value) {
        valid = false;
        reason = "missing first name";
    }

    if (!inputs.registration.email.value) {
        valid = false;
        reason = "missing email";
    }

    if (!inputs.registration.last_name.value) {
        valid = false;
        reason = "missing last name";
    }

    if (!inputs.registration.password.value) {
        valid = false;
        reason = "missing password";
    }

    return {
        valid,
        reason
    };
}

function submit_registration(inputs: Inputs) {
    if (!validate_registration_inputs(inputs).valid) {
        throw new Error("inputs are not valid");
    }

    const register_and_signin = async () => {
        let inputs = get_input_fields();
        if (!inputs) {
            throw new Error("input fields not initialized");
        }
        if (!validate_registration_inputs(inputs).valid) {
            throw new Error("inputs are not valid");
        }
        const register_data = {
            email: inputs.registration.email.value,
            password: inputs.registration.password.value,
            firstname: inputs.registration.first_name.value,
            lastname: inputs.registration.last_name.value,
        };

        let register_response = await post_json("/user/register_new_user", register_data)
        if (register_response.error) {
            throw new Error(register_response.error);
        }

        let login_data = {
            email: register_data.email,
            password: register_data.password,
        };

        let login_response = await post_json("/user/login", login_data);
        if (login_response.error) {
            throw new Error(login_response.error);
        }

        let token = login_response;
        let user = register_response;

        let user_data: UserData = {
            user,
            token
        }
        save_user_data_to_local(user_data);
        window.location.href = "/";
    };
    register_and_signin();
}

function validate_registration_form(inputs: Inputs) {
    let { valid, reason } = validate_registration_inputs(inputs);
    enable_register_submit_button(valid, reason);
}

function registration_init() {
    let inputs = get_input_fields();
    if (!inputs) {
        throw new Error("inputs not initialized");
    }
    // hook up validation for registration form;
    inputs.registration.email.oninput = () => validate_registration_form(inputs);
    inputs.registration.first_name.oninput = () => validate_registration_form(inputs);
    inputs.registration.last_name.oninput = () => validate_registration_form(inputs);
    inputs.registration.password.oninput = () => validate_registration_form(inputs);
    inputs.registration.repeat_password.oninput = () => validate_registration_form(inputs);
    inputs.registration.submit.onclick = () => submit_registration(inputs);
    validate_registration_form(inputs);
}

async function user_revalidate_token() {
    let user_data = get_local_user_data();
    if (!user_data) {
        return null;
    }

    if (time() > user_data.token.expires_at) {
        // token expired, re-render after clearing local data
        clear_local_user_data();
        main();
        return;
    }

    // refresh if less then 10 minutes left of the token
    if ((time() + 600) > user_data.token.expires_at) {
        let new_token_response = await post_json("/user/refresh_token", {
            user_token: user_data.token.id,
        });
        if (new_token_response.error) {
            throw new Error(new_token_response.error)
        }
        user_data.token = new_token_response;
        save_user_data_to_local(user_data);
    }

    // validate the current user token
    let validation_response = await post_json("/user/who", {
        user_token: user_data.token.id
    });

    if (validation_response.error) {
        if (validation_response.error === "token invalid") {
            // token invalid, re-render after clearing local data
            clear_local_user_data();
            main();
            return;
        }
        else {
            throw new Error(validation_response.error)
        }
    }

    user_data.user = validation_response;
    save_user_data_to_local(user_data);
}

export default function main() {
    user_revalidate_token();
    render_user();

    // if signing call the other init as well for diff html dom stuff
    if (window.location.pathname === "/signin") {
        registration_init();
    }
}
