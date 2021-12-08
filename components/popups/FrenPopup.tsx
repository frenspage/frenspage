import React from "react";
import { usePopup } from "../../context/PopupContext";
import { useMoralis } from "react-moralis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

interface Props {
    pageData: any;
    profilePic: any;
}


const sendDonation = async () => {
    /*
    @DANIEL PLEASE FIX THIS AND TEST IT
    IT SHOULD OPEN A METAMASK TRANSACTION FOR 0.1 ETH

    let userethaddress = pageData?.owner.get(ethAdress);
    console.log(pageData?.owner);

    const options = {type: "native", amount: Moralis.Units.ETH("0.1"), receiver: "0x.."}
    let result = await Moralis.transfer(options)*/
}

const FrenPopup: React.FC<Props> = ({ pageData, profilePic }) => {
    const { frenPopup, setFrenPopup } = usePopup();

    /* @DANIEL PLEASE RETRIEVE THE OWNER OF THE PAGE HERE AND GRAB HIS ETHADDRESS SO WE CAN ADD THE DONATION THROUGH THE FUNCTION ABOVE" */


    if (!pageData) return null;

    return (
        <div className={"popupbg" + (!frenPopup ? " hidden" : "")}>
            <div className="popup flex flex-direction--column flex-center--vertical">
                <div className="closepopup" onClick={() => setFrenPopup(false)}>
                    <span>&times;</span>
                </div>
                    <a
                        href="" /*@DANIEL LINK TO NFT ON OPENSEA*/
                        target="_blank"
                    >
                    <img
                        src={profilePic?.image_preview_url ?? "/images/punk.png"}
                        className="profilepic"
                        alt="Profile Picture"
                    />
                    </a>
                <br />
                <div className="gm paddingTop paddingBottom">
                    <a
                        href=""/*@DANIEL LINK TO ENS DOMAIN ON OPENSEA*/
                        target="_blank"
                        className="ethname"
                    >
                        <h3>{pageData?.get("slug")}</h3> 
                    </a>

                    <a
                    className="centertext smallfont greyfont ethname"
                    href={"https://etherscan.io/address/"}
                    target="_blank" /*@DANIEL SHOW WALLET ADDRESS CORRECTLY AND CENTERED BELOW*/
                    >
                    0x{pageData?.get("ethAddress")} <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                    
                </div>
                <br />
                <button 
                className="sharebutton"
                /*onClick={sendDonation()}*/
                >
                    Send donation <FontAwesomeIcon icon={faEthereum} />
                </button>
            </div>
        </div>
    );
};

export default FrenPopup;
