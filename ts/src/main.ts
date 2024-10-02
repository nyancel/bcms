import editor_main from "./editor";
import user_main from "./user";
import gallery_popup_main from "./gallery_popup";

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

    user_main();
});