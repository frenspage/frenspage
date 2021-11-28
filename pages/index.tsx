import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import { INFT, INFTs } from "../types/types";
import EditProfilePopup from "../components/popups/EditProfilePopup";
import EditProfilePicPopup from "../components/popups/EditProfilePicPopup";
import EditENSPopup from "../components/popups/EditENSPopup";
import { createLogicalOr } from "typescript";

const Home: NextPage = () => {
    const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);
    const [showEditProfilePicPopup, setShowEditProfilePicPopup] = useState(false);
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
    const [showEditENSPopup, setShowEditENSPopup] = useState<any>(null);

    const {
        authenticate,
        isAuthenticated,
        user,
        isInitialized,
        logout,
        Moralis,
    } = useMoralis();

    useEffect(() => {
    }, [showEditProfilePopup]);

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
                    console.log(response);
                    response.assets.forEach(element => {
                        console.dir(element);
                        console.dir(typeof element.asset_contract.address);
                        console.dir(typeof process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS);

                        if(process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS == element.asset_contract.address)
                        {
                            console.log("ENS");
                            console.log(element);
                            alert("wtf");
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

    const loadENS = async() =>{
        setENS(user?.get("username"));
        setUsername(user?.get("username"));
        setEditUsername(user?.get("username")); //yes, for now, both values are the same, but this may change in the future
    }

    useEffect(() => {
        fetcher().then(() => loadPFP().then(() => loadENS().then( () => setIsLoading(false))));
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
                                    onClick={() => setShowEditProfilePopup(true)}
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
                            Moralis = {Moralis}
                            showEditProfilePopup={showEditProfilePopup}
                            setShowEditProfilePopup={setShowEditProfilePopup}
                            showEditProfilePicPopup={showEditProfilePicPopup}
                            setShowEditProfilePicPopup={setShowEditProfilePicPopup}
                            profile={profile}
                            profilePic={profilePic}
                            setProfilePic={setProfilePic}
                            setProfilePicPopup={setProfilePicPopup}
                            ensSelectPopup={ensSelectPopup}
                            setEnsSelectPopup={setEnsSelectPopup}
                            editProfilePic={editProfilePic}
                            setEditProfilePic={setEditProfilePic}
                            showEditENSPopup={showEditENSPopup}
                            setShowEditENSPopup={setShowEditENSPopup}
                            editUsername={editUsername}
                            setEditUsername={setEditUsername}
                            username={username}
                            setUsername = {setUsername}
                        />

                        <EditProfilePicPopup
                            Moralis = {Moralis}
                            showEditProfilePopup={showEditProfilePopup}
                            setShowEditProfilePopup={setShowEditProfilePopup}
                            showEditProfilePicPopup={showEditProfilePicPopup}
                            setShowEditProfilePicPopup={setShowEditProfilePicPopup}
                            setProfilePic={setProfilePic}
                            editProfilePic={editProfilePic}
                            setEditProfilePic={setEditProfilePic}
                            setProfilePicPopup={setProfilePicPopup}
                            profile={profile}    
                            nfts={nfts}  
                            setProfile={setProfile}
                        />

                        <EditENSPopup
                            Moralis = {Moralis}
                            showEditProfilePopup={showEditProfilePopup}
                            showEditENSPopup={showEditENSPopup}
                            setShowEditENSPopup={setShowEditENSPopup}
                            profile={profile}    
                            nfts={nfts}  
                            ENS={ENS}
                            username={username}
                            editUsername={editUsername}
                            setUsername={setUsername}
                            setEditUsername={setEditUsername}
                            setENS = {setENS}
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
