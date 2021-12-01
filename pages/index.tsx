import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import EditProfilePopup from "../components/popups/EditProfilePopup";
import EditProfilePicPopup from "../components/popups/EditProfilePicPopup";
import EditENSPopup from "../components/popups/EditENSPopup";
import { usePopup } from "../context/PopupContext";

const Home: NextPage = () => {
    const [profile, setProfile] = useState<any>(null);
    const [page, setPage] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [profilePic, setProfilePic] = useState<any>(null);
    const [editProfilePic, setEditProfilePic] = useState<any>(null); // this is the profile pic that is displayed in the preview/edit box

    const [ENS, setENS] = useState<any>(null); // this is the ENS domain OBJECT, here we may need to check if the user still owns the domain or check for the reverse record
    const [username, setUsername] = useState<any>(null); // this is the actual username, which can also be just a random string
    const [editUsername, setEditUsername] = useState<any>(null); // this is the username that is displayed in the preview/edit box

    const { setShowEditProfilePopup } = usePopup();

    const {
        authenticate,
        isAuthenticated,
        user,
        isInitialized,
        logout,
        Moralis,
    } = useMoralis();

    const loadPFP = async () => {
        if (user) {
            const PFP = Moralis.Object.extend("ProfilePic");
            const query = new Moralis.Query(PFP);
            query.equalTo("owner", user);
            query.descending("createdAt");
            const object = await query?.first();

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
                        setProfilePic(response);
                        setEditProfilePic(response);
                    })
                    .catch((err) => console.error(err));
            } else {
                console.log("No PFP yet");
            }
        }
    };

    const loadPage = async () => {
        if (user) {
            //const slug = user?.get("ensusername") ?? user?.get("username");

            const SlugObject = Moralis.Object.extend("Page");
            const query = new Moralis.Query(SlugObject);
            query.equalTo("owner", user);
            query.descending("createdAt");
            const object: any = await query.first();

            if (object) {
                setPage(object);
                loadENS(object.get("slug"), object);
            } else {
                loadENS(user?.get("username"), { name: user?.get("username") });
            }
        }
    };

    const loadENS = async (newName: string, newENS: any) => {
        let ensusername =
            newName ?? user?.get("ensusername") ?? user?.get("username");
        await setENS(newENS);
        await setUsername(ensusername);
        await setEditUsername(ensusername); //yes, for now, both values are the same, but this may change in the future
    };

    useEffect(() => {
        loadPFP().then(() => loadPage().then(() => setIsLoading(false)));
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
                            setENS={(val: any) => {
                                loadENS(val?.name, val);
                            }}
                            setProfilePic={setProfilePic}
                            editProfilePic={editProfilePic}
                            editUsername={editUsername}
                            setPage={setPage}
                        />

                        <EditProfilePicPopup
                            setEditProfilePic={setEditProfilePic}
                        />

                        <EditENSPopup
                            ENS={ENS}
                            setENS={setENS}
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
