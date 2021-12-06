import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";

interface Props {
    editProfilePic: any;
    editUsername: string;
    setPage: (val: any) => void;
}

/*
FirstTimePopup is the popup that opens when the user saves his page for the first time, and thus claims his domain
*/
const FirstTimePopup: React.FC<Props> = ({
    editProfilePic,
    editUsername,
    setPage,
}) => {
    const router = useRouter();
    const { user, Moralis } = useMoralis();

    const { showFirstTimePopup, setShowFirstTimePopup } = usePopup();

    return (
        <div
            id="showfirsttime"
            className={"popupbg" + (!showFirstTimePopup ? " hidden" : "")}
        >
            <div className="popup">
                <img
                    src={
                        editProfilePic?.image_preview_url ?? "/images/punk.png"
                    }
                    className="profilepicselect myprofilepic"
                    alt="Profile Picture"
                />

                <div className="paddingTop">username: {editUsername}</div>

                <div
                    className="savebutton cansubmit"
                    onClick={() => setShowFirstTimePopup(false)}
                >
                    Close
                </div>
            </div>
        </div>
    );
};
export default FirstTimePopup;
