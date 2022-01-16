import Autolinker from "autolinker";

export const linkedText = (text: string) => {
    const replacedText = Autolinker.link(text);
    return replacedText.replaceAll("\n", "<br />");
};

export const linkedTextWithoutBreak = (text: string) => {
    return Autolinker.link(text);
};
