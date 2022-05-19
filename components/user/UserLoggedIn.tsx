import React, { FC, useEffect, useState } from "react";
import Layout from "../global/Layout";
import Link from "next/link";
import EditProfilePopup from "../popups/EditProfilePopup";
import EditProfilePicPopup from "../popups/EditProfilePicPopup";
import EditENSPopup from "../popups/EditENSPopup";
import FirstTimePopup from "../popups/FirstTimePopup";
import { usePopup } from "../../context/PopupContext";
import Loader from "../global/Loader";
import { useUser } from "../../context/UserContext";
import TwitterAuthPopup from "../popups/TwitterAuthPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import NewLineText from "../global/NewLinetext";
import dynamic from "next/dynamic";
import Hide from "../global/Hide";
import CardsRenderer from "../mobile/CardsRenderer";
import LoggedInCardsRenderer from "../mobile/LoggedInCardsRenderer";

const LoggedInCanvas = dynamic(() => import("../canvas/LoggedInCanvas"), {
    ssr: false,
});

interface Props {
    showCanvas?: boolean;
    loadBeforeRedirect?: boolean;
    page?: any;
}

const UserLoggedIn: FC<Props> = ({
    showCanvas = false,
    loadBeforeRedirect = false,
    page = null,
}) => {
    const {
        user,
        username,
        pfp,
        setPfp,
        page: userPage,
        authenticate,
        disconnect,
        twitter,
        biography,
    } = useUser();

    const [editProfilePic, setEditProfilePic] = useState<any>(null); // this is the profile pic that is displayed in the preview/edit box
    const [editUsername, setEditUsername] = useState<any>(null); // this is the username that is displayed in the preview/edit box
    const [editBiography, setEditBiography] = useState<string>(biography ?? ""); // this is the username that is displayed in the preview/edit box

    const { setShowEditProfilePopup } = usePopup();

    /** Canvas Active state **/

    /**
     * Loads the page information from the DB
     * When there's no page saved in the DB with the given ens
     * this function will create a new page
     * --> for first time sign up --> page will be created
     */

    useEffect(() => {
        if (pfp) setEditProfilePic(pfp);
    }, [pfp, setPfp]);

    useEffect(() => {
        if (biography) setEditBiography(biography);
    }, [biography]);

    if (loadBeforeRedirect) return <Loader />;

    return (
        <Layout addClass="root-user">
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
                            {(twitter || biography) && (
                                <div className="flex flex-column-center">
                                    {biography && (
                                        <div className="marginTop marginBottom greyfont centertext biography">
                                            <NewLineText
                                                text={biography}
                                                addClass="centertext"
                                            />
                                        </div>
                                    )}
                                    {twitter && (
                                        <a
                                            href={`https://twitter.com/${twitter}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={
                                                "button addIcon small tooltip--twitterName"
                                            }
                                            data-name={twitter}
                                        >
                                            <FontAwesomeIcon
                                                icon={faTwitter}
                                                style={{
                                                    fontSize: "1rem",
                                                    height: "1rem",
                                                }}
                                            />
                                        </a>
                                    )}
                                </div>
                            )}
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
                        editBiography={editBiography}
                        setEditBiography={setEditBiography}
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
            {showCanvas && (
                <Hide down={"phone"}>
                    <LoggedInCanvas loggedIn={true} page={page} />
                </Hide>
            )}
            {showCanvas && (
                <Hide up={"phone"}>
                    <LoggedInCardsRenderer loggedIn={true} />
                </Hide>
            )}
        </Layout>
    );
};
export default UserLoggedIn;
