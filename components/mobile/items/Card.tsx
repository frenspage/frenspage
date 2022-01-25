import React, { FC } from "react";
import { ICardProps } from "../../../types/types";
import { truncateText, breakText } from "../../../lib/textLib";

interface Props extends ICardProps {}

const Card: FC<Props> = (props) => {
    const { item, handleClick } = props;

    return (
        <div className="card__mobile" onClick={handleClick}>
            {item.content.path && (
                <img src={item.content.path} alt={item.content.caption ?? ""} />
            )}
            {item.content.caption && (
                <p
                    className="centertext"
                    dangerouslySetInnerHTML={{
                        __html: breakText(truncateText(item.content.caption)),
                    }}
                />
            )}
        </div>
    );
};

export default Card;
