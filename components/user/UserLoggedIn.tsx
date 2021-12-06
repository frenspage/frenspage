import React, { FC, useEffect, useState } from "react";
import Layout from "../global/Layout";
import EditProfilePopup from "../popups/EditProfilePopup";
import EditProfilePicPopup from "../popups/EditProfilePicPopup";
import EditENSPopup from "../popups/EditENSPopup";
import FirstTimePopup from "../popups/FirstTimePopup";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import PostitCanvas from "../canvas/PostitCanvas";
import { useRouter } from "next/router";

interface Props {
    showCanvas?: boolean;
    setRedirectName?: (val: string) => void;
}

const UserLoggedIn: FC<Props> = ({
    showCanvas = false,
    setRedirectName = () => null,
}) => {
    const router = useRouter();
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
        setUserData,
    } = useMoralis();

    const [disconnectIsShown, setDisconnectIsShown] = useState(false);

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
                loadENS(object.get("slug"), object);
            } else {
                let slug = user?.get("username").toLowerCase();
                let PageObject = Moralis.Object.extend("Page");
                let page = new PageObject();

                page.set("owner", user);
                page.set("slug", slug);
                page.save()
                    .then((res: any) => {
                        setPage(res);
                        loadENS(user?.get("username"), {
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

    const loadENS = async (newName: string, newENS: any) => {
        let ensusername =
            newName?.toLowerCase() ??
            user?.get("ensusername") ??
            user?.get("username");
        await setENS(newENS);

        setUserData({ ensusername: ensusername.toLowerCase() });

        await setUsername(ensusername);
        await setEditUsername(ensusername); //yes, for now, both values are the same, but this may change in the future
        await setRedirectName(ensusername);
    };

    useEffect(() => {
        if (user)
            loadPFP().then(() => loadPage().then(() => setIsLoading(false)));
    }, [user, Moralis.Web3API.account]);

    const logoutUser = async () => {
        await logout();
        router.push("/");
    };

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
                        <div
                            id="connectedwallet"
                            onClick={logoutUser}
                            onMouseEnter={() => setDisconnectIsShown(true)}
                            onMouseLeave={() => setDisconnectIsShown(false)}
                        >
                            <div>
                                {disconnectIsShown ? "disconnect" : username}
                            </div>
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

                    <FirstTimePopup
                        editProfilePic={editProfilePic}
                        editUsername={editUsername}
                        setPage={setPage}
                    />
                </div>
            </div>
            {showCanvas && <PostitCanvas />}
        </Layout>
    );
};
export default UserLoggedIn;
