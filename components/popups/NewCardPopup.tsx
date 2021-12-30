import React, { FC, useState, useEffect } from "react";

interface Props {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

const NewCardPopup: FC<Props> = ({ isOpen, setIsOpen }) => {
    return (
        <div className={"popupbg" + (!isOpen ? " hidden" : "")}>
            <div className="popup">
                <button
                    className="closepopup"
                    onClick={() => setIsOpen(false)}
                    tabIndex={0}
                >
                    <span>&times;</span>
                </button>
                <div
                    className="content flex flex-direction--column flex-center--vertical padding--none"
                    style={{ width: "100%" }}
                >
                    <p>New Card popup</p>
                </div>
            </div>
        </div>
    );
};

export default NewCardPopup;
