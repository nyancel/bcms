const article = [];

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

function add_item(item) {
  let length = article.length;
  item.index = length;
  article.push(item);
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
