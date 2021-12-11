import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                alert("Failed to save pfp, with error code: " + error.message);
            });
    };

    const saveChangeENS = async () => {
        let data: any = ENS;
        if (!ENS) return;

        let PageObject = Moralis.Object.extend("Page");

        let checkUserHasPage = new Moralis.Query(PageObject);
        checkUserHasPage.equalTo("owner", user);
        checkUserHasPage.descending("createdAt");
        const userPage = await checkUserHasPage.first();

        if (userPage) {
            userPage.set("slug", ENS?.name);
            userPage.set("ensTokenId", ENS?.token_id ?? "");
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
            page.set("ensTokenId", ENS?.token_id ?? "");
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
        if (user) {
            let hasClaimed: boolean = user?.get("hasClaimed");

            saveChangeProfilePic()
                .then(() =>
                    saveChangeENS().then(() => {
                        /* @DANIEL - remove the true */
                        if (true || !hasClaimed) {
                            setShowFirstTimePopup(true);
                        }
                        setShowEditProfilePopup(false);
                        user?.set("hasClaimed", true);
                        router.push(ENS?.name);
                    }),
                )
                .catch((err: any) =>
                    console.error("saveProfile ERROR: ", err.message),
                );
        }
    };

    return (
        <div
            id="editprofile"
            className={"popupbg" + (!showEditProfilePopup ? " hidden" : "")}
        >
            <div className="popup">
                <div
                    className="closepopup"
                    onClick={() => setShowEditProfilePopup(false)}
                >
                    <span>&times;</span>
                </div>

                <img
                    src={
                        editProfilePic?.image_preview_url ?? "/images/punk.png"
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
                        Select ENS name <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                </div>

                <div
                    className={
                        "smallfont greyfont paddingTop" +
                        (ensSelectInput ? " hidden" : "")
                    }
                >
                    current username: {editUsername}
                </div>

                <div
                    id="savesettings"
                    className="savebutton cansubmit"
                    onClick={() => saveProfile()}
                >
                    <FontAwesomeIcon icon={faSave} />
                </div>
            </div>
        </div>
    );
};
export default EditProfilePopup;
