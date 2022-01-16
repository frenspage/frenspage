import React, { FC, useState, useEffect } from "react";
import { ICardItem } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
    const [file, setFile] = useState<any>(null);

    useEffect(() => {
        setCaption(openedCard?.content?.caption ?? "");
        setFilePath(openedCard?.content?.path ?? "");
    }, [openedCard, setOpenedCard]);

    const closePopup = () => {
        setIsOpen(false);
        setOpenedCard(null);
        setFile(null);
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
            <div className="popup width--small">
                <header className="popup__header popup__header--border">
                    <h3 className="popup__header__title">Add Content</h3>
                    <button
                        className="closepopup"
                        onClick={closePopup}
                        tabIndex={0}
                    >
                        <span>&times;</span>
                    </button>
                </header>
                <div className="flex flex-direction--column flex-space-between h--100">
                    <div
                        className="content flex flex-direction--column flex-center--vertical flex--gap padding--none"
                        style={{ width: "100%" }}
                    >
                        <div className="file-upload">
                            {(file || filePath) && (
                                <img
                                    src={
                                        file
                                            ? URL.createObjectURL(file)
                                            : filePath
                                    }
                                    alt="image to upload"
                                    className="file-upload__preview-image"
                                />
                            )}
                            <input
                                className="file-upload__file-input"
                                type="file"
                                multiple={false}
                                onChange={(e: any) =>
                                    setFile(e?.target?.files[0])
                                }
                            />
                        </div>

                        <textarea
                            className="textarea w-100"
                            name="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="your caption"
                            rows={4}
                        />
                        {/*<input
                            className="input"
                            type="text"
                            name="filePath"
                            value={filePath}
                            onChange={(e) => setFilePath(e.target.value)}
                            placeholder="File Path (string for testing)"
                        />*/}
                        <div className="flex spaceBetween w-100">
                            <button
                                className="button black"
                                onClick={() => deleteCard(openedCard)}
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    style={{
                                        fontSize: "1rem",
                                        height: "1rem",
                                    }}
                                />
                            </button>

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCardPopup;
