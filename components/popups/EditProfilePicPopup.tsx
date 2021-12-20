import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

interface Props {
    setEditProfilePic: (val: boolean) => void;
}

const EditProfilePicPopup: React.FC<Props> = ({ setEditProfilePic }) => {
    const [nfts, setNfts] = useState<any>(null);
    const [currentSelected, setCurrentSelected] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showEditProfilePicPopup, setShowEditProfilePicPopup } = usePopup();
    const { user, Moralis } = useMoralis();

    const fetcher = async () => {
        if (user) {
            let ethAddress = user.get("ethAddress");
            const options = {
                method: "GET",
                headers: {
                    "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEEKEY + "",
                },
            };
            fetch(
                `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&order_direction=desc&offset=0&limit=50`,
                options,
            )
                .then((response) => response.json())
                .then((response) => {
                    setNfts(response);
                })
                .catch((err) => console.error(err));
        }
    };
    useEffect(() => {
        if (user) fetcher().then(() => setIsLoading(false));
    }, [user, Moralis.Web3API.account]);

    const changeProfilePic = (data: any) => {
        if (!data) return;

        setEditProfilePic(data);
        setShowEditProfilePicPopup(false);
    };

    return (
        <div
            id="profilepicselect_popup"
            className={"popupbg" + (!showEditProfilePicPopup ? " hidden" : "")}
        >
            <div className="bigpopup">
                <div className="content">
                    <div
                        className="closepopup"
                        onClick={() => setShowEditProfilePicPopup(false)}
                    >
                        <span>&times;</span>
                    </div>

                    <h1>Select your pfp</h1>

                    <h4>(Can be changed later)</h4>

                    {isLoading && (
                        <div id="profilepicselect_nfts_loading">
                            <div className="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    )}

                    {!isLoading && nfts?.assets && nfts.assets.length > 0 ? (
                        <div className="profilepicselect_nfts">
                            <div className="content flex flex--gap--big paddingTop--big">
                                {nfts.assets?.map((nft: any, index: number) => {
                                    return (
                                        <div
                                            className="pfp__nft grid__item"
                                            key={`nft__${index}`}
                                        >
                                            <img
                                                src={
                                                    nft?.image_preview_url ?? ""
                                                }
                                                alt=""
                                                className={
                                                    "pfp__nft__image hover" +
                                                    (currentSelected &&
                                                    currentSelected?.name ===
                                                        nft?.name
                                                        ? " active"
                                                        : "")
                                                }
                                                onClick={() => {
                                                    changeProfilePic(nft);
                                                }}
                                            />
                                            <h3 className="pfp__nft__title">
                                                {nft?.name ?? ""}
                                            </h3>
                                            <a
                                                href={nft.permalink ?? ""}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pfp__nft__permalink"
                                            >
                                                <span className="c--grey">
                                                    {
                                                        nft?.asset_contract
                                                            ?.address
                                                    }
                                                </span>
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="paddingTop--big">
                            It seems that u don't have any nfts yet.
                        </div>
                    )}

                    {/** <div
                        id="savepfp"
                        className={
                            "savebutton" + (currentSelected ? " cansubmit" : "")
                        }
                        data-onclick="choosePFP();"
                        onClick={() => {
                            if (currentSelected)
                                changeProfilePic(currentSelected);
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSave}
                            style={{ fontSize: "1rem", height: "1rem" }}
                        />
                    </div>**/}
                </div>
            </div>
        </div>
    );
};

export default EditProfilePicPopup;
