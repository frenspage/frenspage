import React, { FC, useState, useEffect } from "react";

interface Props {
    text: string;
}

const NewLineText: FC<Props> = ({ text }) => {
    if (!text) return null;
    const newText = text
        .split("\n")
        .map((str, index) => <p key={`biography_line_${index}`}>{str}</p>);
    return <>{newText}</>;
};

export default NewLineText;
