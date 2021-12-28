import React, { FC, useState, useEffect } from "react";

interface Props {
    text: string;
    addClass?: string;
}

const NewLineText: FC<Props> = ({ text, addClass }) => {
    if (!text) return null;

    let replacedText, replacePattern1, replacePattern2, replacePattern3;

    // URLs starting with http://, https://, or ftp://
    replacePattern1 =
        /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = text.replace(
        replacePattern1,
        `<a href="$1" target="_blank">${"$1".replace("https://", "")}</a>`,
    );

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(
        replacePattern2,
        '$1<a href="http://$2" target="_blank">$2</a>',
    );

    // Change email addresses to mailto:: links.
    replacePattern3 =
        /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(
        replacePattern3,
        '<a href="mailto:$1">$1</a>',
    );

    if (replacedText) {
        const newText = replacedText
            .split("\n")
            .map((str, index) => (
                <p
                    key={`biography_line_${index}`}
                    className={addClass}
                    dangerouslySetInnerHTML={{ __html: str }}
                />
            ));
        return <>{newText}</>;
    }

    return <>{text}</>;
};

export default NewLineText;
