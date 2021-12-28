import React, { FC, useState, useEffect } from "react";

interface Props {
    text: string;
}

const NewLineText: FC<Props> = ({ text }) => {
    const newText = text
        .split("\n")
        .map((str, index) => <p key={`biography_line_${index}`}>{str}</p>);
    return <>{newText}</>;
};

export default NewLineText;
