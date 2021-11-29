import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import { INFT, INFTs } from "../types/types";
import EditProfilePopup from "../components/popups/EditProfilePopup";
import EditProfilePicPopup from "../components/popups/EditProfilePicPopup";
import EditENSPopup from "../components/popups/EditENSPopup";
import { createLogicalOr } from "typescript";
import { usePopup } from "../context/PopupContext";

const Home: NextPage = () => {
    const [ensSelectPopup, setEnsSelectPopup] = useState(false);
    const [profilePicPopup, setProfilePicPopup] = useState(false);
    const [allowPfpSubmit, setAllowPfpSubmit] = useState(false);
    const [nfts, setNfts] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [profilePic, setProfilePic] = useState<any>(null);
    const [editProfilePic, setEditProfilePic] = useState<any>(null); // this is the profile pic that is displayed in the preview/edit box

    const [ENS, setENS] = useState<any>(null); // this is the ENS domain, here we may need to check if the user still owns the domain or check for the reverse record
    const [username, setUsername] = useState<any>(null); // this is the actual username, which can also be just a random string
    const [editUsername, setEditUsername] = useState<any>(null); // this is the username that is displayed in the preview/edit box

    const { showEditProfilePopup, setShowEditProfilePopup } = usePopup();

    const {
        authenticate,
        isAuthenticated,
        user,
        isInitialized,
        logout,
        Moralis,
    } = useMoralis();

    useEffect(() => {}, [showEditProfilePopup]);

    const fetcher = async () => {
        if (user) {
            let ethAddress = "0x6871D1a603fEb9Cc2aA8213B9ab16B33e418cD8F"; //user.get("ethAddress");
            const options = { method: "GET" };
            fetch(
                `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&order_direction=desc&offset=0&limit=50`,
                options,
            )
                .then((response) => response.json())
                .then((response) => {
                    setNfts(response);

                    //console.log("opensea response:", response);
                    //console.log("Fetch response: ", response);

                    response.assets.forEach((element: any) => {
                        if (
                            process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS?.toLowerCase() ===
                            element.asset_contract.address?.toLowerCase()
                        ) {
                            console.log("ENS");
                        }
                    });
                })

                .catch((err) => console.error(err));
        }
    };

    const loadPFP = async () => {
        const PFP = Moralis.Object.extend("ProfilePic");
        const query = new Moralis.Query(PFP);
        query.equalTo("owner", user);
        query.descending("createdAt");
        const object = await query.first();

        if (object && object.isDataAvailable()) {
            let ta = object.get("token_address");
            let ti = object.get("token_id");
            const options = { method: "GET" };
            fetch(`https://api.opensea.io/api/v1/asset/${ta}/${ti}/`, options)
                .then((response) => response.json())
                .then((response) => {
                    console.log("Setting Profile Pic from DB");
                    console.log(response);
                    setProfile(response);
                    setProfilePic(response);
                    setEditProfilePic(response);
                    console.log("opensea response/profile:", response);
                })
                .catch((err) => console.error(err));
        } else {
            console.log("No PFP yet");
        }
    };

    const loadENS = async () => {
        setENS(user?.get("username"));
        setUsername(user?.get("username"));
        setEditUsername(user?.get("username")); //yes, for now, both values are the same, but this may change in the future
    };

    useEffect(() => {
        fetcher().then(() =>
            loadPFP().then(() => loadENS().then(() => setIsLoading(false))),
        );
    }, [user, Moralis.Web3API.account]);

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

    if (user)
        return (
            <Layout>
                <div className="container">
                    <div id="loggedincontent" className="content">
                        <div className="frenpage">
                            <div id="profilepicbox">
                                <img
                                    src={
                                        profilePic?.image_preview_url ??
                                        "/images/punk.png"
                                    }
                                    id="profilepic"
                                    className="myprofilepic"
                                    onClick={() =>
                                        setShowEditProfilePopup(true)
                                    }
                                />
                                <div
                                    id="profilename"
                                    className="username myprofilename"
                                >
                                    {username}
                                </div>
                            </div>
                        </div>

                        <div className="walletinfo" id="walletinfo">
                            <div id="connectedwallet" onClick={() => logout()}>
                                {username}
                            </div>
                        </div>

                        <EditProfilePopup
                            profilePic={profilePic}
                            ENS={ENS}
                            setProfilePic={setProfilePic}
                            editProfilePic={editProfilePic}
                            editUsername={editUsername}
                        />

                        <EditProfilePicPopup
                            setEditProfilePic={setEditProfilePic}
                            nfts={nfts}
                            allowPfpSubmit={allowPfpSubmit}
                        />

                        <EditENSPopup
                            nfts={nfts}
                            setEditUsername={setEditUsername}
                        />
                    </div>
                </div>
            </Layout>
        );

    return (
        <Layout>
            <h1>Error</h1>
        </Layout>
    );
};

export default Home;
