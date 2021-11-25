import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import { INFT, INFTs } from "../types/types";

const Home: NextPage = () => {
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [ensSelectPopup, setEnsSelectPopup] = useState(false);
    const [profilePicPopup, setProfilePicPopup] = useState(false);
    const [allowPfpSubmit, setAllowPfpSubmit] = useState(false);
    const [nfts, setNfts] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    const {
        authenticate,
        isAuthenticated,
        user,
        isInitialized,
        logout,
        isAuthenticating,
        web3,
        enableWeb3,
        isWeb3Enabled,
        isWeb3EnableLoading,
        web3EnableError,
        Moralis,
    } = useMoralis();

    useEffect(() => {
        const fetcher = async () => {
            if (user) {
                let ethAddress = user.get("ethAddress");
                const options = { method: "GET" };

                fetch(
                    `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&order_direction=desc&offset=0&limit=50`,
                    options,
                )
                    .then((response) => response.json())
                    .then((response) => {
                        setNfts(response);
                        //console.log("opensea response:", response);
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
                fetch(
                    `https://api.opensea.io/api/v1/asset/${ta}/${ti}/`,
                    options,
                )
                    .then((response) => response.json())
                    .then((response) => {
                        setProfile(response);
                        console.log("opensea response:", response);
                    })
                    .catch((err) => console.error(err));
            } else {
                console.log("No PFP yet");
            }
        };
        fetcher().then(() => loadPFP());
    }, [user, Moralis.Web3API.account]);

    const changeProfilePic = (data: any) => {
        console.log(data);
        if (!data) return;

        let PFP = Moralis.Object.extend("ProfilePic");
        let pfp = new PFP();

        pfp.set("owner", user);
        pfp.set("token_address", data.asset_contract?.address);
        pfp.set("token_id", data.token_id);

        pfp.save()
            .then((res: any) => {
                setProfile(data);
                setProfilePicPopup(false);
            })
            .catch((error: any) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                alert(
                    "Failed to create new object, with error code: " +
                        error.message,
                );
            });
    };

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
                                        profile?.image_preview_url ??
                                        "/images/punk.png"
                                    }
                                    id="profilepic"
                                    className="myprofilepic"
                                    onClick={() => setShowEditPopup(true)}
                                />
                                <div
                                    id="profilename"
                                    className="username myprofilename"
                                >
                                    {user?.get("username")}
                                </div>
                            </div>
                        </div>

                        <div className="walletinfo" id="walletinfo">
                            <div id="connectedwallet" onClick={() => logout()}>
                                {user.get("ethAddress")}
                            </div>
                        </div>

                        <div
                            id="editprofile"
                            className={
                                "popupbg" + (!showEditPopup ? " hidden" : "")
                            }
                        >
                            <div className="popup">
                                <div
                                    className="closepopup"
                                    data-onclick="closeEditProfile();"
                                    onClick={() => setShowEditPopup(false)}
                                >
                                    <span>&times;</span>
                                </div>

                                <img
                                    src={
                                        profile?.image_preview_url ??
                                        "/images/punk.png"
                                    }
                                    className="profilepicselect myprofilepic"
                                    onClick={() => setProfilePicPopup(true)}
                                />

                                <div
                                    className={
                                        "ensselect" +
                                        (!ensSelectPopup ? " hidden" : "")
                                    }
                                    onClick={() => setEnsSelectPopup(true)}
                                >
                                    Select your .eth name
                                </div>
                                <div className="smallfont greyfont paddingTop">
                                    username: {user?.get("username")}
                                </div>

                                <div
                                    id="savesettings"
                                    className="savebutton cansubmit"
                                    data-onclick="saveProfile();"
                                >
                                    Save
                                </div>
                            </div>
                        </div>

                        <div
                            id="profilepicselect_popup"
                            className={
                                "popupbg" + (!profilePicPopup ? " hidden" : "")
                            }
                        >
                            <div className="bigpopup">
                                <div className="content">
                                    <div
                                        className="closepopup"
                                        onClick={() =>
                                            setProfilePicPopup(false)
                                        }
                                    >
                                        <span>&times;</span>
                                    </div>

                                    <h1>Select your pfp</h1>
                                    <h4>Can be changed later</h4>

                                    <div id="profilepicselect_nfts_loading">
                                        <div className="lds-ellipsis">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                    </div>

                                    {nfts?.assets && nfts.assets.length > 0 ? (
                                        <div className="profilepicselect_nfts">
                                            <div className="content flex flex--gap--big paddingTop--big">
                                                {nfts.assets?.map(
                                                    (
                                                        nft: any,
                                                        index: number,
                                                    ) => {
                                                        return (
                                                            <div
                                                                className="pfp__nft grid__item"
                                                                key={`nft__${index}`}
                                                            >
                                                                <img
                                                                    src={
                                                                        nft?.image_preview_url ??
                                                                        ""
                                                                    }
                                                                    alt=""
                                                                    className="pfp__nft__image"
                                                                    onClick={() =>
                                                                        changeProfilePic(
                                                                            nft,
                                                                        )
                                                                    }
                                                                />
                                                                <h3 className="pfp__nft__title">
                                                                    {nft?.name ??
                                                                        ""}
                                                                </h3>
                                                                <a
                                                                    href={
                                                                        nft.permalink ??
                                                                        ""
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="pfp__nft__permalink"
                                                                >
                                                                    <span className="c--grey">
                                                                        {
                                                                            nft
                                                                                ?.asset_contract
                                                                                ?.address
                                                                        }
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="paddingTop--big">
                                            It seems that u don't have any nfts
                                            yet.
                                        </div>
                                    )}

                                    <div className="clearfix"></div>

                                    <div
                                        id="savepfp"
                                        className={
                                            "savebutton" +
                                            (allowPfpSubmit ? " allowed" : "")
                                        }
                                        data-onclick="choosePFP();"
                                        onClick={() => {
                                            if (allowPfpSubmit)
                                                setProfilePicPopup(false);
                                        }}
                                    >
                                        Save
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            id="ensselect_popup"
                            className={
                                "popupbg" + (!ensSelectPopup ? " hidden" : "")
                            }
                        >
                            <div className="bigpopup">
                                <div
                                    className="closepopup"
                                    onClick={() => setEnsSelectPopup(false)}
                                >
                                    <span>&times;</span>
                                </div>

                                <h1>Anon, select your .eth name</h1>
                                <h4>Can be changed later</h4>

                                <div id="ensselect_nfts_loading">
                                    <div className="lds-ellipsis">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>

                                <div id="ensselect"></div>

                                <div className="clearfix"></div>

                                <div
                                    id="saveens"
                                    className="savebutton"
                                    data-onclick="chooseENS();"
                                >
                                    Save
                                </div>
                            </div>
                        </div>
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
