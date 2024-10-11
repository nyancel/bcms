export function time() {
    let d = new Date();
    let time = d.getTime();
    return time / 1000;
}