import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";

const Home: NextPage = () => {
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [ensSelectPopup, setEnsSelectPopup] = useState(false);
    const [profilePicPopup, setProfilePicPopup] = useState(false);

    const {
        authenticate,
        isAuthenticated,
        user,
        isInitialized,
        logout,
        isAuthenticating,
    } = useMoralis();

    useEffect(() => {
        console.log("isInitialized", isInitialized);
        console.log("isAuthenticated", isAuthenticated);
    }, [isInitialized, isAuthenticated]);

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
                                <div
                                    id="profilepic"
                                    className="myprofilepic"
                                    onClick={() => setShowEditPopup(true)}
                                >
                                    {" "}
                                </div>
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

                                <div
                                    className="profilepicselect myprofilepic"
                                    style={{
                                        backgroundImage:
                                            "url('/images/punk.png')",
                                    }}
                                    onClick={() => setProfilePicPopup(true)}
                                >
                                    {" "}
                                </div>

                                <div
                                    className={
                                        "ensselect" +
                                        (!ensSelectPopup ? " hidden" : "")
                                    }
                                    onClick={() => setEnsSelectPopup(true)}
                                >
                                    Select your .eth name
                                </div>
                                <div className="smallfont greyfont">
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
                                <div
                                    className="closepopup"
                                    onClick={() => setProfilePicPopup(false)}
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

                                <div id="profilepicselect_nfts"></div>

                                <div className="clearfix"></div>

                                <div
                                    id="savepfp"
                                    className="savebutton"
                                    data-onclick="choosePFP();"
                                    onClick={() => setProfilePicPopup(false)}
                                >
                                    Save
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
