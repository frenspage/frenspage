import React, { FC, useState, useEffect } from "react";
import Layout from "../components/global/Layout";
import Link from "next/link";

interface Props {}

const ErrorPage: FC<Props> = ({}) => {
    return (
        <Layout addClass="root-user centertext">
            <div>
                <h3>no fren here</h3>
                <br />
                <p>
                    <Link href="/">
                        <a>go back home</a>
                    </Link>
                </p>
            </div>
        </Layout>
    );
};

export default ErrorPage;
