import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { initLoggedInCanvas } from "../../canvas/main";
import { Stage, Layer, Rect } from "react-konva";
import NewCardPopup from "../popups/NewCardPopup";

function generateShapes() {
    return [...Array(1)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: 0,
        isDragging: false,
    }));
}

const INITIAL_STATE = generateShapes();

const LoggedInCanvas: NextPage = () => {
    const [cards, setCards] = useState(INITIAL_STATE);
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const [openedCard, setOpenedCard] = useState(-1);

    const addCard = () => {
        let i = cards.length;
        let card = {
            id: i.toString(),
            x:
                Math.random() *
                (window.innerWidth > 200
                    ? window.innerWidth - 200
                    : window.innerWidth),
            y:
                Math.random() *
                (window.innerHeight > 300
                    ? window.innerHeight - 300
                    : window.innerHeight),
            rotation: 0,
            isDragging: false,
        };
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
                            <Rect
                                key={`card__${index}`}
                                id={item.id}
                                x={item.x}
                                y={item.y}
                                width={200}
                                height={300}
                                fill="#ffffff"
                                draggable
                                rotation={item.rotation}
                                scaleX={item.isDragging ? 1.1 : 1}
                                scaleY={item.isDragging ? 1.1 : 1}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onClick={handleClick}
                                shadowColor={"black"}
                                shadowBlur={10}
                                shadowOffset={{ x: 0, y: 0 }}
                                shadowOpacity={0.5}
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
