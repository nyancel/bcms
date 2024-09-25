let C_FUNCTION_CACHE = []; // cache for functions
const C_CACHE_KEY = "C_CACHE_KEY";

function util_local_save_cache() {
  localStorage.setItem(C_CACHE_KEY, JSON.stringify(C_FUNCTION_CACHE));
}

function util_local_load_cache() {
  let tmp = JSON.parse(localStorage.getItem(C_CACHE_KEY));
  if (tmp) {
    C_FUNCTION_CACHE = JSON.parse(localStorage.getItem(C_CACHE_KEY));
  }
}

function util_epoch_seconds() {
  let d = new Date();
  return d / 1000;
}

function util_cache_check(key) {
  // load up the cache
  util_local_load_cache();
  // remove stale keys
  for (let index = 0; index < C_FUNCTION_CACHE.length; index++) {
    if (C_FUNCTION_CACHE[index].time < util_epoch_seconds()) {
      C_FUNCTION_CACHE.splice(index, 1);
    }
  }
  // save any changes
  util_local_save_cache();

  // find the item
  for (let index = 0; index < C_FUNCTION_CACHE.length; index++) {
    if (C_FUNCTION_CACHE[index].key == key) {
      return C_FUNCTION_CACHE[index].value;
    }
  }
  return null;
}

function util_cache_add(key, value) {
  util_local_load_cache();
  let c = {
    key: key,
    value: value,
    time: util_epoch_seconds() + 3600, // valid for one hour
  };

  C_FUNCTION_CACHE.push(c);
  console.log(c);
  util_local_save_cache();
}

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
  // check the cache first
  let key = `util_get_media_src_by_width${image_id}${min_width}`;
  let cached_value = util_cache_check(key);
  if (cached_value) {
    console.log("cache hit");
    return cached_value;
  }

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
  // populate cache before returning
  util_cache_add(key, target_url);
  return target_url;
}
