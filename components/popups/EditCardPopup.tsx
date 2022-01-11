import React, { FC, useState, useEffect } from "react";
import { ICardItem } from "../../types/types";
import { usePopup } from "../../context/PopupContext";

interface Props {
    openedCard: ICardItem | null;
    setOpenedCard: (val: ICardItem | null) => void;
    deleteCard: (item: ICardItem | null) => void;
}

const EditCardPopup: FC<Props> = ({
    openedCard,
    setOpenedCard,
    deleteCard,
}) => {
    const { editCardPopup: isOpen, setEditCardPopup: setIsOpen } = usePopup();

    const [caption, setCaption] = useState(openedCard?.content?.caption ?? "");
    const [filePath, setFilePath] = useState(openedCard?.content?.path ?? "");

    useEffect(() => {
        setCaption(openedCard?.content?.caption ?? "");
        setFilePath(openedCard?.content?.path ?? "");
    }, [openedCard, setOpenedCard]);

    const closePopup = () => {
        setIsOpen(false);
        setOpenedCard(null);
    };

    const saveItemContent = (
        caption: string,
        filePath: string,
        item: ICardItem | null,
    ) => {
        if (item) {
            if (caption !== item.content.caption) {
                item.content.caption = caption;
                item.object.set("caption", caption);
            }
            if (filePath !== item.content.path) {
                item.content.path = filePath;
                item.object.set("filePath", filePath);
            }
            item.object.save().then((res: any) => {
                if (res) {
                    setIsOpen(false);
                    setOpenedCard(null);
                }
            });
        }
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
                <div className="flex flex-direction--column flex-space-between h--100">
                    <div
                        className="content flex flex-direction--column flex-center--vertical padding--none"
                        style={{ width: "100%" }}
                    >
                        <p>New Card popup</p>
                        <p>ID: {openedCard?.id}</p>
                        <br />
                        <textarea
                            className="textarea"
                            name="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Caption/Text"
                            rows={3}
                        />
                        <input
                            className="input"
                            type="text"
                            name="filePath"
                            value={filePath}
                            onChange={(e) => setFilePath(e.target.value)}
                            placeholder="File Path (string for testing)"
                        />
                        <button
                            className="button black"
                            onClick={() =>
                                saveItemContent(
                                    caption,
                                    filePath,
                                    openedCard as ICardItem,
                                )
                            }
                        >
                            Save
                        </button>
                    </div>
                    <div className="flex flex-space-between">
                        <div></div>
                        <button
                            className="button black"
                            onClick={() => deleteCard(openedCard)}
                        >
                            Delete Card
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCardPopup;
