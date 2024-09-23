const gallery_input_source = document.getElementById("image-upload-source");

const gallery_image_preview_template = document.getElementById(
  "gallery-image-preview-template"
);

const gallery_image_display = document.getElementById("gallery-image-display");

async function gallery_load_all_media() {
  let all_media = await util_fetch_post_json(
    "/media/fetch_all_media_metadata",
    undefined
  );

  all_media.sort((a, b) => b.creation_time - a.creation_time);

  let media_promises = all_media
    .filter((metadata) => metadata && metadata.id)
    .map(async (metadata) => {
      console.log(metadata);
      let image_metadata = await util_fetch_post_json("/media/fetch_media", {
        media_ID: metadata.id,
      });
      let min = Math.pow(gallery_image_display.clientWidth, 2);

      let resolutions = await Promise.all(
        image_metadata.instances.map((res) => {
          return {
            id: res.instance_id,
            resolution: res.x_dimension * res.y_dimension,
          };
        })
      );

      // by default pick the highest res, then loop over and select the lowest
      // res that is acceptable for the display.
      resolutions = resolutions.sort((a, b) => a.resolution - b.resolution);
      let instance_id = resolutions[resolutions.length - 1].id;
      for (let r of resolutions) {
        if (r.resolution > min) {
          instance_id = r.id;
          break;
        }
      }

      let target_url = `/media/fetch_media_instance?instance_ID=${instance_id}`;
      let entry = document.createElement("li");
      let image = gallery_image_preview_template.cloneNode(true).content;
      entry.appendChild(image);
      let img = entry.querySelector("img");
      img.width = Math.pow(min, 0.5);
      img.src = target_url;

      let remove_media_button = entry.querySelector(".remove-image-button");
      console.log(remove_media_button);
      remove_media_button.onclick = async () => {
        await util_fetch_post_json("/media/mark_media_as_unlisted", {
          media_ID: metadata.id,
          mark_as_unlisted: true,
        });
        gallery_load_all_media();
      };

      return entry;
    });

  let media_entries = await Promise.all(media_promises);
  gallery_image_display.innerHTML = null;
  media_entries.forEach((entry) => gallery_image_display.appendChild(entry));
}

async function gallery_upload_current_files() {
  let files = gallery_input_source.files;
  let formdata = new FormData();

  for (let index = 0; index <= files.length; index++) {
    formdata.append("media", files[index]);
  }

  let json_response = await util_fetch_post_formdata(
    "/media/upload_media",
    formdata
  );
  gallery_load_all_media();
  gallery_input_source.value = null;
}

// startup
function gallery_init() {
  let upload_button = document.getElementById("upload-image-button");
  upload_button.onclick = gallery_upload_current_files;

  gallery_load_all_media();
}

gallery_init();
