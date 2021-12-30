import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { initFrenCanvas, initLoggedInCanvas } from "../../canvas/main";

const LoggedInCanvas: NextPage = () => {
    useEffect(() => {
        initFrenCanvas().then(() => {
            console.log("*** INIT CANVAS ***");
        });
    }, []);

    return (
        <>
            <div id="main-canvas-container" className="canvas-container" />

            <button className="fab" id="fab">
                +
            </button>
        </>
    );
};
export default LoggedInCanvas;
