import { decode, toUnicode, toASCII } from "punycode";
import Autolinker from "autolinker";

export const punify = (str: string) => {
    if (!str) return "";
    return toASCII(str);
};

export const depunify = (str: string) => {
    if (!str) return "";
    return decode(str);
};

export const punifyCode = (str: string) => {
    if (!str) return "";
    return toUnicode(str);
};

export const linkedText = (str: string) => {
    const replacedText = Autolinker.link(str);
    if (!str) return "";
    return replacedText.replaceAll("\n", "<br />");
};

export const breakText = (str: string) => {
    if (!str) return "";
    return str.replaceAll("\n", "<br />");
};

export const linkedTextWithoutBreak = (str: string) => {
    if (!str) return "";
    return Autolinker.link(str);
};

export const truncateText = (str: string) => {
    if (!str) return "";
    if (str.length < 200) return str;
    return str.substring(0, 250) + "... \n\n\n Read more\n";
};
