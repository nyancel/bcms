// import gallery_popup_main from "./gallery_popup";
// import gallery_main from "./gallery"
// import index_main from "./index"
// import view_main from "./view"
import * as user_header from "./user/user_header";
import * as sigin_page from "./user/signin_page";
import * as draft_page from "./editor/draft_page";
import * as media_test_endpoint from "./media/media_test";
// import { user_page_main } from "./user/user_page";
// import draft_view_main from "./editor/draft_page";

declare global {
    interface Window {
        receive_data: (data: string) => void;
    }
}

window.addEventListener("load", (_) => {
    // global init
    user_header.init();

    // page based init
    switch (window.location.pathname) {
        case "/editor":
            let url_params = new URLSearchParams(window.location.search);
            let draft_id = url_params.get("draft-id");
            if (draft_id == null) {
                draft_page.default();
                break;
            }
            // render editor for specific draft
            break;

        // case "/gallery-popup":
        //     gallery_popup_main();
        //     break;

        // case "/gallery":
        //     gallery_main();
        //     break;

        // case "/view":
        //     view_main();
        //     break;

        // case "/":
        //     index_main();
        //     break;

        case "/signin":
            sigin_page.init();
            break;
        
        // endpoint for testing media function via frontend
        // ask if you can remove if this still exists in december 2024 or something
        case "/media/media_test":
            media_test_endpoint.twig_test_function()
            break;

        default:
            break;
    }
});