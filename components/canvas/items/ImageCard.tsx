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
        isUsersOwnPage,
    } = props;

    const textNode = useRef<any>(null);
    const imageNode = useRef<any>(null);

    const [rotation, setRotation] = useState(item.rotation);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [oldMousePosition, setOldMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const setFromEvent = (e: any) => {
            setOldMousePosition(mousePosition);
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (item.isDragging) {
                if (oldMousePosition.x > mousePosition.x) setRotation(3);
                else if (oldMousePosition.x < mousePosition.x) setRotation(-3);
                else setRotation(0);
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
            rotation={rotation}
            offset={{
                x: 100,
                y: (200 + textNode?.current?._partialTextY + 24) / 2,
            }}
        >
            <Rect
                width={200}
                height={200 + textNode?.current?._partialTextY + 24}
                fill="#ffffff"
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
