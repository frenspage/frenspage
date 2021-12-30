import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { initLoggedInCanvas } from "../../canvas/main";
import { Stage, Layer, Rect } from "react-konva";

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

const INITIAL_STATE = generateShapes();

const LoggedInCanvas: NextPage = () => {
    const [cards, setCards] = React.useState(INITIAL_STATE);
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
    return (
        <>
            <div id="main-canvas-container" className="canvas-container">
                <Stage width={window.innerWidth} height={window.innerHeight}>
                    <Layer>
                        {cards.map((star) => (
                            <Rect
                                key={star.id}
                                id={star.id}
                                x={star.x}
                                y={star.y}
                                width={200}
                                height={300}
                                fill="white"
                                opacity={0.8}
                                draggable
                                rotation={star.rotation}
                                shadowColor="black"
                                shadowBlur={1}
                                scaleX={star.isDragging ? 1.2 : 1}
                                scaleY={star.isDragging ? 1.2 : 1}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
            <button className="fab" id="fab">
                +
            </button>
        </>
    );
};
export default LoggedInCanvas;
