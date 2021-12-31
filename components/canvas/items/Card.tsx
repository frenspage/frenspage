import React, { FC, useState, useEffect } from "react";
import { Group, Text, Rect } from "react-konva";

interface Props {
    index: string | number;
    item: {
        id: string;
        x: number;
        y: number;
        rotation: number;
        isDragging: boolean;
        content: {
            title: string;
        };
    };
    handleDragStart: (e: any) => void;
    handleDragEnd: (e: any) => void;
    handleClick: (e: any) => void;
}

const Card: FC<Props> = ({
    index,
    item,
    handleDragStart,
    handleDragEnd,
    handleClick,
}) => {
    return (
        <Group
            x={item.x}
            y={item.y}
            draggable
            onDragStart={handleDragStart}
            onClick={handleClick}
            onDragEnd={handleDragEnd}
            id={item.id}
        >
            <Rect
                width={200}
                height={300}
                fill="#ffffff"
                rotation={item.rotation}
                shadowColor={"black"}
                shadowBlur={item.isDragging ? 15 : 3}
                shadowOffset={{ x: 0, y: 0 }}
                shadowOpacity={item.isDragging ? 0.2 : 0.4}
            />
            <Text
                text={item.content.title}
                fontSize={20}
                offset={{ x: -8, y: -8 }}
            />
            <Text
                text="Some text on canvas"
                fontSize={15}
                offset={{ x: -9, y: -8 - 24 }}
            />
        </Group>
    );
};

export default Card;
