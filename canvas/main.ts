import { isNullishCoalesce } from "typescript";
import Drawer from "./View/Drawer";

let drawer: Drawer | null = null;

export const init = () => {
    let root = document.getElementById(
        "main-canvas-container",
    ) as HTMLDivElement;
    drawer = new Drawer(root);
};
