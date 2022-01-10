import React, { FC, useRef, useEffect, useState } from "react";
import { Group, Image, Rect, Text } from "react-konva";
import { ICardProps } from "../../../types/types";

interface Props extends ICardProps {}

const TextCard: FC<Props> = (props) => {
    const {
        index,
        item,
        handleDragStart,
        handleDragEnd,
        handleClick,
        handleMouseLeave,
        handleMouseEnter,
        isUsersOwnPage,
    } = props;

    const textNode = useRef<any>(null);
    const [rectHeight, setRectHeight] = useState(200);

    return (
        <Group
            x={item.x}
            y={item.y}
            draggable={isUsersOwnPage}
            onDragStart={handleDragStart}
            onClick={handleClick}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            id={item.id}
            overflow={"hidden"}
            width={200}
            height={
                textNode?.current?._partialTextY
                    ? textNode?.current?._partialTextY + 24
                    : 200
            }
            cursor={"pointer"}
        >
            <Rect
                width={200}
                height={
                    textNode?.current?._partialTextY
                        ? textNode?.current?._partialTextY + 24
                        : 200
                }
                fill="#ffffff"
                rotation={item.rotation}
                shadowColor={"black"}
                cornerRadius={5}
                shadowBlur={item.isDragging ? 15 : 10}
                shadowOffset={{ x: 0, y: 0 }}
                shadowOpacity={item.isDragging ? 0.2 : 0.1}
            />
            <Text
                text={item.content.caption}
                fontSize={14}
                fontFamily={"OCR A Std"}
                align={"center"}
                offset={{ x: 0, y: 0 }}
                padding={8}
                width={200}
                ref={textNode}
            />
        </Group>
    );
};

export default TextCard;
