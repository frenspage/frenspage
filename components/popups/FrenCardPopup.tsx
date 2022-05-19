import React, { FC, useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext";
import { ICardItem } from "../../types/types";
import { linkedText, linkedTextWithoutBreak } from "../../lib/textLib";
import PopupWrapper from "./PopupWrapper";
import Image from "next/image";
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
    console.log("FrenCardpopup:  ", linkedText(item.content.caption));

    return (
        <PopupWrapper
            isOpen={isOpen}
            closePopup={closePopup}
            size={"small"}
            headerContent={""}
        >
            <div className="flex flex-direction--column flex-center--vertical flex--gap paddingTop--big">
                {item.content.path && (
                    <Image
                        src={item.content.path}
                        blurDataURL={item.content.path}
                        alt={item.content.caption}
                        className="frencard-popup__image"
                        width="400"
                        height="400"
                        loading="lazy"
                        placeholder="blur"
                    />
                )}
                {item.content.caption && (
                    <p
                        className={
                            item.content.path
                                ? "centertext w-100"
                                : "justifytext w-100"
                        }
                        dangerouslySetInnerHTML={{
                            __html: linkedText(item.content.caption),
                        }}
                    />
                )}
            </div>
        </PopupWrapper>
    );
};

export default FrenCardPopup;
