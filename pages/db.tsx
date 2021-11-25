import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect } from "react";
import Layout from "../components/global/Layout";
import { useMoralis, useMoralisQuery } from "react-moralis";

const UserPage: NextPage = () => {
    const { data, error, isLoading } = useMoralisQuery("_EthAddress");

    if (isLoading)
        return (
            <Layout>
                <h1 className="center">Loading...</h1>
            </Layout>
        );

    if (error) {
        console.error("Error:", error);
        return (
            <Layout>
                <h1 className="center">Error</h1>
                <p>Check console for details</p>
            </Layout>
        );
    }

    console.log("Data:", data);

    return <Layout></Layout>;
};

export default UserPage;
