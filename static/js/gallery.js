const gallery_input_source = document.getElementById("image-upload-source");

const gallery_image_preview_template = document.getElementById(
  "gallery-image-preview-template"
);

async function gallery_load_all_media() {
  let all_media_response = await fetch("/media/fetch_all_media_metadata");
  let all_media_json = await all_media_response.json();

  for (let index = 0; index <= all_media_json.length; index++) {
    let metadata = all_media_json[index];
    if (!metadata) {
      continue;
    }
    if (!metadata.id) {
      continue;
    }

    let image_metadata_response = await fetch("/media/fetch_media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ media_ID: metadata.id }),
    });

    let image_metadata_json = await image_metadata_response.json();
    let resolutions = image_metadata_json.instances;

    console.log(resolutions);

    let min = resolutions[0].x_dimension * resolutions[0].y_dimension;
    let instance_id = resolutions[0].instance_id;

    console.log(min);
    console.log(instance_id);

    for (let index = 0; index <= all_media_json.length; index++) {
      let new_res = resolutions[0].x_dimension * resolutions[0].y_dimension;
      if (new_res < min) {
        min = resolutions[index].x_dimension * resolutions[index].y_dimension;
        instance_id = resolutions[index].instance_id;
      }
    }

    console.log(min);
    console.log(instance_id);

    console.log(`/media/fetch_media_instance?instance_ID=${instance_id}`);
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
