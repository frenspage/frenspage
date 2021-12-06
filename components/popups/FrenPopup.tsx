import React from "react";
import { usePopup } from "../../context/PopupContext";

interface Props {
    pageData: any;
    profilePic: any;
}

const FrenPopup: React.FC<Props> = ({ pageData, profilePic }) => {
    const { frenPopup, setFrenPopup } = usePopup();
    console.log(pageData);

    if (!pageData) return null;

    return (
        <div className={"popupbg" + (!frenPopup ? " hidden" : "")}>
            <div className="popup flex flex-direction--column flex-center--vertical">
                <div className="closepopup" onClick={() => setFrenPopup(false)}>
                    <span>&times;</span>
                </div>
                <img
                    src={profilePic?.image_preview_url ?? "/images/punk.png"}
                    className="profilepicselect myprofilepic"
                    alt="Profile Picture"
                />
                <div className="gm paddingTop paddingBottom">
                    <h2>{pageData?.get("slug")}</h2>
                </div>
                <button className="sharebutton">Send donation</button>
            </div>
        </div>
    );
};

export default FrenPopup;
