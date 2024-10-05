import editor_main from "./editor";
import user_main from "./user";
import gallery_popup_main from "./gallery_popup";
import gallery_main from "./gallery"
import index_main from "./index"
import view_main from "./view"

declare global {
    interface Window {
        receive_data: (data: string) => void;
    }
}

window.addEventListener("load", (event) => {
    if (window.location.pathname === "/editor") {
        editor_main();
    }
    if (window.location.pathname === "/gallery-popup") {
        gallery_popup_main();
    }
    if (window.location.pathname === "/gallery") {
        gallery_main();
    }
    if (window.location.pathname === "/view") {
        view_main();
    }
    if (window.location.pathname === "/") {
        index_main();
    }

    user_main();
});