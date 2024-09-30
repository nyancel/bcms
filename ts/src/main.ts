import editor_main from "./editor";

window.addEventListener("load", (event) => {
    if (window.location.pathname === "/editor") {
        editor_main();
    }
});