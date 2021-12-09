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
    const [transferMessage, setTransferMessage] = useState("");
    const { frenPopup, setFrenPopup } = usePopup();
    const { Moralis } = useMoralis();
    const {
        web3,
        enableWeb3,
        isWeb3Enabled,
        isWeb3EnableLoading,
        web3EnableError,
    } = useMoralis();

    const {
        fetch: transfer,
        error,
        isFetching,
    } = useWeb3Transfer({
        amount: Moralis.Units.ETH(0.1),
        receiver: pageData?.get("ethAddress"),
        type: "native",
    });

    const sendDonation = async () => {
        if (isWeb3Enabled) {
            await transfer().then((data: any) => {
                setTransferMessage(data?.message);
            });
        }
    };
    useEffect(() => {
        enableWeb3();
    }, []);

    if (!pageData) return null;

    return (
        <div className={"popupbg" + (!frenPopup ? " hidden" : "")}>
            <div className="popup flex flex-direction--column flex-center--vertical">
                <div className="closepopup" onClick={() => setFrenPopup(false)}>
                    <span>&times;</span>
                </div>
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
                            profilePic?.image_preview_url ?? "/images/punk.png"
                        }
                        className="profilepic"
                        alt="Profile Picture"
                    />
                )}

                <div className="gm paddingTop--big paddingBottom flex flex-column-center">
                    {pageData?.get("ensTokenId") ? (
                        <a
                            href={
                                "https://opensea.io/assets/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/" +
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
                            {pageData?.get("ethAddress")}{" "}
                            <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    )}
                </div>
                <br />
                {error && (
                    <div
                        style={{ textAlign: "center" }}
                        className="paddingBottom"
                    >
                        <p className="c--red">Error: {error?.message ?? ""}</p>
                    </div>
                )}
                {transferMessage && transferMessage !== "" && (
                    <div className="paddingBottom">
                        <p>{transferMessage}</p>
                    </div>
                )}
                <button
                    className="sharebutton"
                    onClick={() => sendDonation()}
                    disabled={isFetching}
                >
                    Send donation <FontAwesomeIcon icon={faEthereum} />
                </button>
            </div>
        </div>
    );
};

export default FrenPopup;
