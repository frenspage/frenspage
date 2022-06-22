import React from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

type size = "phone" | "tablet" | "desktop";
interface Props {
    down?: size;
    up?: size;
    children?: JSX.Element | JSX.Element[];
}

const Hide: React.FC<Props> = ({ down, up, children }) => {
    const { height, width } = useWindowDimensions();

    if (down && down === "phone" && width <= 720) {
        return null;
    }

    if (down && down === "tablet" && width <= 920) {
        return null;
    }

    if (up && up === "phone" && width >= 720) {
        return null;
    }

    if (up && up === "tablet" && width >= 920) {
        return null;
    }
    return <>{children}</>;
};
export default Hide;
