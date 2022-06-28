import React from "react";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import PopupWrapper from "./PopupWrapper";
import { getNftImage } from "../../lib/getNftImage";

interface Props {
    pageData: any;
    profilePic: any;
}

const FrenPopup: React.FC<Props> = ({ pageData, profilePic }) => {
    const { frenPopup, setFrenPopup, setTransferPopup } = usePopup();

    if (!pageData) return null;

    return (
        <PopupWrapper
            isOpen={frenPopup}
            closePopup={() => setFrenPopup(false)}
            size={"normal"}
            headerContent={""}
        >
            {profilePic ? (
                <>
                    {/*<a
                    href={profilePic?.permalink}
                    target="_blank"
                    rel="noreferrer"
                >*/}
                    <img
                        src={getNftImage(profilePic) ?? "/images/punk.png"}
                        className="profilepic noHover"
                        alt="Profile Picture"
                    />
                    {/**</a>>**/}
                </>
            ) : (
                <img
                    src={profilePic?.image_preview_url ?? "/images/punk.png"}
                    className="profilepic noHover"
                    style={{
                        cursor: profilePic ? "pointer" : "initial",
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
        </PopupWrapper>
    );
};

export default FrenPopup;
