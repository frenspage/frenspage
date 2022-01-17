import React, { FC, useState, useEffect } from "react";
import { usePageContent } from "../../context/PageContentContext";
import { ICardItem, TCardItems } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import Card from "./items/Card";
import FrenCardPopup from "../popups/FrenCardPopup";
import EditCardPopup from "../popups/EditCardPopup";
import { generateShape } from "../../lib/generateShape";

interface Props {
    loggedIn: boolean;
}

const LoggedInCardsRenderer: FC<Props> = ({ loggedIn }) => {
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
            {loggedIn && (
                <>
                    <EditCardPopup
                        openedCard={openedCard}
                        setOpenedCard={setOpenedCard}
                        deleteCard={deleteCard}
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

export default LoggedInCardsRenderer;
