import * as user_core from "../user/user_core";
import * as cache from "./cache";

export function random_id() {
    return window.crypto.randomUUID();
}


export function time() {
    let d = new Date();
    let current_time = d.getTime() / 1000;
    return current_time;
}


export async function post_json(endpoint: string, data: any) {
    let response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response;
}

export async function post_formdata(endpoint: string, data: FormData) {
    let response = await fetch(endpoint, {
        method: "POST",
        body: data,
    });
    return response;
}

export async function get_smallest_res_from_src(image_id: string, min_width: number) {
    console.log("getting smallest item from res")
    // check the cache first
    let key = `util_get_media_src_by_width-${image_id}-${min_width}`;
    let cached_value = cache.cache_get(key);
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
    cache.cache_add(key, target_url);
    return target_url;
}