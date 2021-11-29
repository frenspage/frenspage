import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";

interface Props {
    profilePic: any;
    editProfilePic: any;
    ENS: string;
    setProfilePic: (val: string) => void;
    ensSelectInput?: boolean;
    editUsername: string;
}

/*
EditProfilePopup is the popup that opens when the user clicks on his profile picture on his own page (or on the index page).

editProfilePic and editUsername are the names which are displayed in the popup, but which may not be saved yet. Maybe rename to "previewProfilePic"?
*/
const EditProfilePopup: React.FC<Props> = ({
    profilePic,
    ENS,
    setProfilePic,
    editProfilePic,
    ensSelectInput,
    editUsername,
}) => {
    const { user, Moralis } = useMoralis();
    const {
        showEditProfilePopup,
        setShowEditProfilePopup,
        setShowEditProfilePicPopup,
        setShowEditENSPopup,
    } = usePopup();

    const saveChangeProfilePic = () => {
        let data = profilePic;

        console.log("Saving new pfp");
        console.log(data);

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
                alert(
                    "Failed to create new object, with error code: " +
                        error.message,
                );
            });
    };

    const saveChangeENS = () => {
        console.log("Saving new pfp");

        if (!ENS || !user) return;

        user.set("ensusername", ENS);

        user.save().then(
            (ens) => {
                // Execute any logic that should take place after the object is saved.
                //document.querySelector('.username')?.innerHTML = profileENS + "";
                console.log("ENS SAVED");
            },
            (error) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                alert(
                    "Failed to create new object, with error code: " +
                        error.message,
                );
            },
        );
    };

    const saveProfile = () => {
        saveChangeProfilePic();
        saveChangeENS();
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
    );
};
export default EditProfilePopup;
