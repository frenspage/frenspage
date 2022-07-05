import React, { FC, useState, useEffect } from "react";

interface Props {
    isOpen: boolean;
    closePopup: () => void;
    size: "normal" | "small" | "full" | "transferPopup" | null;
    headerContent: string;
    flexWrapper?: boolean;
    addClass?: string;
    addClassBg?: string;
    children?: JSX.Element | JSX.Element[] | any;
}

const PopupWrapper: FC<Props> = ({
    children,
    isOpen,
    closePopup,
    size = "small",
    headerContent = "",
    flexWrapper = true,
    addClass,
    addClassBg,
}) => {
    return (
        <div
            className={
                "popupbg" +
                (!isOpen ? " hidden" : "") +
                (addClassBg ? " " + addClassBg : "")
            }
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closePopup();
                }
            }}
        >
            <div
                className={
                    (size === "full" ? "bigpopup" : "popup " + size) +
                    (addClass ? " " + addClass : "")
                }
            >
                <header
                    className={
                        headerContent !== ""
                            ? "popup__header"
                            : "popup__header--small"
                    }
                >
                    {headerContent !== "" && (
                        <h3 className="popup__header__title">
                            {headerContent}
                        </h3>
                    )}
                    <button
                        className="closepopup"
                        onClick={closePopup}
                        tabIndex={0}
                    >
                        <span>&times;</span>
                    </button>
                </header>
                {flexWrapper ? (
                    <div className="flex flex-direction--column flex-space-between">
                        <div className="content flex flex-direction--column flex-center--vertical  padding--none w--100">
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className="content flex flex-direction--column flex-center--vertical flex--gap padding--none w--100">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopupWrapper;
