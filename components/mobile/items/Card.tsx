import React, { FC, useState, useEffect } from "react";
import { ICardProps } from "../../../types/types";

interface Props extends ICardProps {}

const Card: FC<Props> = (props) => {
    const { index, item, handleClick } = props;

    return (
        <div className="card__mobile" onClick={handleClick}>
            {item.content.path && (
                <img src={item.content.path} alt={item.content.caption ?? ""} />
            )}
            {item.content.caption && (
                <p className="centertext">{item.content.caption}</p>
            )}
        </div>
    );
};

export default Card;
