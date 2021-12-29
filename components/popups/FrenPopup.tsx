import React, { useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext";
import { useMoralis, useWeb3Transfer } from "react-moralis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Moralis from "moralis";
import send = Moralis.Push.send;

interface Props {
    pageData: any;
    profilePic: any;
}

const FrenPopup: React.FC<Props> = ({ pageData, profilePic }) => {
    const { frenPopup, setFrenPopup, setTransferPopup } = usePopup();

    if (!pageData) return null;

    return (
        <div className={"popupbg" + (!frenPopup ? " hidden" : "")}>
            <div className="popup">
                <button
                    className="closepopup"
                    onClick={() => setFrenPopup(false)}
                    tabIndex={0}
                >
                    <span>&times;</span>
                </button>
                <div
                    className="content flex flex-direction--column flex-center--vertical padding--none"
                    style={{ width: "100%" }}
                >
                    {profilePic ? (
                        <a
                            href={profilePic?.permalink}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src={
                                    profilePic?.image_preview_url ??
                                    "/images/punk.png"
                                }
                                className="profilepic"
                                alt="Profile Picture"
                            />
                        </a>
                    ) : (
                        <img
                            src={
                                profilePic?.image_preview_url ??
                                "/images/punk.png"
                            }
                            className="profilepic noHover"
                            style={{
                                cursor: profilePic?.image_preview_url
                                    ? "pointer"
                                    : "initial",
                            }}
                            alt="Profile Picture"
                        />
                    )}

                    <div className="gm paddingTop--big paddingBottom flex flex-column-center">
                        {pageData?.get("ensTokenId") ? (
                            <a
                                href={
                                    `https://opensea.io/assets/${process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS}/` +
                                    pageData?.get("ensTokenId")
                                }
                                target="_blank"
                                className="ethname"
                                rel="noreferrer"
                            >
                                <h3>{pageData?.get("slug")}</h3>
                            </a>
                        ) : (
                            <h3>{pageData?.get("slug")}</h3>
                        )}
                        {pageData?.get("ethAddress") && (
                            <a
                                className="centertext smallfont greyfont ethname marginTop"
                                href={
                                    "https://etherscan.io/address/" +
                                    pageData?.get("ethAddress")
                                }
                                rel="noreferrer"
                                target="_blank"
                            >
                                <span style={{ paddingRight: ".5rem" }}>
                                    {pageData?.get("ethAddress")}
                                </span>
                                <FontAwesomeIcon
                                    icon={faExternalLinkAlt}
                                    style={{ fontSize: "1rem", height: "1rem" }}
                                />
                            </a>
                        )}
                    </div>
                    <br />

                    <button
                        className="button black"
                        onClick={() => setTransferPopup(true)}
                    >
                        Send donation{" "}
                        <FontAwesomeIcon
                            icon={faEthereum}
                            style={{ fontSize: "1rem", height: "1rem" }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrenPopup;
