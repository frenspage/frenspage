import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { initLoggedInCanvas } from "../../canvas/main";
import { Stage, Layer, Rect } from "react-konva";
import NewCardPopup from "../popups/NewCardPopup";
import Card from "./items/Card";

const generateShapes = (pX?: number, pY?: number) => {
    return [...Array(1)].map((_, i) => generateShape(i, pX, pY));
};

const generateShape = (i: number, pX?: number, pY?: number) => {
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
        x: x,
        y: y,
        rotation: 0,
        isDragging: false,
        content: {
            title: `Card ${i}`,
        },
    };
};

const INITIAL_STATE = generateShapes();

const LoggedInCanvas: NextPage = () => {
    const [cards, setCards] = useState(INITIAL_STATE);
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [openedCard, setOpenedCard] = useState(-1);

    const addCard = () => {
        let i = cards.length;
        let card = generateShape(i, undefined, undefined);
        setCards((old) => [...old, card]);
    };

    const handleDragStart = (e: any) => {
        const id = e.target.id();
        setCards(
            cards.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            }),
        );
    };
    const handleDragEnd = (e: any) => {
        setCards(
            cards.map((star) => {
                return {
                    ...star,
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
                        {cards.map((item, index) => (
                            <Card
                                key={`card__${index}`}
                                index={item.id}
                                item={item}
                                handleDragStart={handleDragStart}
                                handleDragEnd={handleDragEnd}
                                handleClick={handleClick}
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
