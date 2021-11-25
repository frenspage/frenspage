import React, { useEffect, useState } from "react";
import { NextPage } from "next";

const PostitCanvas: NextPage = () => {
    return (
        <>
            <div id="main-canvas-container" className="canvas-container" />

            <button className="fab" id="fab">
                +
            </button>
        </>
    );
};
export default PostitCanvas;
