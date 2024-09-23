const editor_article = [];

// default objects
const editor_base_paragraph = {
  type: "paragraph",
  text: "",
  index: 0,
};

const editor_base_heading = {
  type: "heading",
  text: "",
  index: 0,
};

const editor_base_image = {
  type: "image",
  alt_text: "",
  index: 0,
  src: "https://picsum.photos/200",
};

// template refferences
const editor_paragraph_template = document.getElementById(
  "article-paragraph-template"
);
const editor_image_template = document.getElementById("article-image-template");
const editor_heading_template = document.getElementById(
  "article-heading-template"
);

// render refference
const editor_container = document.getElementById("editor-container");

// view functions
function editor_generate_preview() {
  editor_container.innerHTML = null;
  let entry;
  let item;

  for (let index = 0; index < editor_article.length; index++) {
    switch (editor_article[index].type) {
      case "paragraph":
        // append the paragraph template to the DOM
        entry = document.createElement("li");
        item = editor_paragraph_template.cloneNode(true).content;
        entry.appendChild(item);
        editor_container.appendChild(entry);

        // connect the input to the article item
        let textarea = entry.querySelector(".paragraph-input");
        textarea.value = editor_article[index].text;
        textarea.onchange = () => {
          editor_article[index].text = textarea.value;
        };
        break;

      case "image":
        // append the image template to the DOM
        entry = document.createElement("li");
        item = editor_image_template.cloneNode(true).content;
        entry.appendChild(item);
        editor_container.appendChild(entry);

        // connect the image-template to the relevant item
        let display = entry.querySelector(".image-display");
        display.src = editor_article[index].src;
        let alt_text = entry.querySelector(".image-alt-text-input");
        alt_text.value = editor_article[index].alt_text;
        alt_text.onchange = () => {
          editor_article[index].alt_text = alt_text.value;
        };

        break;

      case "heading":
        break;

      // skip to next item if we dont have a template for the type
      default:
        console.log("skipping, unkown type");
        console.log(editor_article[index]);
        continue;
    }

    // hook up the delete button
    let delete_button = entry.querySelector(".delete-button");
    delete_button.onclick = () => {
      editor_remove_item(index);
      editor_generate_preview();
    };

    // hook up the buttons to move item up and down
    let move_up_button = entry.querySelector(".move-up-button");
    move_up_button.onclick = () => {
      editor_move_item_up(index);
      editor_generate_preview();
    };

    let move_down_button = entry.querySelector(".move-down-button");
    move_down_button.onclick = () => {
      editor_move_item_down(index);
      editor_generate_preview();
    };
  }
}

// article functions
function editor_add_item(item) {
  let length = editor_article.length;
  item.index = length;
  editor_article.push(item);
  editor_generate_preview();
}

function editor_remove_item(index) {
  editor_article.splice(index, 1);
}

function editor_move_item_down(index) {
  let item = editor_article[index];
  editor_article[index] = editor_article[index + 1];
  editor_article[index + 1] = item;
  // assign new indexes
  editor_article[index].index = index;
  editor_article[index + 1].index = index + 1;
}

function editor_move_item_up(index) {
  let item = editor_article[index];
  editor_article[index] = editor_article[index - 1];
  editor_article[index - 1] = item;
  // assign new indexes
  editor_article[index].index = index;
  editor_article[index - 1].index = index - 1;
}

function editor_add_paragraph() {
  let p = { ...editor_base_paragraph }; // clone the base paragraph;
  editor_add_item(p);
}

function editor_add_image() {
  let i = { ...editor_base_image }; // clone the base paragraph;
  editor_add_item(i);
}

function editor_add_heading() {
  let h = { ...editor_base_heading }; // clone the base paragraph;
  editor_add_item(h);
}

function editor_log_article() {
  console.log(editor_article);
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
