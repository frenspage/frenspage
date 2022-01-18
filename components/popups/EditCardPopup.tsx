import React, { FC, useState, useEffect } from "react";
import { ICardItem } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Web3Storage } from "web3.storage";
import {
    createWithNewFileName,
    retrieveFiles,
    storeFiles,
    storeWithProgress,
} from "../../lib/storage";
import Loader from "../global/Loader";
import LoadingSpinner from "../global/LoadingSpinner";

interface Props {
    openedCard: ICardItem | null;
    setOpenedCard: (val: ICardItem | null) => void;
    deleteCard: (item: ICardItem | null) => void;
    isLoadingUpload: boolean;
    setLoadingUpload: (val: boolean) => void;
}

const EditCardPopup: FC<Props> = ({
    openedCard,
    setOpenedCard,
    deleteCard,
    isLoadingUpload,
    setLoadingUpload,
}) => {
    const { editCardPopup: isOpen, setEditCardPopup: setIsOpen } = usePopup();

    const [caption, setCaption] = useState(openedCard?.content?.caption ?? "");
    const [filePath, setFilePath] = useState(openedCard?.content?.path ?? "");
    const [file, setFile] = useState<any>(null);
    const [uploadProgress, setUploadProgress] = useState("0");

    useEffect(() => {
        setCaption(openedCard?.content?.caption ?? "");
        setFilePath(openedCard?.content?.path ?? "");
    }, [openedCard, setOpenedCard]);

    const closePopup = () => {
        setIsOpen(false);
        setOpenedCard(null);
        setFile(null);
        setUploadProgress("0");
    };

    const uploadImage = async () => {
        if (file) {
            const newFile = createWithNewFileName(file);
            let cid = await storeFiles(newFile); //storeWithProgress(file, setUploadProgress);
            let retrievedFile = await retrieveFiles(cid);
            let path = `https://${cid}.ipfs.dweb.link/${retrievedFile.name}`;
            return path;
        }
    };

    const saveItemContent = async (
        caption: string,
        filePath: string,
        item: ICardItem | null,
    ) => {
        setLoadingUpload(true);
        if (item) {
            if (file) {
                let uploadedFilePath = await uploadImage();
                //if (filePath !== item.content.path) {
                if (uploadedFilePath) {
                    item.content.path = uploadedFilePath;
                    item.object.set("filePath", uploadedFilePath);
                }
            }
            if (caption !== item.content.caption) {
                item.content.caption = caption;
                item.object.set("caption", caption);
            }

            item.object.save().then((res: any) => {
                if (res) {
                    closePopup();
                }
                setLoadingUpload(false);
            });
        }
    };

    return (
        <div
            className={"popupbg" + (!isOpen ? " hidden" : "")}
            onClick={(e) => {
                e.preventDefault();
                if (e.target === e.currentTarget) {
                    closePopup();
                }
            }}
        >
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
                        <div className="flex flex-column-center w-100">
                            {isLoadingUpload && <LoadingSpinner />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCardPopup;
