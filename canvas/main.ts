import { isNullishCoalesce } from "typescript";
import Drawer from "./View/Drawer";

let drawer: Drawer | null = null;

export const init = async () => {
    let root = (await document.getElementById(
        "main-canvas-container",
    )) as HTMLDivElement;
    drawer = new Drawer(root);
};
