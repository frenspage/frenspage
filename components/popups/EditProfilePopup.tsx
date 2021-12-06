import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";

interface Props {
    profilePic: any;
    editProfilePic: any;
    ENS: any;
    setENS: (val: any) => void;
    setProfilePic: (val: string) => void;
    ensSelectInput?: boolean;
    editUsername: string;
    setPage: (val: any) => void;
}

/*
EditProfilePopup is the popup that opens when the user clicks on his profile picture on his own page (or on the index page).

editProfilePic and editUsername are the names which are displayed in the popup, but which may not be saved yet. Maybe rename to "previewProfilePic"?
*/
const EditProfilePopup: React.FC<Props> = ({
    profilePic,
    ENS,
    setENS,
    setProfilePic,
    editProfilePic,
    ensSelectInput,
    editUsername,
    setPage,
}) => {
    const router = useRouter();
    const { user, Moralis } = useMoralis();
    const {
        showEditProfilePopup,
        setShowEditProfilePopup,
        setShowEditProfilePicPopup,
        setShowEditENSPopup,
        setShowFirstTimePopup,
    } = usePopup();

    /** Save new Profile Pic to DB **/
    const saveChangeProfilePic = async () => {
        let data = editProfilePic;

        if (!data) return;

        let PFP = Moralis.Object.extend("ProfilePic");
        let pfp = new PFP();

        pfp.set("owner", user);
        pfp.set("token_address", data.asset_contract?.address);
        pfp.set("token_id", data.token_id);

        pfp.save()
            .then((res: any) => {
                setProfilePic(data);
            })
            .catch((error: any) => {
                alert(
                    "Failed to create new object, with error code: " +
                        error.message,
                );
            });
    };

    /**
     * Save new ENS to DB
     * If the page doesn't exist yet,
     * it will create a new page with the user.username id
     * **/
    const saveChangeENS = async () => {
        let data: any = ENS;
        if (!ENS || !user) return;

        let PageObject = Moralis.Object.extend("Page");

        let checkUserHasPage = new Moralis.Query(PageObject);
        checkUserHasPage.equalTo("owner", user);
        checkUserHasPage.descending("createdAt");
        const userPage = await checkUserHasPage.first();

        if (userPage) {
            userPage.set("slug", ENS?.name);
            userPage
                .save()
                .then(() => {
                    setPage(ENS);
                    setENS(ENS);
                })
                .catch((err: any) =>
                    console.error(
                        "Save new ens slug for page ERROR: ",
                        err.message,
                    ),
                );
        } else {
            let page = new PageObject();

            page.set("owner", user);
            page.set("slug", ENS?.name);
            page.save()
                .then(() => {
                    setPage(data);
                    setENS(ENS);
                })
                .catch((error: any) => {
                    alert(
                        "Failed to create new page, with error code: " +
                            error.message,
                    );
                });
        }
    };

    const saveProfile = () => {
        let hasClaimed: any = user?.get("hasClaimed");
        //console.log("hasClaimed: ", hasClaimed);

        saveChangeProfilePic()
            .then(() =>
                saveChangeENS().then(() => {
                    if (hasClaimed) {
                        setShowEditProfilePopup(false);
                    } else {
                        setShowFirstTimePopup(true);
                        setShowEditProfilePopup(false);
                        user?.set("hasClaimed", true);
                        router.push(ENS.name);
                    }
                }),
            )
            .catch((err: any) =>
                console.error("saveProfile ERROR: ", err.message),
            );
    };

    return (
        <div
            id="editprofile"
            className={"popupbg" + (!showEditProfilePopup ? " hidden" : "")}
        >
            <div className="popup">
                <div className="content">
                    <div
                        className="closepopup"
                        onClick={() => setShowEditProfilePopup(false)}
                    >
                        <span>&times;</span>
                    </div>

                    <img
                        src={
                            editProfilePic?.image_preview_url ??
                            "/images/punk.png"
                        }
                        className="profilepicselect myprofilepic"
                        onClick={() => setShowEditProfilePicPopup(true)}
                        alt="Profile Picture"
                    />

                    <div
                        className={"ensselect"}
                        onClick={() => setShowEditENSPopup(true)}
                    >
                        <div
                            id="ensname"
                            className={!ensSelectInput ? " dontdisplay" : ""}
                        />

                        <div
                            id="selectensname"
                            className={ensSelectInput ? " dontdisplay" : ""}
                        >
                            Select ENS name
                        </div>
                    </div>

                    <div
                        className={
                            "hoverfont smallfont greyfont paddingTop" +
                            (ensSelectInput ? " hidden" : "")
                        }
                        onClick={() => setShowEditENSPopup(true)}
                    >
                        username: {editUsername}
                    </div>

                    <div
                        id="savesettings"
                        className="savebutton cansubmit"
                        onClick={() => saveProfile()}
                    >
                        Save
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EditProfilePopup;
