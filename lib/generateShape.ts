import { ICardItem } from "../types/types";

export const generateShapes = (pX?: number, pY?: number) => {
    return [...Array(1)].map((_, i) => generateShape(i, pX, pY));
};

export const generateShape = (
    i: number,
    pX?: number,
    pY?: number,
): ICardItem => {
    let x =
        pX ??
        Math.random() *
            (window.innerWidth > 200
                ? window.innerWidth - 200
                : window.innerWidth);
    let y =
        pY ??
        Math.random() *
            (window.innerHeight > 300
                ? window.innerHeight - 300
                : window.innerHeight);
    return {
        id: i.toString(),
        index: i,
        x: x,
        y: y,
        rotation: 0,
        isDragging: false,
        content: {
            caption: `Caption`,
            path: "/images/punk.png",
        },
        object: null,
    };
};
