const article = [];

// default objects
const base_paragraph = {
  type: "paragraph",
  text: "",
  index: 0,
};

const base_heading = {
  type: "heading",
  text: "",
  index: 0,
};

const base_image = {
  type: "image",
  alt_text: "",
  index: 0,
  src: "https://picsum.photos/200",
};

// template refferences
const paragraph_template = document.getElementById(
  "article-paragraph-template"
);
const image_template = document.getElementById("article-image-template");
const heading_template = document.getElementById("article-heading-template");
// render refference
const container = document.getElementById("editor-container");

// view functions
function generate_preview() {
  container.innerHTML = null;
  let entry;
  let item;

  for (let index = 0; index < article.length; index++) {
    switch (article[index].type) {
      case "paragraph":
        // append the paragraph template to the DOM
        entry = document.createElement("li");
        item = paragraph_template.cloneNode(true).content;
        entry.appendChild(item);
        container.appendChild(entry);

        // connect the input to the article item
        let textarea = entry.querySelector(".paragraph-input");
        textarea.value = article[index].text;
        textarea.onchange = () => {
          article[index].text = textarea.value;
        };
        break;

      case "image":
        // append the image template to the DOM
        entry = document.createElement("li");
        item = image_template.cloneNode(true).content;
        entry.appendChild(item);
        container.appendChild(entry);

        // connect the image-template to the relevant item
        let display = entry.querySelector(".image-display");
        display.src = article[index].src;
        let alt_text = entry.querySelector(".image-alt-text-input");
        alt_text.value = article[index].alt_text;
        alt_text.onchange = () => {
          article[index].alt_text = alt_text.value;
        };

        break;

      case "heading":
        break;

      // skip to next item if we dont have a template for the type
      default:
        console.log("skipping, unkown type");
        console.log(article[index]);
        continue;
    }

    // hook up the delete button
    let delete_button = entry.querySelector(".delete-button");
    delete_button.onclick = () => {
      remove_item(index);
      generate_preview();
    };

    // hook up the buttons to move item up and down
    let move_up_button = entry.querySelector(".move-up-button");
    move_up_button.onclick = () => {
      move_item_up(index);
      generate_preview();
    };

    let move_down_button = entry.querySelector(".move-down-button");
    move_down_button.onclick = () => {
      move_item_down(index);
      generate_preview();
    };
  }
}

// article functions
function add_item(item) {
  let length = article.length;
  item.index = length;
  article.push(item);
  generate_preview();
}

function remove_item(index) {
  article.splice(index, 1);
}

function move_item_down(index) {
  let item = article[index];
  article[index] = article[index + 1];
  article[index + 1] = item;
  // assign new indexes
  article[index].index = index;
  article[index + 1].index = index + 1;
}

function move_item_up(index) {
  let item = article[index];
  article[index] = article[index - 1];
  article[index - 1] = item;
  // assign new indexes
  article[index].index = index;
  article[index - 1].index = index - 1;
}

function add_paragraph() {
  let p = { ...base_paragraph }; // clone the base paragraph;
  add_item(p);
}

function add_image() {
  let i = { ...base_image }; // clone the base paragraph;
  add_item(i);
}

function add_heading() {
  let h = { ...base_heading }; // clone the base paragraph;
  add_item(h);
}

function log_article() {
  console.log(article);
}

// startup
function init() {
  let log_button = document.getElementById("log-article");
  log_button.onclick = log_article;

  let add_paragraph_button = document.getElementById("add-paragraph");
  add_paragraph_button.onclick = add_paragraph;

  let add_image_button = document.getElementById("add-image");
  add_image_button.onclick = add_image;

  let add_heading_button = document.getElementById("add-heading");
  add_heading_button.onclick = add_heading;
}

window.onload = init;
