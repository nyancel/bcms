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
  image_id: undefined,
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
function editor_gallery_pop_up_select(index) {
  const popup = window.open(
    "/gallery-popup",
    "popupWindow",
    "width=600,height=400"
  );

  window.receive_data = function (data) {
    C_EDITOR_ARTICLE[index].image_id = data.image_id;
    editor_generate_preview();
  };
}

function editor_image_upload(index) {
  // select a file
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "png, jpg, jpeg";
  input.multiple = false;
  input.onchange = async () => {
    // retrieve the selected file
    let files = Array.from(input.files);
    let file = files[0];
    input.remove();

    // upload the file to the gallery
    let formdata = new FormData();
    formdata.append("media", file);
    let image = await util_fetch_post_formdata("/media/upload_media", formdata);
    let image_id = image.data.results[0].key;
    C_EDITOR_ARTICLE[index].image_id = image_id;
    editor_generate_preview();
  };
  input.click();
}

function editor_image_render(entry, index) {
  // if image_id is undefined we have not yet chosen an image.
  let display = entry.querySelector(".image-display");
  if (!C_EDITOR_ARTICLE[index].image_id) {
    display.classList.toggle("hidden", true);
    return;
  }
  // else image_id is defined and we render the image
  const load = async () => {
    display.src = await util_get_media_src_by_width(
      C_EDITOR_ARTICLE[index].image_id,
      entry.clientWidth
    );
    display.classList.toggle("hidden", false);
  };
  load();
}

// editor insertion functions
function editor_insert_paragraph() {
  // append the paragraph template to the DOM
  let entry = document.createElement("li");
  let item = C_EDITOR_PARAGRAPH_TEMPLATE.cloneNode(true).content;
  entry.appendChild(item);
  C_EDITOR_CONTAINER.appendChild(entry);

  return entry;
}

function editor_insert_image() {
  // append the image template to the DOM
  let entry = document.createElement("li");
  let item = C_EDITOR_IMAGE_TEMPLATE.cloneNode(true).content;
  entry.appendChild(item);
  C_EDITOR_CONTAINER.appendChild(entry);

  return entry;
}

function editor_connect_paragraph(entry, index) {
  let textarea = entry.querySelector(".paragraph-input");
  textarea.value = C_EDITOR_ARTICLE[index].text;
  textarea.onchange = () => {
    C_EDITOR_ARTICLE[index].text = textarea.value;
  };
}

function editor_image_connect(entry, index) {
  // connect the alt-text and its relevant update
  let alt_text = entry.querySelector(".image-alt-text-input");
  if (C_EDITOR_ARTICLE[index].alt_text) {
    alt_text.value = C_EDITOR_ARTICLE[index].alt_text;
  }
  alt_text.onchange = () => {
    C_EDITOR_ARTICLE[index].alt_text = alt_text.value;
  };

  // connect the upload buttons
  let image_select_button = entry.querySelector(".image-gallery-select");
  let image_upload_button = entry.querySelector(".image-gallery-upload");

  image_upload_button.onclick = () => editor_image_upload(index);
  image_select_button.onclick = () => editor_gallery_pop_up_select(index);
}

function editor_connect_generic(entry, index) {
  // generic delete
  let delete_button = entry.querySelector(".delete-button");
  delete_button.onclick = () => {
    editor_remove_item(index);
    editor_generate_preview();
  };

  // generic move up
  let move_up_button = entry.querySelector(".move-up-button");
  move_up_button.onclick = () => {
    editor_move_item_up(index);
    editor_generate_preview();
  };

  // generic move down
  let move_down_button = entry.querySelector(".move-down-button");
  move_down_button.onclick = () => {
    editor_move_item_down(index);
    editor_generate_preview();
  };
}

// view functions
function editor_generate_preview() {
  let y_pos = window.scrollY;

  C_EDITOR_CONTAINER.innerHTML = null;
  let entry;

  for (let index = 0; index < C_EDITOR_ARTICLE.length; index++) {
    switch (C_EDITOR_ARTICLE[index].type) {
      case "paragraph":
        entry = editor_insert_paragraph();
        editor_connect_paragraph(entry, index);
        break;

      case "image":
        entry = editor_insert_image();
        editor_image_render(entry, index);
        editor_image_connect(entry, index);
        break;

      case "heading":
        break;

      // skip to next item if we dont have a template for the type
      default:
        console.log("skipping, unkown type");
        console.log(C_EDITOR_ARTICLE[index]);
        continue;
    }
    editor_connect_generic(entry, index);
  }

  requestAnimationFrame(() => {
    window.scrollTo(0, y_pos);
  });
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
  if (index > C_EDITOR_ARTICLE.length - 2) {
    return;
  }
  let item = C_EDITOR_ARTICLE[index];
  C_EDITOR_ARTICLE[index] = C_EDITOR_ARTICLE[index + 1];
  C_EDITOR_ARTICLE[index + 1] = item;
  // assign new indexes
  C_EDITOR_ARTICLE[index].index = index;
  C_EDITOR_ARTICLE[index + 1].index = index + 1;
}

function editor_move_item_up(index) {
  if (index < 1) {
    return;
  }
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
  add_paragraph_button.onclick = () =>
    editor_add_item({
      ...C_EDITOR_BASE_PARAGRAPH,
    });

  let add_image_button = document.getElementById("add-image");
  add_image_button.onclick = () => editor_add_item({ ...C_EDITOR_BASE_IMAGE });

  let add_heading_button = document.getElementById("add-heading");
  add_heading_button.onclick = () =>
    editor_add_item({
      ...C_EDITOR_BASE_HEADING,
    });

  // temp for testing
  // add_image_button.click();
}

window.addEventListener("load", (event) => {
  editor_init();
});

// temp for testing
// editor_add_image();
