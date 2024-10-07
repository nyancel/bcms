import * as editor_core from "./editor_core";

export default function main() {
    let all_drafts = editor_core.load_local_drafts();
    if(!all_drafts){
        
    }
    console.log("editor draft view");
}