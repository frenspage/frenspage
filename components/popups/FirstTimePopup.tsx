import React, { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
    faArrowRight,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

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
                    className="profilepicselect myprofilepic noHover"
                    alt="Profile Picture"
                />

                <div className="paddingTop paddingBottom">
                    <h2>gm {editUsername}</h2>
                </div>

                    {/* @DANIEL */}
                {true ? (
                   <div class="smallfont">
                       Bro, why don't you buy an <a href="https://ens.domains/" target="_blank"><b>ENS Domain</b></a> and set a proper username?
                   </div>
                ) : (
                    <div class="smallfont">
                        Nice <a href="https://ens.domains/" target="_blank"><b>ENS Domain</b></a> bro!
                    </div>
                )}
                <br />
                <hr className="smallhr"/>
                <br />
                <div className="smallfont">Here is your new frens page:</div>

                <a
                    onClick={(e: any) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                            process.env.NEXT_PUBLIC_URL +
                                window.location.pathname,
                        );
                        setShowTooltip(true);
                    }}
                    className={
                        "gm2 tooltip--copied" + (showTooltip ? " show" : "")
                    }
                >
                    {process.env.NEXT_PUBLIC_URL?.substring(
                        8,
                        process.env.NEXT_PUBLIC_URL.length,
                    ) + window.location.pathname}
                </a>

                <div className="gm3 paddingBottom">
                    <Link href="/">
                        <a
                            className="greyfont smallfont"
                            data-show-count="false"
                            href={
                                "https://etherscan.io/address/" +
                                user?.attributes?.ethAddress
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            wallet: {user?.attributes?.ethAddress}{" "}
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    </Link>
                </div>
                <br />
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
                        let text = "gm frens, just claimed my frens.page:";
                        let hashtags = "gmfrens";

                        if (window)
                            window.open(
                                `https://twitter.com/share?text=${text}&url=${url}`,
                                "_blank",
                            );
                    }}
                >
                    Tell your Twitter frens <FontAwesomeIcon icon={faTwitter} />
                </button>

                <br />
                <br />
                <h5>and put your link in your bio </h5>

                <div
                    className="savebutton cansubmit"
                    onClick={() => setShowFirstTimePopup(false)}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </div>
            </div>
        </div>
    );
};
export default FirstTimePopup;
