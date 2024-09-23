const gallery_input_source = document.getElementById("image-upload-source");

const gallery_image_preview_template = document.getElementById(
  "gallery-image-preview-template"
);

const gallery_image_display = document.getElementById("gallery-image-display");

async function gallery_load_all_media() {
  let all_media = await util_fetch_post(
    "/media/fetch_all_media_metadata",
    undefined
  );

  for (let index = 0; index <= all_media.length; index++) {
    let metadata = all_media[index];
    if (!metadata) {
      continue;
    }
    if (!metadata.id) {
      continue;
    }

    let image_metadata = await util_fetch_post("/media/fetch_media", {
      media_ID: metadata.id,
    });

    let resolutions = image_metadata.instances;

    let min = Math.pow(gallery_image_display.clientWidth, 2);

    let smallest = resolutions[0].x_dimension * resolutions[0].y_dimension;
    let instance_id = resolutions[0].instance_id;

    for (let index = 0; index < resolutions.length; index++) {
      let new_res =
        resolutions[index].x_dimension * resolutions[index].y_dimension;
      if (new_res < smallest && new_res > min) {
        smallest = new_res;
        instance_id = resolutions[index].instance_id;
      }
    }

    let target_url = `/media/fetch_media_instance?instance_ID=${instance_id}`;
    let entry = document.createElement("li");
    let image = gallery_image_preview_template.cloneNode(true).content;
    entry.appendChild(image);
    gallery_image_display.appendChild(entry);
    let img = entry.querySelector("img");
    img.width = Math.pow(min, 0.5);
    img.src = target_url;
  }
}

async function gallery_upload_current_files() {
  let files = gallery_input_source.files;
  let formdata = new FormData();

  for (let index = 0; index <= files.length; index++) {
    formdata.append("media", files[index]);
  }

  let response = await fetch("/media/upload_media", {
    method: "POST",
    body: formdata,
  });

  let json_response = await response.json();
  console.log(json_response);
}

// startup
function gallery_init() {
  let upload_button = document.getElementById("upload-image-button");
  upload_button.onclick = gallery_upload_current_files;
  console.log("test");

  gallery_load_all_media();
}

gallery_init();
