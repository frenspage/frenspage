import { encode, decode, toUnicode, toASCII } from "punycode";

export const punify = (str: string) => {
    if (!str) return "";
    let punified = toASCII(str);
    let ens = punified;

    return ens;
};

export const depunify = (str: string) => {
    if (!str) return "";
    let depunified = decode(str);
    return depunified;
};

export const punifyCode = (str: string) => {
    if (!str) return "";
    let punified = toUnicode(str);
    return punified;
};
