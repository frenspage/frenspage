import { useState, useEffect } from "react";

function getWindowDimensions() {
    let width = window?.innerWidth ?? 0;
    let height = window?.innerHeight ?? 0;

    return {
        width,
        height,
    };
}

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        setWindowDimensions(getWindowDimensions);

        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}
