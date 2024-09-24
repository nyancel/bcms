const C_EDITOR_ARTICLE = [];

// default objects and const reffs
const C_EDITOR_BASE_PARAGRAPH = {
  type: "paragraph",
  text: "",
  index: 0,
};

const C_EDITOR_BASE_HEADING = {
  type: "heading",
  text: "",
  index: 0,
};

const C_EDITOR_BASE_IMAGE = {
  type: "image",
  alt_text: "",
  index: 0,
  src: undefined,
};

const C_EDITOR_PARAGRAPH_TEMPLATE = document.getElementById(
  "article-paragraph-template"
);
const C_EDITOR_IMAGE_TEMPLATE = document.getElementById(
  "article-image-template"
);
const C_EDITOR_HEADING_TEMPLATE = document.getElementById(
  "article-heading-template"
);

const C_EDITOR_CONTAINER = document.getElementById("editor-container");

// editor image functions
function editor_gallery_pop_up_select(index) {}
function editor_gallery_pop_up_recieve(index, id) {}

// editor insertion functions
function editor_insert_paragraph() {
  // append the paragraph template to the DOM
  let entry = document.createElement("li");
  let item = C_EDITOR_PARAGRAPH_TEMPLATE.cloneNode(true).content;
  entry.appendChild(item);
  C_EDITOR_CONTAINER.appendChild(entry);

  return entry;
}

function editor_connect_paragraph_change(entry, index) {
  let textarea = entry.querySelector(".paragraph-input");
  textarea.value = C_EDITOR_ARTICLE[index].text;
  textarea.onchange = () => {
    C_EDITOR_ARTICLE[index].text = textarea.value;
  };
}

function editor_insert_image() {
  // append the image template to the DOM
  let entry = document.createElement("li");
  let item = C_EDITOR_IMAGE_TEMPLATE.cloneNode(true).content;
  entry.appendChild(item);
  C_EDITOR_CONTAINER.appendChild(entry);

  return entry;
}

function editor_connect_image_alt_text_change(entry, index) {
  // connect the alt-text and its relevant update
  let alt_text = entry.querySelector(".image-alt-text-input");
  if (C_EDITOR_ARTICLE[index].alt_text) {
    alt_text.value = C_EDITOR_ARTICLE[index].alt_text;
  }
  alt_text.onchange = () => {
    C_EDITOR_ARTICLE[index].alt_text = alt_text.value;
  };
}

// generic editor navigation functions
function editor_connect_delete(entry, index) {
  let delete_button = entry.querySelector(".delete-button");
  delete_button.onclick = () => {
    editor_remove_item(index);
    editor_generate_preview();
  };
}

function editor_connect_move_up(entry, index) {
  let move_up_button = entry.querySelector(".move-up-button");
  move_up_button.onclick = () => {
    editor_move_item_up(index);
    editor_generate_preview();
  };
}

function editor_connect_move_down(entry, index) {
  let move_down_button = entry.querySelector(".move-down-button");
  move_down_button.onclick = () => {
    editor_move_item_down(index);
    editor_generate_preview();
  };
}

// view functions
function editor_generate_preview() {
  C_EDITOR_CONTAINER.innerHTML = null;
  let entry;

  for (let index = 0; index < C_EDITOR_ARTICLE.length; index++) {
    switch (C_EDITOR_ARTICLE[index].type) {
      case "paragraph":
        entry = editor_insert_paragraph();
        editor_connect_paragraph_change(entry, index);
        break;

      case "image":
        entry = editor_insert_image();

        // if src is undefined we have not yet chosen an image.
        if (!C_EDITOR_ARTICLE[index].src) {
          let display = entry.querySelector(".image-display");
          display.classList.toggle("hidden", true);
        }
        // else src is defined and we render the image
        else if (C_EDITOR_ARTICLE[index].src) {
          display.classList.toggle("hidden", false);
        }

        editor_connect_image_alt_text_change(entry, index);
        break;

      case "heading":
        break;

      // skip to next item if we dont have a template for the type
      default:
        console.log("skipping, unkown type");
        console.log(C_EDITOR_ARTICLE[index]);
        continue;
    }

    editor_connect_delete(entry, index);
    editor_connect_move_down(entry, index);
    editor_connect_move_up(entry, index);
  }
}

// article functions
function editor_add_item(item) {
  let length = C_EDITOR_ARTICLE.length;
  item.index = length;
  C_EDITOR_ARTICLE.push(item);
  editor_generate_preview();
}

function editor_remove_item(index) {
  C_EDITOR_ARTICLE.splice(index, 1);
}

function editor_move_item_down(index) {
  let item = C_EDITOR_ARTICLE[index];
  C_EDITOR_ARTICLE[index] = C_EDITOR_ARTICLE[index + 1];
  C_EDITOR_ARTICLE[index + 1] = item;
  // assign new indexes
  C_EDITOR_ARTICLE[index].index = index;
  C_EDITOR_ARTICLE[index + 1].index = index + 1;
}

function editor_move_item_up(index) {
  let item = C_EDITOR_ARTICLE[index];
  C_EDITOR_ARTICLE[index] = C_EDITOR_ARTICLE[index - 1];
  C_EDITOR_ARTICLE[index - 1] = item;
  // assign new indexes
  C_EDITOR_ARTICLE[index].index = index;
  C_EDITOR_ARTICLE[index - 1].index = index - 1;
}

function editor_add_paragraph() {
  let p = { ...C_EDITOR_BASE_PARAGRAPH }; // clone the base paragraph;
  editor_add_item(p);
}

function editor_add_image() {
  let i = { ...C_EDITOR_BASE_IMAGE }; // clone the base paragraph;
  editor_add_item(i);
}

function editor_add_heading() {
  let h = { ...C_EDITOR_BASE_HEADING }; // clone the base paragraph;
  editor_add_item(h);
}

function editor_log_article() {
  console.log(C_EDITOR_ARTICLE);
}

// startup
function editor_init() {
  let log_button = document.getElementById("log-article");
  log_button.onclick = editor_log_article;

  let add_paragraph_button = document.getElementById("add-paragraph");
  add_paragraph_button.onclick = editor_add_paragraph;

  let add_image_button = document.getElementById("add-image");
  add_image_button.onclick = editor_add_image;

  let add_heading_button = document.getElementById("add-heading");
  add_heading_button.onclick = editor_add_heading;
}

editor_init();

// temp for testing
editor_add_image();
