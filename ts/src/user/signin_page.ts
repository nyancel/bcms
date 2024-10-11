import * as user_local from "./user_local";
import * as user_api from "./user_api";


type SigninHtmlInputs = {
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

    let inputs: SigninHtmlInputs = {
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


function enable_register_submit_button(is_valid: boolean, reason: string | undefined, inputs: SigninHtmlInputs) {
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

function is_valid_inputs(inputs: SigninHtmlInputs) {
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

function submit_registration(inputs: SigninHtmlInputs) {
    let { valid, reason } = is_valid_inputs(inputs);
    if (!valid) {
        alert(`could not submit registration beacuse ${reason}`);
        return;
    }

    const register_and_signin = async () => {
        let registration_request: user_api.RegisterRequest = {
            email: inputs.registration.email.value,
            password: inputs.registration.password.value,
            firstname: inputs.registration.first_name.value,
            lastname: inputs.registration.last_name.value,
        }

        // bro i hate this shit wtf
        let registration_response;
        try {
            registration_response = await user_api.register(registration_request);
        }
        catch (err) {
            alert(err);
            return;
        }

        let login_request: user_api.LoginRequest = {
            email: registration_request.email,
            password: registration_request.password
        }

        // again, i really really hate this
        let login_response;
        try {
            login_response = await user_api.login(login_request);
        }
        catch (err) {
            alert(err);
            return;
        }


        let userdata: user_local.UserStorageData = {
            token: login_response,
            user: registration_response,
        }

        user_local.save_user_data_to_local(userdata);
        window.location.href = "/"; // redirect user to home
    };

    register_and_signin();

}

function on_input_change(inputs: SigninHtmlInputs) {
    let { valid, reason } = is_valid_inputs(inputs);
    enable_register_submit_button(valid, reason, inputs);
}

export function init() {
    let inputs = get_input_fields();
    if (!inputs) {
        throw new Error("inputs not initialized");
    }

    // hook up validation for registration form;
    inputs.registration.email.oninput = () => on_input_change(inputs);
    inputs.registration.first_name.oninput = () => on_input_change(inputs);
    inputs.registration.last_name.oninput = () => on_input_change(inputs);
    inputs.registration.password.oninput = () => on_input_change(inputs);
    inputs.registration.repeat_password.oninput = () => on_input_change(inputs);

    // hook up submit
    inputs.registration.submit.onclick = () => submit_registration(inputs);

    // initial call just to set defaults
    on_input_change(inputs);
}
