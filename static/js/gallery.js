const gallery_input_source = document.getElementById("image-upload-source");

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
}

gallery_init();
