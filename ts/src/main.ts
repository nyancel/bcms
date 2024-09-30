import editor_main from "./editor";
import user_main from "./user";

window.addEventListener("load", (event) => {
    if (window.location.pathname === "/editor") {
        editor_main();
    }

    user_main();
});