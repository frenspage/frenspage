import React, { FC, useState, useEffect } from "react";
import Autolinker from "autolinker";

interface Props {
    text: string;
    addClass?: string;
}

const NewLineText: FC<Props> = ({ text, addClass }) => {
    if (!text) return null;

    const replacedText = Autolinker.link(text);
    const newText = replacedText.replaceAll("\n", "<br />");

    return (
        <p className={addClass} dangerouslySetInnerHTML={{ __html: newText }} />
    );
};

export default NewLineText;
