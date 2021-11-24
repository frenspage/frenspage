import type { NextPage } from "next";
import React, { useEffect } from "react";
import Layout from "../components/global/Layout";
import { loadFrens } from "../canvas/lib/frens";
import * as Moralis from "moralis";
const Home: NextPage = () => {
    useEffect(() => {
        loadFrens(Moralis);
    }, []);

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

            <div className="container">
                <div id="loggedoutcontent" className="content">
                    plz sign in to make page
                    <br />
                    <br />
                    <div
                        data-onClick="auth()"
                        className="connectwallet"
                        id="connectwallet"
                    >
                        Connect wallet
                    </div>
                </div>

                <div id="loggedincontent" className="content">
                    <div className="frenpage">
                        <div id="profilepicbox">
                            <div
                                id="profilepic"
                                className="myprofilepic"
                                data-onClick="showEditPopup();"
                            >
                                {" "}
                            </div>
                            <div
                                id="profilename"
                                className="username myprofilename"
                            >
                                {" "}
                            </div>
                        </div>
                    </div>

                    <div className="walletinfo" id="walletinfo">
                        <div id="connectedname"></div>
                        <div id="connectedwallet" data-onClick="disconnect();">
                            {" "}
                        </div>
                    </div>

                    <div id="editprofile" className="popupbg">
                        <div className="popup">
                            <div
                                className="closepopup"
                                data-onClick="closeEditProfile();"
                            >
                                X
                            </div>

                            <div
                                className="profilepicselect myprofilepic"
                                style={{
                                    backgroundImage: "url('/images/punk.png')",
                                }}
                                data-onClick="openProfilePicSelect();"
                            >
                                {" "}
                            </div>

                            <div
                                className="ensselect"
                                data-onClick="openENSSelect();"
                            >
                                Select your .eth name
                            </div>
                            <div className="smallfont greyfont">
                                username:<div className="username"></div>
                            </div>

                            <div
                                id="savesettings"
                                className="savebutton cansubmit"
                                data-onClick="saveProfile();"
                            >
                                Save
                            </div>
                        </div>
                    </div>

                    <div id="profilepicselect_popup" className="popupbg ">
                        <div className="bigpopup">
                            <div
                                className="closepopup"
                                data-onClick="closeProfilePicSelect();"
                            >
                                X
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
                                data-onClick="choosePFP();"
                            >
                                Save
                            </div>
                        </div>
                    </div>

                    <div id="ensselect_popup" className="popupbg ">
                        <div className="bigpopup">
                            <div
                                className="closepopup"
                                data-onClick="closeENSSelect();"
                            >
                                X
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
                                data-onClick="chooseENS();"
                            >
                                Save
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
