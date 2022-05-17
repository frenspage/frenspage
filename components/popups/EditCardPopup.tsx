import React, { FC, useState, useEffect } from "react";
import { ICardItem, ICardProps, TCardItems } from "../../types/types";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useS3Upload } from "next-s3-upload";
import LoadingSpinner from "../global/LoadingSpinner";
import PopupWrapper from "./PopupWrapper";
import { createWithNewFileName } from "../../lib/storage";
import { usePageContent } from "../../context/PageContentContext";
import { useRouter } from "next/router";
import { useUser } from "../../context/UserContext";
import CropImagePopup from "./CropImagePopup";

interface Props {
    openedCard: ICardItem | null;
    setOpenedCard: (val: ICardItem | null) => void;
    deleteCard: (item: ICardItem | null) => void;
    isLoadingUpload: boolean;
    setLoadingUpload: (val: boolean) => void;
    cards: TCardItems;
    setCards: React.Dispatch<React.SetStateAction<TCardItems>>;
}

const EditCardPopup: FC<Props> = ({
    openedCard,
    setOpenedCard,
    deleteCard,
    isLoadingUpload,
    setLoadingUpload,
    cards,
    setCards,
}) => {
    const {
        editCardPopup: isOpen,
        setEditCardPopup: setIsOpen,
        setCropImagePopup,
    } = usePopup();
    const { addContent, loadContent } = usePageContent();
    const { ensDomain } = useUser();
    const [caption, setCaption] = useState(openedCard?.content?.caption ?? "");
    const [filePath, setFilePath] = useState(openedCard?.content?.path ?? "");
    const [file, setFile] = useState<any>(null);

    const [temporaryFile, setTemporaryFile] = useState<any>(null);

    const [error, setError] = useState<string>("");

    const { uploadToS3 } = useS3Upload();
    const router = useRouter();

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
        let newFile: File | null = createWithNewFileName(pFile);
        if (newFile) {
            let size = newFile.size / 1024 / 1024;
            if (size < 3.1) {
                setFile(null);
                setTemporaryFile(newFile);
                setError("");
                setCropImagePopup(true);
            } else {
                setError("Filesize is too large. \nmax. 3 MB");
            }
        }
    };

    async function uploadImage() {
        if (file) {
            let { url } = await uploadToS3(file);
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
        let oldFilePath = "";

        setLoadingUpload(true);
        if (item) {
            if (file) {
                oldFilePath = item.content.path;
                let uploadedFilePath = await uploadImage();
                //if (filePath !== item.content.path) {
                if (uploadedFilePath) {
                    item.content.path = uploadedFilePath;
                    item.object?.set("filePath", uploadedFilePath);
                }
            }
            if (caption !== item.content.caption) {
                item.content.caption = caption;
                item.object?.set("caption", caption);
            }

            if (item.object) {
                await item.object.save().then(async (res: any) => {
                    if (res) {
                        const bodyData = {
                            imageUrl: oldFilePath,
                            userId: ensDomain?.name ?? "",
                            userToken: "",
                        };

                        await fetch("/api/s3-delete", {
                            method: "POST",
                            body: JSON.stringify(bodyData),
                        })
                            .then((res) => res.json())
                            .then((res) =>
                                console.log("Delete image response: ", res),
                            )
                            .catch((err) =>
                                console.error("delete image error: ", err),
                            );

                        //router.reload();
                        //loadContent();
                        closePopup();
                    }
                    setLoadingUpload(false);
                });
            } else {
                let isSaved = await addContent(item).then((res) => res);
                if (isSaved) closePopup();
                setLoadingUpload(false);
            }
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
                    <>
                        <img
                            src={file ? URL.createObjectURL(file) : filePath}
                            alt="image to upload"
                            className="file-upload__preview-image"
                        />
                    </>
                )}
                <input
                    className="file-upload__file-input"
                    type="file"
                    multiple={false}
                    onChange={handleFileChange}
                    accept=".gif,.jpg,.jpeg,.png"
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
            {error && error !== "" && (
                <div
                    className="paddingTop centertext"
                    style={{ fontSize: ".8rem" }}
                >
                    <p>{error}</p>
                </div>
            )}
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
            <CropImagePopup file={temporaryFile} setFile={setFile} />
        </PopupWrapper>
    );
};

export default EditCardPopup;
