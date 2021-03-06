import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import {
    faArrowRight,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";

import Confetti from "react-confetti";
import { useUser } from "../../context/UserContext";
import { getNftImage } from "../../lib/getNftImage";

interface Props {
    editProfilePic: any;
    editUsername: string;
}

/**
    FirstTimePopup is the popup that opens when the user saves his page for the first time,
    and thus claims his domain
**/
const FirstTimePopup: React.FC<Props> = ({ editProfilePic, editUsername }) => {
    const { user, ensDomain } = useUser();
    const { showFirstTimePopup, setShowFirstTimePopup } = usePopup();

    const [showTooltip, setShowTooltip] = useState(false);

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

    if (!user || !user?.get("hasClaimed")) return null;

    return (
        <div
            id="showfirsttime"
            className={"popupbg" + (!showFirstTimePopup ? " hidden" : "")}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowFirstTimePopup(false);
                }
            }}
        >
            <Confetti
                width={window.innerWidth}
                height={300}
                tweenDuration={10000}
            />

            <div className="popup">
                <header className="popup__header">
                    <button
                        className="closepopup"
                        onClick={() => setShowFirstTimePopup(false)}
                        tabIndex={0}
                    >
                        <span>&times;</span>
                    </button>{" "}
                </header>
                <div className="content">
                    <img
                        src={getNftImage(editProfilePic) ?? "/images/punk.png"}
                        className="profilepicselect myprofilepic noHover"
                        alt="Profile Picture"
                    />

                    <div className="paddingTop paddingBottom ellipsis">
                        <h2>gm {editUsername}</h2>
                    </div>

                    {ensDomain?.token_id && ensDomain?.token_id !== "" ? (
                        <div className="smallfont">
                            Nice{" "}
                            <a
                                href="https://ens.domains/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <b>ENS Domain</b>
                            </a>
                            , looks rare!
                        </div>
                    ) : (
                        <div className="smallfont">
                            Bro, why don't you buy an{" "}
                            <a
                                href="https://ens.domains/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <b>ENS Domain</b>
                            </a>{" "}
                            and set a proper username?
                        </div>
                    )}
                    <br />
                    <hr className="smallhr" />
                    <br />
                    <div className="smallfont">
                        Here is your new frens page:
                    </div>

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
                        <span className="ellipsis">
                            {process.env.NEXT_PUBLIC_URL?.substring(
                                8,
                                process.env.NEXT_PUBLIC_URL.length,
                            ) + window.location.pathname}
                        </span>
                    </a>

                    <div className="gm3 paddingBottom ellipsis">
                        <Link href="/">
                            <a
                                className="greyfont smallfont "
                                data-show-count="false"
                                href={
                                    "https://etherscan.io/address/" +
                                    user?.attributes?.ethAddress
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                wallet: {user?.attributes?.ethAddress}{" "}
                                <FontAwesomeIcon
                                    icon={faExternalLinkAlt}
                                    style={{ fontSize: "1rem", height: "1rem" }}
                                />
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
                        Tell your Twitter frens{" "}
                        <FontAwesomeIcon
                            icon={faTwitter}
                            style={{ fontSize: "1rem", height: "1rem" }}
                        />
                    </button>

                    <br />
                    <br />
                    <h5>and put your link in your bio </h5>

                    <div
                        className="savebutton cansubmit"
                        onClick={() => setShowFirstTimePopup(false)}
                    >
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            style={{ fontSize: "1rem", height: "1rem" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FirstTimePopup;
