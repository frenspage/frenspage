import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";

interface Props {
    allowPfpSubmit: boolean;
    setEditProfilePic: (val: boolean) => void;
}

const EditProfilePicPopup: React.FC<Props> = ({
    allowPfpSubmit,
    setEditProfilePic,
}) => {
    const [nfts, setNfts] = useState<any>(null);
    const [currentSelected, setCurrentSelected] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showEditProfilePicPopup, setShowEditProfilePicPopup } = usePopup();

    const { user, Moralis } = useMoralis();
    const fetcher = async () => {
        if (user) {
            let ethAddress = "0x80f0ae4e0b80544330Fc5257fc32c69A4dB6e630"; //"0x6871D1a603fEb9Cc2aA8213B9ab16B33e418cD8F"; //user.get("ethAddress"); //
            const options = {
                method: "GET",
                headers: {
                    "X-API-KEY": "8c7bf4fd89934d35a88dd6ecf44fe627",
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
        fetcher().then(() => setIsLoading(false));
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

                    <h4>Can be changed later</h4>

                    <div id="profilepicselect_nfts_loading">
                        <div className="lds-ellipsis">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>

                    {isLoading && <p>Loading...</p>}
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
                                                    "pfp__nft__image" +
                                                    (currentSelected &&
                                                    currentSelected?.name ===
                                                        nft?.name
                                                        ? " active"
                                                        : "")
                                                }
                                                onClick={() => {
                                                    currentSelected === nft
                                                        ? setCurrentSelected(
                                                              null,
                                                          )
                                                        : setCurrentSelected(
                                                              nft,
                                                          );
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

                    <div className="clearfix"></div>

                    <div
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
                        Save
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePicPopup;
