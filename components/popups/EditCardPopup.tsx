import React, { FC, useState, useEffect } from "react";
import { ICardItem, IS3Config, IS3UploadResponse } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useS3Upload } from "next-s3-upload";
import LoadingSpinner from "../global/LoadingSpinner";
import PopupWrapper from "./PopupWrapper";
import { createWithNewFileName } from "../../lib/storage";

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
    const { uploadToS3 } = useS3Upload();

    useEffect(() => {
        setCaption(openedCard?.content?.caption ?? "");
        setFilePath(openedCard?.content?.path ?? "");
    }, [openedCard, setOpenedCard]);

    const closePopup = () => {
        setIsOpen(false);
        setOpenedCard(null);
        setFile(null);
    };

    const handleFileChange = async (e: any) => {
        let pFile = e?.target?.files[0];
        let newFile: File = createWithNewFileName(pFile);
        console.log("file: ", newFile);

        setFile(newFile);
    };

    async function uploadImage() {
        if (file) {
            let { url } = await uploadToS3(file);
            console.log("url: ", url);
            return url;
        } else {
            return null;
        }
    }

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
        <PopupWrapper
            isOpen={isOpen}
            closePopup={closePopup}
            size={"small"}
            headerContent={"Add Content"}
        >
            <div className="file-upload">
                {(file || filePath) && (
                    <img
                        src={file ? URL.createObjectURL(file) : filePath}
                        alt="image to upload"
                        className="file-upload__preview-image"
                    />
                )}
                <input
                    className="file-upload__file-input"
                    type="file"
                    multiple={false}
                    onChange={handleFileChange}
                />
            </div>

            <textarea
                className="textarea w-100 marginTop"
                name="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="your caption"
                rows={5}
            />
            <footer className="flex spaceBetween w-100 paddingTop">
                <button
                    className="button disabled"
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
                    <FontAwesomeIcon
                        icon={faSave}
                        style={{ fontSize: "1.4rem", height: "1.4rem" }}
                    />
                </button>
            </footer>
            <div className="flex flex-column-center w-100">
                {isLoadingUpload && <LoadingSpinner />}
            </div>
        </PopupWrapper>
    );
};

export default EditCardPopup;
