import React, { FC, useState, useEffect } from "react";
import Autolinker from "autolinker";
import { linkedText } from "../../lib/textLib";

interface Props {
    text: string;
    addClass?: string;
}

const NewLineText: FC<Props> = ({ text, addClass }) => {
    if (!text) return null;

    return (
        <p
            className={addClass}
            dangerouslySetInnerHTML={{ __html: linkedText(text) }}
        />
    );
};

export default NewLineText;
