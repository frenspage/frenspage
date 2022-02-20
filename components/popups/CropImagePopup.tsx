import React, { FC, useState, useEffect, useCallback } from "react";
import PopupWrapper from "./PopupWrapper";
import { usePopup } from "../../context/PopupContext";
import Cropper from "react-easy-crop";
import { Point } from "react-easy-crop/types";
import getCroppedImg, { blobToFile, urlToFile } from "../../lib/cropImage";

interface Props {
    file: any;
    setFile: (val: any) => void;
}

const CropImagePopup: FC<Props> = ({ file, setFile }) => {
    const { cropImagePopup, setCropImagePopup } = usePopup();
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uncroppedImage, setUncroppedImage] = useState(file);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [editedImage, setEditedImage] = useState<any>(null);

    useEffect(() => {
        if (!editedImage) setUncroppedImage(file);
    }, [file, setFile]);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const save = async () => {
        if (uncroppedImage) {
            try {
                const croppedImage: any = await getCroppedImg(
                    URL.createObjectURL(uncroppedImage),
                    uncroppedImage.type + "",
                    croppedAreaPixels,
                    0,
                );

                const newCroppedFile = await urlToFile(
                    croppedImage,
                    uncroppedImage.name,
                    uncroppedImage.type,
                ).then((file: any) => {
                    return file;
                });

                setEditedImage(newCroppedFile);
                setFile(newCroppedFile);
                setCropImagePopup(false);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <PopupWrapper
            isOpen={cropImagePopup}
            closePopup={() => setCropImagePopup(false)}
            size={"small"}
            headerContent={""}
            addClassBg="border-radius"
        >
            {uncroppedImage && (
                <div
                    className="relative marginTop--l marginBottom--l"
                    style={{
                        height: "300px",
                        width: "100%",
                        aspectRatio: "1 / 1",
                    }}
                >
                    <Cropper
                        image={URL.createObjectURL(uncroppedImage)}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
            )}
            <button className="button black" onClick={save} tabIndex={0}>
                Save
            </button>
        </PopupWrapper>
    );
};

export default CropImagePopup;
