import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { initLoggedInCanvas } from "../../canvas/main";
import { Stage, Layer, Rect } from "react-konva";
import NewCardPopup from "../popups/NewCardPopup";
import Card from "./items/Card";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";

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

const LoggedInCanvas: NextPage = () => {
    const { content, addContent } = usePageContent();

    const [cards, setCards] = useState<TCardItems>(content);
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [openedCard, setOpenedCard] = useState(-1);

    const addCard = () => {
        let i = cards?.length;
        let card = generateShape(i ?? 0, undefined, undefined);
        setCards((old: any) => [...old, card]);
        addContent(card);
    };

    const handleMouseEnter = (e: any) => {
        const container = e.target?.getStage()?.container();
        if (container) container.style.cursor = "pointer";
    };

    const handleMouseLeave = (e: any) => {
        const container = e.target?.getStage()?.container();
        if (container) container.style.cursor = "default";
    };

    const handleDragStart = (e: any) => {
        const id = e.target.id();
        const container = e.target?.getStage()?.container();
        if (container) container.style.cursor = "grab";
        if (cards)
            setCards(
                cards.map((card: any) => {
                    return {
                        ...card,
                        isDragging: card?.id === id,
                    };
                }),
            );
    };
    const handleDragEnd = (e: any) => {
        const container = e.target?.getStage()?.container();
        if (container) container.style.cursor = "pointer";
        if (cards)
            setCards(
                cards?.map((card: any) => {
                    return {
                        ...card,
                        isDragging: false,
                    };
                }),
            );
    };

    const handleClick = (e: any) => {
        const id = e.target.id();
        setPopupIsOpen(true);
        setOpenedCard(id);
    };

    return (
        <>
            <div id="main-canvas-container" className="canvas-container">
                <Stage width={window.innerWidth} height={window.innerHeight}>
                    <Layer>
                        {cards?.map((item: any, index: number) => (
                            <Card
                                key={`card__${index}`}
                                index={item?.id}
                                item={item}
                                handleDragStart={handleDragStart}
                                handleDragEnd={handleDragEnd}
                                handleClick={handleClick}
                                handleMouseEnter={handleMouseEnter}
                                handleMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
            <NewCardPopup
                isOpen={popupIsOpen}
                setIsOpen={setPopupIsOpen}
                openedCard={openedCard}
                setOpenedCard={setOpenedCard}
            />
            <button className="fab" id="fab" onClick={addCard}>
                +
            </button>
        </>
    );
};
export default LoggedInCanvas;
