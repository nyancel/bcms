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
  text: "",
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

  for (let index = 0; index < article.length; index++) {
    switch (article[index].type) {
      case "paragraph":
        // append the paragraph template to the DOM
        let entry = document.createElement("li");
        let p = paragraph_template.cloneNode(true).content;
        entry.appendChild(p);
        container.appendChild(entry);

        // connect the input to the article item
        let textarea = entry.querySelector("textarea");
        textarea.value = article[index].text;
        textarea.onchange = () => {
          article[index].text = textarea.value;
        };

        break;

      case "image":
        break;

      case "heading":
        break;
    }
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
}

function move_item_up(index) {
  let item = article[index];
  article[index] = article[index - 1];
  article[index - 1] = item;
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
