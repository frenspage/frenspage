import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import EditCardPopup from "../popups/EditCardPopup";
import Card from "./items/Card";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import { generateShape } from "../../lib/generateShape";
import { useRouter } from "next/router";

interface Props {
    loggedIn: boolean;
    page: any;
}

const LoggedInCanvas: React.FC<Props> = ({ loggedIn = false, page }) => {
    const router = useRouter();

    const { content, addContent, deleteContent, setFrenPage } =
        usePageContent();
    const [isLoadingUpload, setLoadingUpload] = useState(false);
    const [cards, setCards] = useState<TCardItems>(content);
    const [openedCard, setOpenedCard] = useState<ICardItem | null>(null);
    const { setEditCardPopup } = usePopup();
    const stage = useRef<any>(null);

    const [windowSize, setWindowSize] = useState({
        width: window?.innerWidth,
        height: window?.innerHeight,
    });

    useEffect(() => {
        const fetcher = async () => {
            let res = await setFrenPage(page);
            await setCards(res);
            console.log("res: ", res);
        };
        fetcher().then(() => {});
    }, [page, router]);

    /**
     * update windowSize-state when resizing window,
     * to rerender canvas
     **/
    useLayoutEffect(() => {
        const updateSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const addCard = () => {
        let i = cards?.length;
        let card = generateShape(i ?? 0, undefined, undefined);

        setEditCardPopup(true);
        setOpenedCard(card);

        //setCards((old: any) => [...old, card]);
        //addContent(card);
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
                item.object.set(
                    "x",
                    (e.target.attrs.x / window.innerWidth) * 100,
                );
                item.object.set(
                    "y",
                    (e.target.attrs.y / window.innerHeight) * 100,
                );
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
                <Stage
                    width={windowSize.width ?? window.innerWidth}
                    height={windowSize.height ?? window.innerHeight}
                >
                    <Layer ref={stage}>
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
                                cards={cards}
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
                        isLoadingUpload={isLoadingUpload}
                        setLoadingUpload={setLoadingUpload}
                        setCards={setCards}
                        cards={cards}
                    />

                    <button
                        className="addCard-button"
                        id="fab"
                        onClick={addCard}
                    >
                        +
                    </button>
                </>
            )}
        </>
    );
};
export default LoggedInCanvas;
