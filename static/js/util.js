async function util_fetch_post_json(endpoint, data) {
  let response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let response_json = await response.json();
  return response_json;
}

async function util_fetch_post_formdata(endpoint, data) {
  let response = await fetch(endpoint, {
    method: "POST",
    body: data,
  });

  let json_response = await response.json();
  return json_response;
}

async function util_get_media_src_by_width(image_id, min_width) {
  let image_metadata = await util_fetch_post_json("/media/fetch_media", {
    media_ID: image_id,
  });

  let min = Math.pow(min_width, 2);

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
      break; // break once the first image res satisfies our condition
    }
  }

  // format target url
  let target_url = `/media/fetch_media_instance?instance_ID=${instance_id}`;
  return target_url;
}
