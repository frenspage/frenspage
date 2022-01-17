import React, { FC, useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext";
import { ICardItem } from "../../types/types";
import { linkedText, linkedTextWithoutBreak } from "../../lib/linkedText";

interface Props {
    item: ICardItem | null;
    setItem: (val: ICardItem | null) => void;
}

const FrenCardPopup: FC<Props> = ({ item, setItem }) => {
    const { frenCardPopup: isOpen, setFrenCardPopup: setIsOpen } = usePopup();

    const closePopup = () => {
        setIsOpen(false);
        setItem(null);
    };

    if (!item) return null;

    return (
        <div className={"popupbg" + (!isOpen ? " hidden" : "")}>
            <div className="popup width--small">
                <header className="popup__header">
                    <button
                        className="closepopup"
                        onClick={closePopup}
                        tabIndex={0}
                    >
                        <span>&times;</span>
                    </button>
                </header>
                <div className="content flex flex-direction--column flex-center--vertical padding--none flex--gap">
                    {item.content.path && (
                        <img
                            src={item.content.path}
                            alt={item.content.caption}
                            className="w-100"
                        />
                    )}
                    {item.content.caption && (
                        <p
                            className="centertext"
                            dangerouslySetInnerHTML={{
                                __html: linkedText(item.content.caption),
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FrenCardPopup;
