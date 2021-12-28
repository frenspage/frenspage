import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/UserContext";
import TwitterAuthPopup from "./TwitterAuthPopup";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

interface Props {
    editProfilePic: any;
    ensSelectInput?: boolean;
    editUsername: string;
    editBiography: string;
    setEditBiography: (val: string) => void;
}

/*
EditProfilePopup is the popup that opens when the user clicks on his profile picture on his own page (or on the index page).

editProfilePic and editUsername are the names which are displayed in the popup, but which may not be saved yet. Maybe rename to "previewProfilePic"?
*/
const EditProfilePopup: React.FC<Props> = ({
    editProfilePic,
    ensSelectInput,
    editUsername,
    editBiography,
    setEditBiography,
}) => {
    const router = useRouter();
    const { Moralis } = useMoralis();
    const {
        user,
        ensDomain,
        saveEnsDomain,
        username,
        setPfp,
        page,
        setPage,
        twitter,
        setTwitter,
        saveProfile,
        biography,
        setBiography,
    } = useUser();
    const {
        showEditProfilePopup,
        setShowEditProfilePopup,
        setShowEditProfilePicPopup,
        setShowEditENSPopup,
        setShowFirstTimePopup,
        setTwitterAuthPopup,
    } = usePopup();

    const save = async () => {
        if (user) {
            let hasClaimed: boolean = user?.get("hasClaimed");

            await saveProfile(editProfilePic, editBiography)
                .then(() => {
                    if (!hasClaimed) {
                        setShowFirstTimePopup(true);
                    }
                    setShowEditProfilePopup(false);
                    user?.set("hasClaimed", true);
                    router.push(ensDomain?.name);
                })

                .catch((err: any) =>
                    console.error("saveProfile ERROR: ", err.message),
                );
        }
    };

    const removeTwitter = () => {
        setTwitter("");
    };

    return (
        <div
            id="editprofile"
            className={"popupbg" + (!showEditProfilePopup ? " hidden" : "")}
        >
            <div className="popup">
                <button
                    className="closepopup"
                    onClick={() => setShowEditProfilePopup(false)}
                    tabIndex={0}
                >
                    <span>&times;</span>
                </button>

                <img
                    src={
                        editProfilePic?.image_preview_url ?? "/images/punk.png"
                    }
                    className="profilepicselect myprofilepic"
                    onClick={() => setShowEditProfilePicPopup(true)}
                    alt="Profile Picture"
                    tabIndex={0}
                />

                <div
                    className={"ensselect ellipsis"}
                    onClick={() => setShowEditENSPopup(true)}
                    tabIndex={0}
                >
                    <div
                        id="ensname"
                        className={!ensSelectInput ? " dontdisplay" : ""}
                    />

                    <div
                        id="selectensname"
                        className={ensSelectInput ? " dontdisplay" : ""}
                    >
                        Select ENS name{" "}
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            style={{ fontSize: "1rem", height: "1rem" }}
                        />
                    </div>
                </div>

                <div
                    className={
                        "smallfont greyfont ellipsis" +
                        (ensSelectInput ? " hidden" : "")
                    }
                >
                    current username: {editUsername ?? username}
                </div>

                <div className="flex flex-column-center marginTop">
                    <textarea
                        name="biography"
                        className="textarea textarea--biography"
                        placeholder={
                            "your biography\n& your links\n200 chars & 4 rows max.\nno funny business ser"
                        }
                        value={editBiography}
                        rows={4}
                        maxLength={200}
                        cols={50}
                        wrap="hard"
                        onChange={(val) => setEditBiography(val.target.value)}
                    />
                </div>

                {!twitter && (
                    <div className="flex flex-column-center paddingTop">
                        <p className="smallfont">
                            Add{" "}
                            <FontAwesomeIcon
                                icon={faTwitter}
                                style={{
                                    fontSize: "1rem",
                                    height: "1rem",
                                    padding: "2px 2px 0 0",
                                    transform: "translateY(2px)",
                                }}
                            />
                            {""}
                            Twitter
                        </p>
                        <button
                            className="button addIcon marginTop"
                            onClick={() => setTwitterAuthPopup(true)}
                        >
                            +
                        </button>
                    </div>
                )}

                {twitter && (
                    <div className="paddingTop flex flex-center--horizontal flex-center--vertical">
                        <div
                            className={
                                "smallfont greyfont hover ellipsis cursor--pointer" +
                                (ensSelectInput ? " hidden" : "")
                            }
                            onClick={() => setTwitterAuthPopup(true)}
                            tabIndex={0}
                        >
                            twitter account: {twitter}
                        </div>
                        <span
                            tabIndex={0}
                            onClick={removeTwitter}
                            className="removeTwitter"
                        >
                            &times;
                        </span>
                    </div>
                )}

                <button
                    id="savesettings"
                    className="savebutton cansubmit button black"
                    onClick={() => save()}
                    tabIndex={0}
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        style={{ fontSize: "1rem", height: "1rem" }}
                    />
                </button>
            </div>
        </div>
    );
};
export default EditProfilePopup;
