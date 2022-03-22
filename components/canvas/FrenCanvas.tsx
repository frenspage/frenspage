import React, { useEffect, useLayoutEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import Card from "./items/Card";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";
import FrenCardPopup from "../popups/FrenCardPopup";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";
import { punifyCode } from "../../lib/textLib";

interface Props {
    page: any;
}

const FrenCanvas: React.FC<Props> = ({ page }) => {
    const { content, addContent, setFrenPage } = usePageContent();
    const [cards, setCards] = useState<TCardItems>(content);
    const [openedCard, setOpenedCard] = useState<ICardItem | null>(null);
    const { setFrenCardPopup } = usePopup();

    const router = useRouter();

    const [windowSize, setWindowSize] = useState({
        width: window?.innerWidth,
        height: window?.innerHeight,
    });

    useEffect(() => {
        setFrenPage(page);
    }, [page, router]);

    useEffect(() => {
        if (page && content) setCards(content);
    }, [content]);

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
                <Stage
                    width={windowSize.width ?? window.innerWidth}
                    height={windowSize.height ?? window.innerHeight}
                >
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
