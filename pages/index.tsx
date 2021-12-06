import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import UserLoggedIn from "../components/user/UserLoggedIn";

const Home: NextPage = () => {
    const router = useRouter();
    const {
        authenticate,
        isAuthenticated,
        user,
        isInitialized,
        Moralis,
        setUserData,
    } = useMoralis();
    const [userEns, setUserEns] = useState(user?.get("ensusername") ?? "");

    useEffect(() => {        
        if (user) {
            setUserEns(user?.get("ensusername"));
            if (!user.get("ensusername")) {
                let ens = user.get("username")?.toLowerCase();
                setUserData({ ensusername: ens });
            }
        }
    }, [user, Moralis.Web3API.account, isAuthenticated]);

    useEffect(() => {
        if (user && userEns) router.push("/" + userEns);
    }, [userEns, user]);

    if (!isInitialized)
        return (
            <Layout>
                <div id="loading">
                    <div className="lds-ellipsis">
                        gm<div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </Layout>
        );

    if (!isAuthenticated)
        return (
            <Layout>
                <div className="container">
                    <div id="loggedoutcontent" className="content">
                        plz sign in to make page
                        <br />
                        <br />
                        <button
                            className="connectwallet"
                            onClick={() => authenticate()}
                        >
                            Connect wallet
                        </button>
                    </div>
                </div>
            </Layout>
        );

    if (isAuthenticated && user)
        return <UserLoggedIn setRedirectName={setUserEns} />;

    return (
        <Layout>
            <h1>Error</h1>
        </Layout>
    );
};

export default Home;
