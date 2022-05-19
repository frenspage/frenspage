import { isNullishCoalesce } from "typescript";
import Drawer from "./View/Drawer";

let drawer: Drawer | null = null;

export const initFrenCanvas = async () => {
    let root = (await document.getElementById(
        "main-canvas-container",
    )) as HTMLDivElement;
    drawer = new Drawer(root);
};

export const initLoggedInCanvas = async () => {
    let root = (await document.getElementById(
        "main-canvas-container",
    )) as HTMLDivElement;
    drawer = new Drawer(root);
};
