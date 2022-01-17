import React, { FC, useState, useEffect } from "react";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import Card from "./items/Card";
import FrenCardPopup from "../popups/FrenCardPopup";

interface Props {
    page: any;
}

const CardsRenderer: FC<Props> = ({ page = null }) => {
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

    const handleClick = (e: any, item: ICardItem) => {
        setOpenedCard(item);
        setFrenCardPopup(true);
    };

    if (!cards) return null;

    return (
        <>
            <div className="cards__mobile__container flex flex-column-center">
                {cards?.map((item: ICardItem, index: number) => {
                    return (
                        <Card
                            key={`card__mobile__${index}`}
                            index={index}
                            item={item}
                            handleClick={(e: any) => handleClick(e, item)}
                        />
                    );
                })}
            </div>
            <FrenCardPopup item={openedCard} setItem={setOpenedCard} />
        </>
    );
};

export default CardsRenderer;
