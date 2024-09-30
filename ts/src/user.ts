import main from "./editor";
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
    storage_key: string,
    token: Token | undefined,
    user: User | undefined
}

type Inputs = {
    registration: {
        first_name: HTMLInputElement | null,
        last_name: HTMLInputElement | null,
        email: HTMLInputElement | null,
        password: HTMLInputElement | null,
        repeat_password: HTMLInputElement | null,
        submit: HTMLButtonElement | null,
        valid_inputs: boolean,
    },
    signin: {
        email: HTMLInputElement | null,
        password: HTMLInputElement | null,
        submit: HTMLButtonElement | null,
        valid_inputs: boolean,
    }
}

type Elements = {
    login_template: HTMLTemplateElement | null,
    profile_template: HTMLTemplateElement | null,
    details_container: HTMLElement | null,
}

// global constants
const USER: UserData = {
    storage_key: "userjs-user-local-metadata",
    user: undefined,
    token: undefined,
};

const ELEMENTS: Elements = {
    login_template: document.querySelector(".user-details-login-template") as HTMLTemplateElement | null,
    profile_template: document.querySelector(".user-details-profile-template") as HTMLTemplateElement | null,
    details_container: document.querySelector(".user-details-container") as HTMLElement | null,
};

const INPUTS: Inputs = {
    registration: {
        first_name: document.querySelector("#user-register-first-name-input"),
        last_name: document.querySelector("#user-register-last-name-input"),
        email: document.querySelector("#user-register-email-input"),
        password: document.querySelector("#user-register-password-input"),
        repeat_password: document.querySelector("#user-register-password-repeat-input"),
        submit: document.querySelector("#user-register-submitt-button"),
        valid_inputs: false,
    },
    signin: {
        email: document.querySelector("#user-signin-email-input"),
        password: document.querySelector("#user-signin-password-input"),
        submit: document.querySelector("#user-signin-submitt-button"),
        valid_inputs: false,
    }
};

// core functions
function user_load_local() {
    let local = localStorage.getItem(USER.storage_key);
    if (!local) {
        USER.token = undefined;
        USER.user = undefined;
        return;
    }

    let tmp: UserData = JSON.parse(local);
    if (!tmp) {
        USER.token = undefined;
        USER.user = undefined;
        return;
    }

    USER.user = tmp.user;
    USER.token = tmp.token;
}

function user_save_local() {
    localStorage.setItem(
        USER.storage_key,
        JSON.stringify(USER)
    );
}

function logout() {
    if (USER.token) {
        // invalidate the current token
        post_json("/user/logout", { user_token: USER.token.id });
    }

    USER.user = undefined;
    USER.token = undefined;
    user_save_local();

    // reload the user state etc.
    main();
}

function user_render_details() {
    if (!ELEMENTS.details_container) {
        throw new Error("details container not initialized")
    }

    if (!ELEMENTS.login_template) {
        throw new Error("logintemplate not initialized")
    }

    if (!ELEMENTS.profile_template) {
        throw new Error("profile template not initialized")
    }

    if (!USER.user) {
        ELEMENTS.details_container.innerHTML = "";
        let clone = ELEMENTS.login_template.cloneNode(true) as HTMLTemplateElement;
        ELEMENTS.details_container.appendChild(clone.content);
        return;
    }

    ELEMENTS.details_container.innerHTML = "";

    let clone = ELEMENTS.profile_template.cloneNode(true) as HTMLTemplateElement;
    let profile = clone.content;
    let firstname_element = profile.querySelector("#user-profile-first-name") as HTMLElement | null;
    if (!firstname_element) {
        throw new Error("fistname_element not found");
    }
    firstname_element.innerHTML = USER.user.first_name;

    let lastname_element = profile.querySelector("#user-profile-last-name") as HTMLElement | null;
    if (!lastname_element) {
        throw new Error("lastname_element not found");
    }
    lastname_element.innerHTML = USER.user.last_name;

    let logout_button = profile.querySelector("#user-profile-logout-button") as HTMLElement | null;
    if (!logout_button) {
        throw new Error("logout_button not found");
    }
    logout_button.onclick = () => {
        logout();
    };

    ELEMENTS.details_container.appendChild(profile);
    return;
}

function enable_register_submit_button(is_valid: boolean, reason: string | undefined) {
    if (!INPUTS.registration.submit) {
        throw new Error("registration-submit button not found");
    }
    if (!is_valid) {
        INPUTS.registration.submit.innerHTML = reason ?? "invalid registration_data";
        INPUTS.registration.submit.classList.toggle("bg-green-600", false);
        INPUTS.registration.submit.classList.toggle("bg-gray-600", true);
    }
    if (is_valid) {
        INPUTS.registration.submit.innerHTML = "Register";
        INPUTS.registration.submit.classList.toggle("bg-gray-600", false);
        INPUTS.registration.submit.classList.toggle("bg-green-600", true);
    }
}

function validate_registration_inputs() {
    if (!INPUTS.registration.password) {
        throw new Error("registration password field not found");
    }
    if (!INPUTS.registration.repeat_password) {
        throw new Error("repeat_passowrd registration field not found");
    }
    if (!INPUTS.registration.email) {
        throw new Error("email registration field not found");
    }
    if (!INPUTS.registration.first_name) {
        throw new Error("first_name registration field not found");
    }
    if (!INPUTS.registration.last_name) {
        throw new Error("last_name registration field not found");
    }

    let valid: boolean = true;
    let reason: string | undefined = undefined;
    if (
        INPUTS.registration.password.value !=
        INPUTS.registration.repeat_password.value
    ) {
        valid = false;
        reason = "passwords dont match";
    }
    if (!INPUTS.registration.first_name.value) {
        valid = false;
        reason = "missing first name";
    }
    if (!INPUTS.registration.email.value) {
        valid = false;
        reason = "missing email";
    }
    if (!INPUTS.registration.last_name.value) {
        valid = false;
        reason = "missing last name";
    }
    if (!INPUTS.registration.password.value) {
        valid = false;
        reason = "missing password";
    }

    INPUTS.registration.valid_inputs = valid;
    enable_register_submit_button(valid, reason);
}

function user_register_submit() {
    if (!INPUTS.registration.valid_inputs) {
        return;
    }

    const signin = async () => {
        if (!INPUTS.registration.email) {
            throw new Error("email value not supplied");
        }
        if (!INPUTS.registration.password) {
            throw new Error("password value not supplied");
        }
        if (!INPUTS.registration.first_name) {
            throw new Error("first name value not supplied");
        }
        if (!INPUTS.registration.last_name) {
            throw new Error("last name value not supplied");
        }

        const register_data = {
            email: INPUTS.registration.email.value,
            password: INPUTS.registration.password.value,
            firstname: INPUTS.registration.first_name.value,
            lastname: INPUTS.registration.last_name.value,
        };

        let register_response = await post_json(
            "/user/register_new_user",
            register_data
        )

        if (register_response.error) {
            throw new Error(register_response.error);
        }
        USER.user = register_response;

        let login_data = {
            email: register_data.email,
            password: register_data.password,
        };

        let login_response = await post_json("/user/login", login_data);
        if (login_response.error) {
            throw new Error(login_response.error);
        }
        USER.token = login_response;
        user_save_local();
        window.location.href = "/";
    };
    signin();
}

function registration_init() {
    if (!INPUTS.registration.email) {
        throw new Error("email input for registration not initalized")
    }

    if (!INPUTS.registration.first_name) {
        throw new Error("first_name input for registration not initalized")
    }

    if (!INPUTS.registration.last_name) {
        throw new Error("last_name input for registration not initalized")
    }

    if (!INPUTS.registration.password) {
        throw new Error("password input for registration not initalized")
    }

    if (!INPUTS.registration.repeat_password) {
        throw new Error("repeate_password input for registration not initalized")
    }

    if (!INPUTS.registration.submit) {
        throw new Error("submit input for registration not initalized")
    }

    // hook up validation for registration form;
    INPUTS.registration.email.oninput = () => {
        validate_registration_inputs();
    };
    INPUTS.registration.first_name.oninput = () => {
        validate_registration_inputs();
    };
    INPUTS.registration.last_name.oninput = () => {
        validate_registration_inputs();
    };
    INPUTS.registration.password.oninput = () => {
        validate_registration_inputs();
    };
    INPUTS.registration.repeat_password.oninput = () => {
        validate_registration_inputs();
    };
    validate_registration_inputs();

    INPUTS.registration.submit.onclick = () => {
        user_register_submit();
    };
}

function user_function_init() {
    registration_init();
}

async function user_revalidate_token() {
    if (!USER.token) {
        return;
    }

    if (time() > USER.token.expires_at) {
        USER.token = undefined;
        USER.user = undefined;
        user_save_local();
        return;
    }

    // refresh if less then 10 minutes left of the token
    if (time() + 600 > USER.token.expires_at) {
        let new_token_response = await post_json("/user/refresh_token", {
            user_token: USER.token.id,
        });
        if (new_token_response.error) {
            throw new Error(new_token_response.error)
        }
        USER.token = new_token_response;
    }

    if (!USER.token) {
        throw new Error("user token not found, i dont know how but you fucked up");
    }

    // validate the current user token
    let validation_response = await post_json("/user/who", {
        user_token: USER.token.id
    });

    if (validation_response.error) {
        if (validation_response.error === "token invalid") {
            USER.user = undefined;
            USER.token = undefined;
            user_save_local();
            main();
            return;
        }
        else {
            throw new Error(validation_response.error)
        }
    }

    USER.token = validation_response as Token;
    // revalidate on expiration
    let timeout = USER.token.expires_at - time(); // at expiration
    timeout = timeout - 60; // 1 minute before expiration
    timeout = timeout * 1000; // to milliseconds
    window.setTimeout(() => {
        user_revalidate_token();
    }, timeout);
    user_save_local();
}

export default function user_main() {
    user_revalidate_token();

    if (ELEMENTS.details_container) {
        user_render_details();
    }

    // if signing call the other init as well for diff html dom stuff
    if (window.location.pathname === "/signin") {
        user_function_init();
    }
}

export function get_current_user_token_id() {
    user_load_local();
    if (!USER) {
        return undefined;
    }
    if (!USER.token) {
        return undefined;
    }
    if (!USER.token.id) {
        return undefined;
    }
    return USER.token.id;
}
