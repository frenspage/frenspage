import React, { FC, useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext";
import { ICardItem } from "../../types/types";

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
            <div className="popup">
                <button
                    className="closepopup"
                    onClick={closePopup}
                    tabIndex={0}
                >
                    <span>&times;</span>
                </button>
                <div
                    className="content flex flex-direction--column flex-center--vertical padding--none flex--gap"
                    style={{ width: "100%" }}
                >
                    {item.content.path && (
                        <img
                            src={item.content.path}
                            alt={item.content.caption}
                        />
                    )}
                    {item.content.caption && (
                        <p
                            dangerouslySetInnerHTML={{
                                __html: item.content.caption,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FrenCardPopup;