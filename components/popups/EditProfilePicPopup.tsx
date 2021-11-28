import React from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";

interface Props {
    nfts: any;
    allowPfpSubmit: boolean;
    setEditProfilePic: (val: boolean) => void;
}

const EditProfilePicPopup: React.FC<Props> = ({
    nfts,
    allowPfpSubmit,
    setEditProfilePic,
}) => {
    const { showEditProfilePicPopup, setShowEditProfilePicPopup } = usePopup();

    const changeProfilePic = (data: any) => {
        console.log("Setting new pfp");
        console.log(data);

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

                    {nfts?.assets && nfts.assets.length > 0 ? (
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
                                                className="pfp__nft__image"
                                                onClick={() =>
                                                    changeProfilePic(nft)
                                                }
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
                            "savebutton" + (allowPfpSubmit ? " allowed" : "")
                        }
                        data-onclick="choosePFP();"
                        onClick={() => {
                            if (allowPfpSubmit)
                                setShowEditProfilePicPopup(false);
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
