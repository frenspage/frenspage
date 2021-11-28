import React from "react"
import { useMoralis } from "react-moralis";

interface Props{
    showEditProfilePopup: boolean;
    setShowEditProfilePopup: (val: boolean) => void;
    nfts: any;
    profile: any
    allowPfpSubmit: boolean
    setProfile: (val:any) => void;
    ENS: any;
    setENS: (val:string) => void;
    showEditENSPopup: boolean;
    setShowEditENSPopup: (val:boolean) => void;
    setEditENS: (val:any) => void;
    username: string;
    editUsername: string;
    setUsername: (val:string) => void;
    setEditUsername: (val:string) => void;
    Moralis: any;
}


const EditENSPopup: React.FC<Props> = ({
    showEditProfilePopup,
    setShowEditProfilePopup,
    nfts,
    profile,
    allowPfpSubmit, 
    setProfile,
    ENS,
    setENS,    
    showEditENSPopup,
    setShowEditENSPopup, 
    setEditENS,
    username,
    editUsername,
    setUsername,
    setEditUsername,
    Moralis

}) => {
    const {user} = useMoralis();

    const changeENS = (data: any) => {
        console.log("Setting new ENS name");
        console.log(data);

        if (!data) return;

        setEditUsername(data.name);
        setShowEditENSPopup(false);        
    };

    return (

        <div
            id="ensselect_popup"
            className={
                "popupbg" + (!showEditENSPopup ? " hidden" : "")
            }
        >
            <div className="bigpopup">
                <div
                    className="closepopup"
                    onClick={() => setShowEditENSPopup(false)}
                >
                    <span>&times;</span>
                </div>

                <h1>Anon, select your .eth name</h1>
                <h4>Can be changed later</h4>

                <div id="ensselect_nfts_loading">
                    <div className="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>

                <div id="ensselect">

                    {nfts?.assets && nfts.assets.length > 0 ? (
                        <div className="profilepicselect_nfts">
                            <div className="content flex flex--gap--big paddingTop--big">
                                {nfts.assets?.map(
                                    (
                                        nft: any,
                                        index: number,
                                    ) => {
                                        return (
                                            <div
                                                className="pfp__nft grid__item"
                                                key={`nft__${index}`}
                                            >
                                                <img
                                                    src={
                                                        nft?.image_preview_url ??
                                                        ""
                                                    }
                                                    alt=""
                                                    className="pfp__nft__image"
                                                    onClick={() =>
                                                        changeENS(
                                                            nft,
                                                        )
                                                    }
                                                />
                                                <h3 className="pfp__nft__title">
                                                    {nft?.name ??
                                                        ""}
                                                </h3>
                                                <a
                                                    href={
                                                        nft.permalink ??
                                                        ""
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="pfp__nft__permalink"
                                                >
                                                    <span className="c--grey">
                                                        {
                                                            nft
                                                                ?.asset_contract
                                                                ?.address
                                                        }
                                                    </span>
                                                </a>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="paddingTop--big">
                            It seems that u don't have any nfts
                            yet.
                        </div>
                    )}


                </div>

                <div className="clearfix"></div>

                <div
                    id="saveens"
                    className="savebutton"
                    data-onclick="chooseENS();"
                >
                    Save
                </div>
            </div>
        </div>

    );

};

export default EditENSPopup;