import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { initLoggedInCanvas } from "../../canvas/main";

const LoggedInCanvas: NextPage = () => {
    useEffect(() => {
        initLoggedInCanvas().then(() => {
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
