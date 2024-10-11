import * as user_local from "./user_local";
import * as user_api from "./user_api";

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

function get_profile_elements(profile_template_clone: DocumentFragment) {
    let firstname_element = profile_template_clone.querySelector("#user-profile-first-name") as HTMLElement | null;
    let lastname_element = profile_template_clone.querySelector("#user-profile-last-name") as HTMLElement | null;
    let logout_button = profile_template_clone.querySelector("#user-profile-logout-button") as HTMLElement | null;

    if (!firstname_element || !lastname_element || !logout_button) {
        throw new Error("lastname_element not found");
    }

    return { firstname_element, lastname_element, logout_button };
}

// api coms functions - stuff that talks to the server
function logout() {
    let userdata = user_local.get_local_user_data();
    if (!userdata) {
        throw new Error("No local user-data");
    }

    user_api.logout(userdata.token.id);
    user_local.clear_local_user_data();

    // reload the user state etc.
    init();
}
// }

function render_user(userdata: user_local.UserStorageData, elements: UserHtmlElements) {

    elements.details_container.innerHTML = "";


    let clone = elements.profile_template.cloneNode(true) as HTMLTemplateElement;
    let profile_template = clone.content;
    let profile_elements = get_profile_elements(profile_template);


    profile_elements.firstname_element.innerHTML = userdata.user.firstname;
    profile_elements.lastname_element.innerHTML = userdata.user.lastname;
    profile_elements.logout_button.onclick = () => logout();

    elements.details_container.appendChild(profile_template);
    return;
}

function render_login(elements: UserHtmlElements) {
    let clone = elements.login_template.cloneNode(true) as HTMLTemplateElement;
    elements.details_container.innerHTML = "";
    elements.details_container.appendChild(clone.content);
}

export async function init() {

    let userdata = user_local.get_local_user_data();
    let html_elements = get_html_elements();
    if (!html_elements) {
        throw new Error("html elements not loaded");
    }

    if (!userdata) {
        render_login(html_elements);
        return;
    }

    render_user(userdata, html_elements);
    return;
}