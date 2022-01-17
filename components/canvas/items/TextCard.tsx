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

    const [rotation, setRotation] = useState(item.rotation);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [oldMousePosition, setOldMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const setFromEvent = (e: any) => {
            setOldMousePosition(mousePosition);
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (item.isDragging) {
                if (oldMousePosition.x > mousePosition.x) setRotation(3);
                else setRotation(-3);
                item.rotation = rotation;
            }
        };
        window.addEventListener("mousemove", setFromEvent);

        return () => {
            window.removeEventListener("mousemove", setFromEvent);
        };
    }, [item.isDragging, mousePosition]);

    return (
        <Group
            x={(window.innerWidth * item.x) / 100}
            y={(window.innerHeight * item.y) / 100}
            draggable={isUsersOwnPage}
            onDragStart={handleDragStart}
            onClick={handleClick}
            onDragEnd={handleDragEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            id={item.id}
            overflow={"hidden"}
            width={200}
            height={textNode?.current?._partialTextY + 24}
            cursor={"pointer"}
            rotation={item.rotation}
            offset={{
                x: 100,
                y: (200 + textNode?.current?._partialTextY + 24) / 2,
            }}
        >
            <Rect
                width={200}
                height={
                    textNode?.current?._partialTextY
                        ? textNode?.current?._partialTextY + 24
                        : 200
                }
                fill="#ffffff"
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
