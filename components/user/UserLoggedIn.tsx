import React, { FC, useEffect, useState } from "react";
import Layout from "../global/Layout";
import Link from "next/link";
import EditProfilePopup from "../popups/EditProfilePopup";
import EditProfilePicPopup from "../popups/EditProfilePicPopup";
import EditENSPopup from "../popups/EditENSPopup";
import FirstTimePopup from "../popups/FirstTimePopup";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import PostitCanvas from "../canvas/PostitCanvas";
import { useRouter } from "next/router";
import Loader from "../global/Loader";
import { useUser } from "../../context/UserContext";
import TwitterAuthPopup from "../popups/TwitterAuthPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import NewLineText from "../global/NewLinetext";

interface Props {
    showCanvas?: boolean;
    loadBeforeRedirect?: boolean;
}

const UserLoggedIn: FC<Props> = ({
    showCanvas = false,
    loadBeforeRedirect = false,
}) => {
    const {
        user,
        username,
        pfp,
        setPfp,
        authenticate,
        disconnect,
        twitter,
        biography,
    } = useUser();

    const [editProfilePic, setEditProfilePic] = useState<any>(null); // this is the profile pic that is displayed in the preview/edit box
    const [editUsername, setEditUsername] = useState<any>(null); // this is the username that is displayed in the preview/edit box

    const { setShowEditProfilePopup } = usePopup();

    /**
     * Loads the page information from the DB
     * When there's no page saved in the DB with the given ens
     * this function will create a new page
     * --> for first time sign up --> page will be created
     */

    useEffect(() => {
        if (pfp) setEditProfilePic(pfp);
    }, [pfp, setPfp]);

    if (loadBeforeRedirect) return <Loader />;

    return (
        <Layout>
            <div className="container">
                <div id="loggedincontent" className="content">
                    <div className="frenpage user-container">
                        <div id="profilepicbox">
                            <img
                                src={
                                    pfp?.image_preview_url ?? "/images/punk.png"
                                }
                                className="profilepic myprofilepic"
                                onClick={() => setShowEditProfilePopup(true)}
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter")
                                        setShowEditProfilePopup(true);
                                }}
                            />
                            <br />
                            <div className="ellipsis flex flex-center--horizontal">
                                <h3 className="username profilename">
                                    {username}
                                </h3>
                            </div>
                            <div className="flex flex-column-center greyfont">
                                <div className="paddingBottom paddingTop">
                                    <NewLineText text={biography} />
                                </div>
                                <a
                                    href={`https://twitter.com/${twitter}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <button
                                        className="button addIcon tooltip--twitterName"
                                        data-name={twitter}
                                        tabIndex={0}
                                        style={{ lineHeight: "1rem" }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTwitter}
                                            style={{
                                                fontSize: "1.5rem",
                                                height: "1.5rem",
                                            }}
                                        />
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>

                    {user && (
                        <div className="walletinfo" tabIndex={0}>
                            <Link href={"/" + username}>
                                <a className="address">
                                    connected as {user?.get("ethAddress")}
                                </a>
                            </Link>
                            <div
                                className="disconnect"
                                onClick={() => disconnect()}
                            >
                                disconnect
                            </div>
                        </div>
                    )}

                    {!user && (
                        <div className="walletinfo" tabIndex={0}>
                            <div
                                className="address"
                                onClick={() => authenticate()}
                            >
                                connect wallet
                            </div>
                        </div>
                    )}

                    <EditProfilePopup
                        editProfilePic={editProfilePic}
                        editUsername={editUsername}
                    />

                    <EditProfilePicPopup
                        setEditProfilePic={setEditProfilePic}
                    />

                    <EditENSPopup setEditUsername={setEditUsername} />

                    <FirstTimePopup
                        editProfilePic={editProfilePic}
                        editUsername={editUsername}
                    />

                    <TwitterAuthPopup />
                </div>
            </div>
            {showCanvas && <PostitCanvas />}
        </Layout>
    );
};
export default UserLoggedIn;
