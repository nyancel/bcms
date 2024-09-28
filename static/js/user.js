// state related constants
const C_USER_STATE = {
  metadata_storage_key: "userjs-user-local-metadata",
  token_storage_key: "userjs-user-local-token",
  meta: undefined,
  token: undefined,
};

// containers and templates for status bar
const C_USER_ELEMENTS = {
  login_template: document.querySelector(".user-details-login-template"),
  profile_template: document.querySelector(".user-details-profile-template"),
  details_container: document.querySelector(".user-details-container"),
};

// user registration form elements
const C_USER_REGISTER_INPUTS = {
  first_name: document.querySelector("#user-register-first-name-input"),
  last_name: document.querySelector("#user-register-last-name-input"),
  email: document.querySelector("#user-register-email-input"),
  password: document.querySelector("#user-register-password-input"),
  repeat_password: document.querySelector(
    "#user-register-password-repeat-input"
  ),
  submit: document.querySelector("#user-register-submitt-button"),
  valid_inputs: false,
};

// user signin form elements
const C_USER_SIGNIN_INPUTS = {
  email: document.querySelector("#user-signin-email-input"),
  password: document.querySelector("#user-signin-password-input"),
  submit: document.querySelector("#user-signin-submitt-button"),
  valid_inputs: false,
};

function user_load_local() {
  let meta = localStorage.getItem(C_USER_STATE.metadata_storage_key);
  if (meta) {
    C_USER_STATE.meta = JSON.parse(meta);
  }

  let token = localStorage.getItem(C_USER_STATE.token_storage_key);
  if (token) {
    C_USER_STATE.token = JSON.parse(token);
  }
}

function user_save_local() {
  localStorage.setItem(
    C_USER_STATE.metadata_storage_key,
    JSON.stringify(C_USER_STATE.meta)
  );
  localStorage.setItem(
    C_USER_STATE.token_storage_key,
    JSON.stringify(C_USER_STATE.token)
  );
}

function user_logout() {
  if (C_USER_STATE.token) {
    // invalidate the current token
    util_fetch_post_json("/user/logout", { user_token: C_USER_STATE.token.id });
  }

  C_USER_STATE.meta = null;
  C_USER_STATE.token = null;
  user_save_local();

  // reload the user state etc.
  user_status_init();
}

function user_render_details() {
  if (!C_USER_STATE.meta) {
    C_USER_ELEMENTS.details_container.innerHTML = null;
    C_USER_ELEMENTS.details_container.appendChild(
      C_USER_ELEMENTS.login_template.cloneNode(true).content
    );
    return;
  }

  console.log(C_USER_STATE);

  C_USER_ELEMENTS.details_container.innerHTML = null;
  let profile = C_USER_ELEMENTS.profile_template.cloneNode(true).content;
  let firstname_element = profile.querySelector("#user-profile-first-name");
  firstname_element.innerHTML = C_USER_STATE.meta.first_name;

  let lastname_element = profile.querySelector("#user-profile-last-name");
  lastname_element.innerHTML = C_USER_STATE.meta.last_name;

  let logout_button = profile.querySelector("#user-profile-logout-button");
  logout_button.onclick = () => {
    user_logout();
  };

  C_USER_ELEMENTS.details_container.appendChild(profile);
  return;
}

function user_enable_register_submit_button(is_valid, reason) {
  if (!is_valid) {
    C_USER_REGISTER_INPUTS.submit.innerHTML = reason;
    C_USER_REGISTER_INPUTS.submit.classList.toggle("bg-green-600", false);
    C_USER_REGISTER_INPUTS.submit.classList.toggle("bg-gray-600", true);
  }
  if (is_valid) {
    C_USER_REGISTER_INPUTS.submit.innerHTML = "Register";
    C_USER_REGISTER_INPUTS.submit.classList.toggle("bg-gray-600", false);
    C_USER_REGISTER_INPUTS.submit.classList.toggle("bg-green-600", true);
  }
}

function user_register_validate_inputs() {
  let valid = true;
  let reason = undefined;
  if (
    C_USER_REGISTER_INPUTS.password.value !=
    C_USER_REGISTER_INPUTS.repeat_password.value
  ) {
    valid = false;
    reason = "passwords dont match";
  }
  if (!C_USER_REGISTER_INPUTS.first_name.value) {
    valid = false;
    reason = "missing first name";
  }
  if (!C_USER_REGISTER_INPUTS.email.value) {
    valid = false;
    reason = "missing email";
  }
  if (!C_USER_REGISTER_INPUTS.last_name.value) {
    valid = false;
    reason = "missing last name";
  }
  if (!C_USER_REGISTER_INPUTS.password.value) {
    valid = false;
    reason = "missing password";
  }

  C_USER_REGISTER_INPUTS.valid_inputs = valid;
  user_enable_register_submit_button(valid, reason);
}

function user_register_submit() {
  if (!C_USER_REGISTER_INPUTS.valid_inputs) {
    return;
  }

  const signin = async () => {
    const register_data = {
      email: C_USER_REGISTER_INPUTS.email.value,
      password: C_USER_REGISTER_INPUTS.password.value,
      firstname: C_USER_REGISTER_INPUTS.first_name.value,
      lastname: C_USER_REGISTER_INPUTS.last_name.value,
    };

    let register_response = await util_fetch_post_json(
      "/user/register_new_user",
      register_data
    );

    if (register_response.error) {
      // TODO Alert user of error
      console.log("Something went wrong");
      console.log(register_response.error);
      return;
    }
    C_USER_STATE.meta = register_response;

    let login_data = {
      email: register_data.email,
      password: register_data.password,
    };

    let login_response = await util_fetch_post_json("/user/login", login_data);
    if (login_response.error) {
      // TODO Alert user of error
      console.log("Something went wrong");
      console.log(login_response.error);
      return;
    }
    C_USER_STATE.token = login_response;
    user_save_local();
    window.location.href = "/";
  };
  signin();
}

function user_function_init() {
  // hook up validation for registration form;
  C_USER_REGISTER_INPUTS.email.oninput = () => {
    user_register_validate_inputs();
  };
  C_USER_REGISTER_INPUTS.first_name.oninput = () => {
    user_register_validate_inputs();
  };
  C_USER_REGISTER_INPUTS.last_name.oninput = () => {
    user_register_validate_inputs();
  };
  C_USER_REGISTER_INPUTS.password.oninput = () => {
    user_register_validate_inputs();
  };
  C_USER_REGISTER_INPUTS.repeat_password.oninput = () => {
    user_register_validate_inputs();
  };
  user_register_validate_inputs();

  C_USER_REGISTER_INPUTS.submit.onclick = () => {
    user_register_submit();
  };
}

function user_status_init() {
  user_load_local();
  if (C_USER_ELEMENTS.details_container) {
    user_render_details();
  }

  // if signing call the other init as well for diff html dom stuff
  if (window.location.pathname === "/signin") {
    user_function_init();
  }
}

user_status_init();
