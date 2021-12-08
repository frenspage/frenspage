import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import UserLoggedIn from "../components/user/UserLoggedIn";
import Loader from "../components/global/Loader";
import { faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";

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
        
        if (user && userEns) {
            
            router.push("/" + userEns);
        }
    }, [userEns, user]);

    if (!isInitialized) return <Loader />;

    if (!isAuthenticated)
    
        return (
            <Layout>
                <div className="container">
                    <div id="loggedoutcontent" className="content">
                        gm fren<br /><br /> plz sign in to your page
                        <br />
                        <br />
                        <button
                            className="connectwallet"
                            onClick={() => authenticate({ signingMessage: "gm fren" })}
                        >
                            Connect wallet
                        </button>
                    </div>
                </div>
            </Layout>
        );

    if (isAuthenticated && user)
    
        return (
            <Layout addClass="root-user">
                {/*There was a gm in here, but I removed it? I think this part here does nothing? */}                
            </Layout>
        );
    //return <UserLoggedIn setRedirectName={setUserEns} />;

    return (
        <Layout>
            <h1>Errorrrrrr sry fren</h1>
        </Layout>
    );
};

export default Home;
