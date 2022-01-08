import React, { FC, useState, useEffect, useRef } from "react";
import { Group, Image, Rect, Text } from "react-konva";
import { ICardProps } from "../../../types/types";

interface Props extends ICardProps {
    file: any;
}

const ImageCard: FC<Props> = (props) => {
    const {
        index,
        item,
        handleDragStart,
        handleDragEnd,
        handleClick,
        handleMouseEnter,
        handleMouseLeave,
        file,
    } = props;

    const textNode = useRef<any>(null);
    const imageNode = useRef<any>(null);

    return (
        <Group
            x={item.x}
            y={item.y}
            draggable
            onDragStart={handleDragStart}
            onClick={handleClick}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            id={item.id}
            cursor={"pointer"}
        >
            <Rect
                width={200}
                height={200 + textNode?.current?._partialTextY + 24}
                fill="#ffffff"
                rotation={item.rotation}
                shadowColor={"black"}
                cornerRadius={5}
                shadowBlur={item.isDragging ? 15 : 10}
                shadowOffset={{ x: 0, y: 0 }}
                shadowOpacity={item.isDragging ? 0.2 : 0.1}
            />
            <Image image={file} offset={{ x: -8, y: -8 }} ref={imageNode} />
            <Text
                text={item.content.caption}
                width={200}
                fontSize={14}
                padding={8}
                fontFamily={"OCR A Std"}
                offset={{
                    x: 0,
                    y: -200,
                }}
                align={"center"}
                ref={textNode}
            />
        </Group>
    );
};

export default ImageCard;
