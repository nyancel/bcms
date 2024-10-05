import * as core from "./user_core";
import * as api from "./webapi";

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

    let inputs: UserSigninHtmlInputs = {
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

function validate_registration_inputs(inputs: UserSigninHtmlInputs) {
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

function submit_registration(inputs: UserSigninHtmlInputs) {
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

        let registration_response = await api.register(
            inputs.registration.email.value,
            inputs.registration.password.value,
            inputs.registration.first_name.value,
            inputs.registration.last_name.value
        )
        if (!registration_response.userdata) {
            throw new Error(registration_response.response.message);
        }

        let login_response = await api.login(
            inputs.registration.email.value,
            inputs.registration.password.value
        );
        if (!login_response.token) {
            throw new Error(login_response.response.message);
        }

        let userdata: core.UserStorageData = {
            token: login_response.token,
            user: registration_response.userdata,
        }

        core.save_user_data_to_local(userdata);
        window.location.href = "/";
    };
    register_and_signin();
}

function validate_registration_form(inputs: UserSigninHtmlInputs) {
    let { valid, reason } = validate_registration_inputs(inputs);
    enable_register_submit_button(valid, reason);
}

export function user_page_main() {
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
    // hook up submit
    inputs.registration.submit.onclick = () => submit_registration(inputs);

    // initial oowoo
    validate_registration_form(inputs);
}
