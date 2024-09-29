const C_GALLERY_INPUT_SOURCE = document.getElementById("image-upload-source");

const C_GALLERY_IMAGE_PREVIEW_TEMPLATE = document.getElementById(
  "gallery-image-preview-template"
);

const C_GALLERY_IMAGE_DISPLAY = document.getElementById(
  "gallery-image-display"
);

async function gallery_popup_load_all_media() {
  let all_media = await util_fetch_post_json(
    "/media/fetch_all_media_metadata",
    undefined
  );

  if (!all_media || all_media.error) {
    return;
  }

  if (all_media.length > 1) {
    all_media.sort((a, b) => b.creation_time - a.creation_time);
  }

  let media_promises = all_media
    .filter((metadata) => metadata && metadata.id)
    .map(async (metadata) => {
      // generate the entries and assign relevant functions etc
      let target_url = await util_get_media_src_by_width(
        metadata.id,
        C_GALLERY_IMAGE_DISPLAY.clientWidth
      );

      let entry = document.createElement("li");
      let image = C_GALLERY_IMAGE_PREVIEW_TEMPLATE.cloneNode(true).content;
      entry.appendChild(image);
      let img = entry.querySelector("img");
      img.src = target_url;

      entry.onclick = () => {
        data = {
          image_id: metadata.id,
        };
        window.opener.receive_data(data);
        window.close();
      };

      return entry;
    });

  // repopulate the dom
  let media_entries = await Promise.all(media_promises);
  C_GALLERY_IMAGE_DISPLAY.innerHTML = null;
  media_entries.forEach((entry) => C_GALLERY_IMAGE_DISPLAY.appendChild(entry));
}

window.addEventListener("load", (event) => {
  gallery_popup_load_all_media();
});
