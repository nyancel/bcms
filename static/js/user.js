const C_STORAGE_USER_METADATA_KEY = "userjs-user-local-metadata";
const C_STORAGE_USER_TOKEN_KEY = "userjs-user-local-token";
const C_USER = {
  meta: undefined,
  token: undefined,
};

const C_USER_DETAILS_LOGIN_TEMPLATE = document.querySelector(
  ".user-details-login-template"
);
const C_USER_DETAILS_PROFILE_TEMPLATE = document.querySelector(
  ".user-details-profile-template"
);
const C_USER_DETAILS_CONTAINER = document.querySelector(
  ".user-details-container"
);

function user_load_local() {
  let meta = localStorage.getItem(C_STORAGE_USER_METADATA_KEY);
  if (meta) {
    C_USER.meta = meta;
  }

  let token = localStorage.getItem(C_STORAGE_USER_TOKEN_KEY);
  if (token) {
    C_USER.token = token;
  }
}

function user_save_local() {
  localStorage.setItem(C_STORAGE_USER_METADATA_KEY, C_USER.meta);
  localStorage.setItem(C_STORAGE_USER_METADATA_KEY, C_USER.token);
}

function user_render_details() {
  if (!C_USER.meta) {
    C_USER_DETAILS_CONTAINER.innerHTML = null;
    C_USER_DETAILS_CONTAINER.appendChild(
      C_USER_DETAILS_LOGIN_TEMPLATE.cloneNode(true).content
    );
    return;
  }
}

function init() {
  user_load_local();
  if (C_USER_DETAILS_CONTAINER) {
    user_render_details();
  }
}

init();
