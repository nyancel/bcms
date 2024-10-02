import { get_local_user_data } from "./user";

// typing
type CacheItem = {
    key: string,
    item: string,
    expires_at: number
}

// globals
const CACHE_KEY = "utilts-cache-stroage-key";

// internal functions
function save_cache_to_local(cache: CacheItem[]) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function load_local_cache() {
    let local = localStorage.getItem(CACHE_KEY);
    if (!local) {
        return null;
    }
    let cache = JSON.parse(local) as CacheItem[];
    if (!cache) {
        throw new Error("cache cant be parsed");
    }
    return cache
}

function cache_get(key: string) {
    // load up the cache
    let cache = load_local_cache();
    if (!cache) {
        return null; // cache might not exist
    }

    // remove stale keys
    for (let index = 0; index < cache.length; index++) {
        if (cache[index].expires_at < time()) {
            cache.splice(index, 1);
        }
    }

    // save any changes
    save_cache_to_local(cache);

    // find the item
    for (let index = 0; index < cache.length; index++) {
        if (cache[index].key == key) {
            return cache[index].item;
        }
    }

    // if no match, return the item
    return null;
}

function cache_add(key: string, value: string, lifetime: number = 3600) {
    let cache = load_local_cache();
    if (!cache) {
        cache = [];
    }

    let c: CacheItem = {
        key: key,
        item: value,
        expires_at: time() + lifetime, // valid for one hour
    };

    cache.push(c);
    console.log(c);
    save_cache_to_local(cache);
}


export function time() {
    let d = new Date();
    let current_time = d.getTime() / 1000;
    return current_time;
}


export async function post_json(endpoint: string, data: any) {
    let user_data = get_local_user_data();
    if (user_data) {
        data.auth_token = user_data.token.id;
    }

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

export async function post_formdata(endpoint: string, data: FormData) {
    // add our token if we have one
    let user_data = get_local_user_data();
    if (user_data) {
        data.append("auth_token", user_data?.token.id);
    }

    let response = await fetch(endpoint, {
        method: "POST",
        body: data,
    });
    console.log(response)

    let json_response = await response.json();
    console.log(json_response);
    return json_response;
}

export async function get_smallest_res_from_src(image_id: string, min_width: number) {
    console.log("getting smallest item from res")
    // check the cache first
    let key = `util_get_media_src_by_width-${image_id}-${min_width}`;
    let cached_value = cache_get(key);
    if (cached_value) {
        return cached_value;
    }

    let image_metadata = await post_json("/media/fetch_media", {
        media_ID: image_id,
    });


    let min = Math.pow(min_width, 2);

    let resolutions = await Promise.all(
        image_metadata.instances.map((res: { instance_id: string, x_dimension: number, y_dimension: number }) => {
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
    cache_add(key, target_url);
    return target_url;
}