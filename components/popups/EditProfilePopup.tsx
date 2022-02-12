import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSave,
    faArrowRight,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/UserContext";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import PopupWrapper from "./PopupWrapper";

interface Props {
    editProfilePic: any;
    ensSelectInput?: boolean;
    editUsername: string;
    editBiography: string;
    setEditBiography: (val: string) => void;
}

/**
    EditProfilePopup is the popup that opens when the user clicks
    on his profile picture on his own page (or on the index page).

    editProfilePic and editUsername are the names which are displayed in the popup,
    but which may not be saved yet.
**/
const EditProfilePopup: React.FC<Props> = ({
    editProfilePic,
    ensSelectInput,
    editUsername,
    editBiography,
    setEditBiography,
}) => {
    const router = useRouter();
    const {
        user,
        ensDomain,
        username,
        twitter,
        setTwitter,
        saveProfile,
        deleteUser,
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

    const changeEditBiography = (text: string) => {
        if (text.split("\n").length <= 4) setEditBiography(text);
    };

    //if (!showEditProfilePopup) return null;

    return (
        <PopupWrapper
            isOpen={showEditProfilePopup}
            closePopup={() => setShowEditProfilePopup(false)}
            size={"small"}
            headerContent={""}
        >
            <img
                src={editProfilePic?.image_preview_url ?? "/images/punk.png"}
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
                        "put your gms\n& your links here\nmax 200 chars\n& 4 rows"
                    }
                    value={editBiography}
                    rows={4}
                    maxLength={200}
                    cols={50}
                    wrap="hard"
                    onChange={(val) => changeEditBiography(val.target.value)}
                />
            </div>

            {!twitter && (
                <div className="flex flex-column-center paddingTop">
                    <a
                        className="smallfont"
                        onClick={(evt) => {
                            evt.preventDefault();
                            setTwitterAuthPopup(true);
                        }}
                        tabIndex={0}
                    >
                        Add{" "}
                        <FontAwesomeIcon
                            icon={faTwitter}
                            style={{
                                fontSize: "1rem",
                                height: "1rem",
                                padding: "1px 2px 0 0",
                                transform: "translateY(1px)",
                            }}
                        />
                        {""}
                        Twitter{" "}
                    </a>
                </div>
            )}

            {twitter && (
                <div className="paddingTop flex flex-center--horizontal flex-center--vertical">
                    <div
                        className={
                            "smallfont hoverfont ellipsis cursor--pointer" +
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
                        className="removeTwitter hoverfont"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            style={{
                                fontSize: "1rem",
                                height: "1rem",
                            }}
                        />
                    </span>
                </div>
            )}

            <footer className="flex spaceBetween w-100 paddingTop--big">
                <button
                    className="button grey"
                    onClick={() => {
                        deleteUser();
                    }}
                >
                    <FontAwesomeIcon
                        icon={faTrash}
                        style={{
                            fontSize: "1rem",
                            height: "1rem",
                        }}
                    />
                </button>
                <button
                    className="button black"
                    onClick={() => save()}
                    tabIndex={0}
                >
                    <FontAwesomeIcon
                        icon={faSave}
                        style={{ fontSize: "1.4rem", height: "1.4rem" }}
                    />
                </button>
            </footer>
        </PopupWrapper>
    );
};
export default EditProfilePopup;
