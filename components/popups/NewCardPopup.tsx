import React, { FC, useState, useEffect } from "react";

interface Props {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    openedCard: number;
    setOpenedCard: (val: number) => void;
}

const NewCardPopup: FC<Props> = ({
    isOpen,
    setIsOpen,
    openedCard,
    setOpenedCard,
}) => {
    const closePopup = () => {
        setIsOpen(false);
        setOpenedCard(-1);
    };
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
                    className="content flex flex-direction--column flex-center--vertical padding--none"
                    style={{ width: "100%" }}
                >
                    <p>New Card popup</p>
                    <p>ID: {openedCard}</p>
                </div>
            </div>
        </div>
    );
};

export default NewCardPopup;
