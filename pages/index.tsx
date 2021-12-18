import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import UserLoggedIn from "../components/user/UserLoggedIn";
import Loader from "../components/global/Loader";
import { faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/UserContext";

const Home: NextPage = () => {
    const router = useRouter();
    const { isInitialized } = useMoralis();
    const { user, ensDomain, isAuthenticated, authenticate } = useUser();
    const [loadBeforeRedirect, setLoadBeforeRedirect] = useState(false);

    useEffect(() => {
        if (user && ensDomain) {
            setTimeout(() => {
                setLoadBeforeRedirect(false);
                router.push("/" + ensDomain);
            }, 1000);
        }
    }, [user, ensDomain]);

    if (!isInitialized) return <Loader />;

    if (!isAuthenticated)
        return (
            <Layout>
                <div className="container">
                    <div id="loggedoutcontent" className="content">
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
                                    onClick={authenticate}
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
            </Layout>
        );

    if (isAuthenticated && user)
        return <UserLoggedIn loadBeforeRedirect={loadBeforeRedirect} />;

    return (
        <Layout>
            <h1>Errorrrrrr sry fren</h1>
        </Layout>
    );
};

export default Home;
