import React from "react";
import { useMoralis } from "react-moralis";

interface Props {
    showEditPopup: boolean;
    setShowEditPopup: (val: boolean) => void;
    profile: any;
    setProfilePicPopup: (val: boolean) => void;
    ensSelectPopup: boolean;
    setEnsSelectPopup: (val: boolean) => void;
}

const EditPopup: React.FC<Props> = ({
    showEditPopup,
    setShowEditPopup,
    profile,
    setProfilePicPopup,
    ensSelectPopup,
    setEnsSelectPopup,
}) => {
    const { user } = useMoralis();

    return (
        <div
            id="editprofile"
            className={"popupbg" + (!showEditPopup ? " hidden" : "")}
        >
            <div className="popup">
                <div
                    className="closepopup"
                    data-onclick="closeEditProfile();"
                    onClick={() => setShowEditPopup(false)}
                >
                    <span>&times;</span>
                </div>

                <img
                    src={profile?.image_preview_url ?? "/images/punk.png"}
                    className="profilepicselect myprofilepic"
                    onClick={() => setProfilePicPopup(true)}
                />

                <div
                    className={"ensselect" + (!ensSelectPopup ? " hidden" : "")}
                    onClick={() => setEnsSelectPopup(true)}
                >
                    Select your .eth name
                </div>
                <div className="smallfont greyfont paddingTop">
                    username: {user?.get("username")}
                </div>

                <div
                    id="savesettings"
                    className="savebutton cansubmit"
                    data-onclick="saveProfile();"
                >
                    Save
                </div>
            </div>
        </div>
    );
};
export default EditPopup;
