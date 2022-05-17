import React, { FC, useState, useEffect } from "react";
import { Group, Text, Rect, Image } from "react-konva";
import { ICardProps } from "../../../types/types";
import ImageCard from "./ImageCard";
import TextCard from "./TextCard";
import { usePageContent } from "../../../context/PageContentContext";

interface Props extends ICardProps {}

const Card: FC<Props> = (props) => {
    const { item, cards } = props;

    const [file, setFile] = useState<any>();

    useEffect(() => {
        loadFile();
    }, [cards]);

    const loadFile = () => {
        if (item.content.path) {
            let tempFile = new window.Image(184, 184);

            tempFile.src = item.content.path;
            tempFile.addEventListener("load", () => setFile(tempFile));
        }
    };

    if (item.content.path) return <ImageCard {...props} file={file} />;
    return <TextCard {...props} />;
};

export default Card;
