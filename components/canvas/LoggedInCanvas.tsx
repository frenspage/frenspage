import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { initLoggedInCanvas } from "../../canvas/main";
import { Stage, Layer, Rect, Text } from "react-konva";
import EditCardPopup from "../popups/EditCardPopup";
import Card from "./items/Card";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";
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
            path: "/images/punk.png",
        },
        object: null,
    };
};

interface Props {
    loggedIn: boolean;
}

const LoggedInCanvas: React.FC<Props> = ({ loggedIn = false }) => {
    const { content, addContent, deleteContent } = usePageContent();
    const [cards, setCards] = useState<TCardItems>(content);
    const [openedCard, setOpenedCard] = useState<ICardItem | null>(null);
    const { setEditCardPopup } = usePopup();

    useEffect(() => setCards(content), [content]);

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

    const handleDragStart = (e: any, item: ICardItem) => {
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
    const handleDragEnd = (e: any, item: ICardItem) => {
        const container = e.target?.getStage()?.container();
        if (container) container.style.cursor = "pointer";

        if (cards) {
            setCards(
                cards?.map((card: any) => {
                    return {
                        ...card,
                        isDragging: false,
                    };
                }),
            );
            if (item.object) {
                item.object.set("x", e.target.attrs.x);
                item.object.set("y", e.target.attrs.y);
                item.object.set("rotation", item.rotation);
                item.object.save();
            }
        }
    };

    const handleClick = (e: any, item: ICardItem) => {
        setEditCardPopup(true);
        setOpenedCard(item);
    };

    const deleteCard = (card: ICardItem | null) => {
        if (!card) return;
        deleteContent(card);
        setEditCardPopup(false);
        setOpenedCard(null);
    };

    return (
        <>
            <div id="main-canvas-container" className="canvas-container">
                <Stage width={window.innerWidth} height={window.innerHeight}>
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
                                isUsersOwnPage={true}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
            {loggedIn && (
                <>
                    <EditCardPopup
                        openedCard={openedCard}
                        setOpenedCard={setOpenedCard}
                        deleteCard={deleteCard}
                    />

                    <button className="fab" id="fab" onClick={addCard}>
                        +
                    </button>
                </>
            )}
        </>
    );
};
export default LoggedInCanvas;
