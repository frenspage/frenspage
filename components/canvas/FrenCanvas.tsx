import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { initLoggedInCanvas } from "../../canvas/main";
import { Stage, Layer, Rect } from "react-konva";
import EditCardPopup from "../popups/EditCardPopup";
import Card from "./items/Card";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";
import FrenCardPopup from "../popups/FrenCardPopup";
import { usePopup } from "../../context/PopupContext";

const generateShapes = (pX?: number, pY?: number) => {
    return [...Array(1)].map((_, i) => generateShape(i, pX, pY));
};

const generateShape = (i: number, pX?: number, pY?: number): ICardItem => {
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
            path: "https://lh3.googleusercontent.com/zxbvg7j5quveTfu_gjKK-5PD2DYY5kjJSMkg1gae6sZnmtBsSvxKEu0_hyX67mA2X6gJZPdmy6umGZES91nHoTgqqRIPC1vdQz49ng=s250",
        },
        object: null,
    };
};

const INITIAL_STATE = generateShapes();

interface Props {
    page: any;
}

const FrenCanvas: React.FC<Props> = ({ page }) => {
    const { content, addContent, setFrenPage } = usePageContent();
    const [cards, setCards] = useState<TCardItems>(content);
    const [openedCard, setOpenedCard] = useState<ICardItem | null>(null);
    const { setFrenCardPopup } = usePopup();

    useEffect(() => {
        setFrenPage(page);
    }, [page]);

    useEffect(() => {
        if (page && content) setCards(content);
    }, [content]);

    const handleMouseEnter = (e: any) => {
        const container = e.target?.getStage()?.container();
        if (container) container.style.cursor = "pointer";
    };

    const handleMouseLeave = (e: any) => {
        const container = e.target?.getStage()?.container();
        if (container) container.style.cursor = "default";
    };

    const handleDragStart = (e: any, item: ICardItem) => {};
    const handleDragEnd = (e: any, item: ICardItem) => {};

    const handleClick = (e: any, item: ICardItem) => {
        setOpenedCard(item);
        setFrenCardPopup(true);
    };

    if (!cards) return null;

    return (
        <>
            <div id="main-canvas-container" className="canvas-container">
                <Stage width={window?.innerWidth} height={window?.innerHeight}>
                    <Layer>
                        {cards?.map((item: ICardItem, index: number) => (
                            <Card
                                key={`card__${index}`}
                                index={item?.id}
                                item={item}
                                handleDragStart={(e: any) =>
                                    handleDragStart(e, item)
                                }
                                handleDragEnd={(e: any) =>
                                    handleDragEnd(e, item)
                                }
                                handleClick={(e: any) => handleClick(e, item)}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                                isUsersOwnPage={false}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
            <FrenCardPopup item={openedCard} setItem={setOpenedCard} />
        </>
    );
};
export default FrenCanvas;
