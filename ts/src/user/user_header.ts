import * as user_core from "./user_core";
import * as user_api from "../bcms/user";



type UserHtmlElements = {
    login_template: HTMLTemplateElement,
    profile_template: HTMLTemplateElement,
    details_container: HTMLElement,
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

    let elements: UserHtmlElements = {
        login_template: login_template,
        profile_template: profile_template,
        details_container: details_container,
    }
    return elements;
}

// api coms functions - stuff that talks to the server
function logout() {
    let userdata = user_core.get_local_user_data();
    if (!userdata) {
        throw new Error("No local user-data");
    }

    user_api.logout(userdata.token.id);
    user_core.clear_local_user_data();

    // reload the user state etc.
    user_header_main();
}

function render_user() {
    let elements = get_html_elements();
    if (!elements) {
        throw new Error("could not load html elements");
    }

    elements.details_container.innerHTML = "";
    let userdata = user_core.get_local_user_data();
    if (!userdata) {
        let clone = elements.login_template.cloneNode(true) as HTMLTemplateElement;
        elements.details_container.appendChild(clone.content);
        return;
    }

    // VVV if we have some local userdata VVV
    let clone = elements.profile_template.cloneNode(true) as HTMLTemplateElement;
    let profile_template = clone.content;
    let firstname_element = profile_template.querySelector("#user-profile-first-name") as HTMLElement | null;
    if (!firstname_element) {
        throw new Error("fistname_element not found");
    }
    firstname_element.innerHTML = userdata.user.firstname;

    let lastname_element = profile_template.querySelector("#user-profile-last-name") as HTMLElement | null;
    if (!lastname_element) {
        throw new Error("lastname_element not found");
    }
    lastname_element.innerHTML = userdata.user.lastname;

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

export async function user_header_main() {
    // just for local testing
    await user_core.get_admin_credenitals();

    // user_revalidate_token();
    render_user();
}