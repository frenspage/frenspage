import type { NextPage } from "next";
import React, { useEffect } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Loader from "../components/global/Loader";
import { useUser } from "../context/UserContext";

const Home: NextPage = () => {
    const router = useRouter();
    const { isInitialized } = useMoralis();
    const { user, username, isAuthenticated, authenticate } = useUser();

    useEffect(() => {
        if (isAuthenticated && user && username && username !== "") {
            router.push("/" + username);
        }
    }, [user, username, isAuthenticated]);

    if (!isInitialized) return <Loader />;

    if (!isAuthenticated)
        return (
            <Layout showFooter={true}>
                <div className="container">
                    <div id="loggedoutcontent" className="content">
                        <div>
                            gm fren
                            <br />
                            <br /> plz sign in to your page
                            <br />
                            <br />
                            {
                                //@ts-ignore
                                window?.ethereum ? (
                                    <button
                                        className="connectwallet"
                                        onClick={() => authenticate()}
                                    >
                                        Connect wallet
                                    </button>
                                ) : (
                                    <div>
                                        <span>----</span>
                                        <p>no web3 wallet found</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </Layout>
        );

    if (isAuthenticated && user) return <Loader />;

    return (
        <Layout>
            <div className="container content">
                <h1>Errorrrrrr sry fren</h1>
            </div>
        </Layout>
    );
};

export default Home;
