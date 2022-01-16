import React, { FC, useState, useEffect } from "react";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import Card from "./items/Card";

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

    const handleClick = () => {};

    if (!cards) return null;

    return (
        <div className="cards__mobile__container flex flex-column-center">
            {cards?.map((item: ICardItem, index: number) => {
                return (
                    <Card index={index} item={item} handleClick={handleClick} />
                );
            })}
        </div>
    );
};

export default CardsRenderer;
