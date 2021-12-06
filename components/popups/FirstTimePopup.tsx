import React, { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import Confetti from "react-confetti";

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
    const [showTooltip, setShowTooltip] = useState(false);

    const { showFirstTimePopup, setShowFirstTimePopup } = usePopup();

    useEffect(() => {
        let closeTooltip = setInterval(function () {
            if (showTooltip) {
                setShowTooltip(false);
            }
        }, 2000);

        return () => {
            clearInterval(closeTooltip);
        };
    }, [showTooltip, setShowTooltip]);

    return (
        <div
            id="showfirsttime"
            className={"popupbg" + (!showFirstTimePopup ? " hidden" : "")}
        >
            <Confetti
                width={window.innerWidth}
                height={300}
                tweenDuration={10000}
            />

            <div className="popup">
                <div
                    className="closepopup"
                    onClick={() => setShowFirstTimePopup(false)}
                >
                    <span>&times;</span>
                </div>
                <img
                    src={
                        editProfilePic?.image_preview_url ?? "/images/punk.png"
                    }
                    className="profilepicselect myprofilepic"
                    alt="Profile Picture"
                />

                <div className="gm paddingTop paddingBottom">
                    <h2>gm {editUsername}</h2>
                </div>

                <div className="smallfont">Here is your new frens page:</div>

                <div
                    className={
                        "gm2 tooltip--copied" + (showTooltip ? " show" : "")
                    }
                >
                    <a
                        onClick={(e: any) => {
                            e.preventDefault();
                            navigator.clipboard.writeText(
                                process.env.NEXT_PUBLIC_URL +
                                    window.location.pathname,
                            );
                            setShowTooltip(true);
                        }}
                        style={{ cursor: "copy" }}
                    >
                        {process.env.NEXT_PUBLIC_URL?.substring(
                            8,
                            process.env.NEXT_PUBLIC_URL.length,
                        ) + window.location.pathname}
                    </a>
                </div>

                <div className="gm3 paddingTop paddingBottom">
                    <Link href="/">
                        <a
                            className="greyfont smallfont"
                            data-show-count="false"
                        >
                            wallet: {user?.attributes?.ethAddress}
                        </a>
                    </Link>
                </div>

                <button
                    className="sharebutton twitter-share-button"
                    data-show-count="false"
                    style={{ cursor: "pointer" }}
                    onClick={(e: any) => {
                        e.preventDefault();
                        let url =
                            process.env.NEXT_PUBLIC_URL +
                            window.location.pathname +
                            "";
                        let text = "gm frens, just set up my frens page";
                        let hashtags = "gmfrens";

                        if (window)
                            window.open(
                                `https://twitter.com/share?text=${text}&url=${url}&hashtags=${hashtags}`,
                                "_blank",
                            );
                    }}
                >
                    Tell your Twitter frens <FontAwesomeIcon icon={faTwitter} />
                </button>

                <div
                    className="savebutton cansubmit"
                    onClick={() => setShowFirstTimePopup(false)}
                >
                    See <FontAwesomeIcon icon={faArrowRight} />
                </div>
            </div>
        </div>
    );
};
export default FirstTimePopup;
