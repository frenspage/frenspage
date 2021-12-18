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

interface Props {
    showCanvas?: boolean;
    loadBeforeRedirect?: boolean;
}

const UserLoggedIn: FC<Props> = ({
    showCanvas = false,
    loadBeforeRedirect = false,
}) => {
    const router = useRouter();
    const {
        user,
        ensDomain,
        setEnsDomain,
        username,
        setUsername,
        pfp,
        setPfp,
        page,
        setPage,
        isAuthenticated,
        authenticate,
        saveEnsDomain,
    } = useUser();

    const [editProfilePic, setEditProfilePic] = useState<any>(null); // this is the profile pic that is displayed in the preview/edit box
    const [editUsername, setEditUsername] = useState<any>(null); // this is the username that is displayed in the preview/edit box

    const { setShowEditProfilePopup } = usePopup();

    const { logout, Moralis, setUserData } = useMoralis();

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
                        setPfp(response);
                        setEditProfilePic(response);
                    })
                    .catch((err) => console.error(err));
            } else {
                //console.log("No PFP yet");
            }
        }
    };

    /**
     * Loads the page information from the DB
     * When there's no page saved in the DB with the given ens
     * this function will create a new page
     * --> for first time sign up --> page will be created
     */
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
                saveEnsDomain(object.get("slug"), object);
            } else {
                let slug = user?.get("username").toLowerCase();
                let PageObject = Moralis.Object.extend("Page");
                let page = new PageObject();

                page.set("owner", user);
                page.set("slug", slug);
                page.set("ethAddress", user?.get("ethAddress"));
                page.save()
                    .then((res: any) => {
                        setPage(res);
                        saveEnsDomain(user?.get("username"), {
                            name: user?.get("username"),
                        });
                    })
                    .catch((error: any) => {
                        alert(
                            "Failed to create new page, with error code: " +
                                error.message,
                        );
                    });
            }
        }
    };

    useEffect(() => {
        if (user) loadPFP().then(() => loadPage().then(() => {}));
    }, [user, Moralis.Web3API.account]);

    const logoutUser = async () => {
        await logout();
        router.reload();
    };

    if (loadBeforeRedirect) return <Loader />;

    return (
        <Layout>
            <div className="container">
                <div id="loggedincontent" className="content">
                    <div className="frenpage">
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
                                onClick={() => logoutUser()}
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
                </div>
            </div>
            {showCanvas && <PostitCanvas />}
        </Layout>
    );
};
export default UserLoggedIn;
