import gallery_popup_main from "./gallery_popup";
import gallery_main from "./gallery"
import index_main from "./index"
import view_main from "./view"
import { user_header_main } from "./user/user_header";
import { user_page_main } from "./user/user_page";
import draft_view_main from "./editor/draft_page";

declare global {
    interface Window {
        receive_data: (data: string) => void;
    }
}

window.addEventListener("load", (event) => {
    // global init
    user_header_main();

    // page based init
    switch (window.location.pathname) {
        case "/editor":
            let url_params = new URLSearchParams(window.location.search);
            let draft_id = url_params.get("draft-id");
            if (draft_id == null) {
                console.log("no draft chosen")
                draft_view_main();
                break;
            }
            // render editor for specific draft
            break;

        case "/gallery-popup":
            gallery_popup_main();
            break;

        case "/gallery":
            gallery_main();
            break;

        case "/view":
            view_main();
            break;

        case "/signin":
            user_page_main();
            break;

        case "/":
            index_main();
            break;

        default:
            break;
    }
});