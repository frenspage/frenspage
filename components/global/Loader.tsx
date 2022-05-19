import React, { FC, useState, useEffect } from "react";
import Layout from "./Layout";
import LoadingSpinner from "./LoadingSpinner";

interface Props {}

const Loader: FC<Props> = ({}) => {
    return (
        <Layout addClass="root-user">
            <div id="loading" className="flex flex-column-center">
                <p className="marginBottom--big">gm</p>
                <LoadingSpinner />
            </div>
        </Layout>
    );
};

export default Loader;
