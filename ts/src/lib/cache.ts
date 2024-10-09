import * as util from "./util";

// globals
const CACHE_KEY = "utilts-cache-stroage-key";

// internal functions
function save_cache_to_local(cache: UtilCacheItem[]) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

function load_local_cache() {
    let local = localStorage.getItem(CACHE_KEY);
    if (!local) {
        return null;
    }
    let cache = JSON.parse(local) as UtilCacheItem[];
    if (!cache) {
        throw new Error("cache cant be parsed");
    }
    return cache
}

export function cache_get(key: string) {
    // load up the cache
    let cache = load_local_cache();
    if (!cache) {
        return null; // cache might not exist
    }

    // remove stale keys
    for (let index = 0; index < cache.length; index++) {
        if (cache[index].expires_at < util.time()) {
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

export function cache_add(key: string, value: string, lifetime: number = 3600) {
    let cache = load_local_cache();
    if (!cache) {
        cache = [];
    }

    let c: UtilCacheItem = {
        key: key,
        item: value,
        expires_at: util.time() + lifetime, // valid for one hour
    };

    cache.push(c);
    console.log(c);
    save_cache_to_local(cache);
}

