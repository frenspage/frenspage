import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

interface Props {
    setEditProfilePic: (val: boolean) => void;
}

const maxItemsPerPage: number = 50;

const EditProfilePicPopup: React.FC<Props> = ({ setEditProfilePic }) => {
    const [nfts, setNfts] = useState<Array<any>>([]);
    const [currentSelected, setCurrentSelected] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showEditProfilePicPopup, setShowEditProfilePicPopup } = usePopup();
    const { user, Moralis } = useMoralis();

    const fetcher = async () => {
        let offset: number = 0;
        let itemsPerPage: number = maxItemsPerPage;
        if (user) {
            let ethAddress = user.get("ethAddress");
            const options = {
                method: "GET",
                headers: {
                    "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEEKEY + "",
                },
            };
            let fetchedItems: Array<any> = [];
            while (itemsPerPage >= maxItemsPerPage) {
                await fetchPage(offset, ethAddress, options)
                    .then((res: any) => {
                        itemsPerPage = res?.assets?.length;
                        fetchedItems = [...fetchedItems, ...res?.assets];
                        offset++;
                    })
                    .catch((err) => (itemsPerPage = 0));
            }

            setNfts(fetchedItems);
        }
    };

    const fetchPage = async (
        offset: number,
        ethAddress: string,
        options: any,
    ) => {
        let result = null;

        let url = `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&order_direction=desc&offset=${offset}&limit=${maxItemsPerPage}`;
        await fetch(url, options)
            .then((response) => response.json())
            .then((response) => {
                result = response;
            })
            .catch((err) => console.error(err));
        return result;
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
                    <button
                        className="closepopup"
                        onClick={() => setShowEditProfilePicPopup(false)}
                        tabIndex={0}
                    >
                        <span>&times;</span>
                    </button>

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

                    {!isLoading && nfts && nfts.length > 0 ? (
                        <div className="profilepicselect_nfts">
                            <div className="content flex flex--gap--big paddingTop--big">
                                {nfts?.map((nft: any, index: number) => {
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
