import React, { FC, useState, useEffect } from "react";
import Layout from "./Layout";

interface Props {}

const Loader: FC<Props> = ({}) => {
    return (
        <Layout addClass="root-user">
            <div id="loading">
                <div className="lds-ellipsis">
                    gm
                    <div />
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </Layout>
    );
};

export default Loader;
