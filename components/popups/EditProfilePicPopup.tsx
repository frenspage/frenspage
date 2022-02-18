import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useUser } from "../../context/UserContext";
import PopupWrapper from "./PopupWrapper";

interface Props {
    setEditProfilePic: (val: boolean) => void;
}

const maxItemsPerPage: number = 50;

const EditProfilePicPopup: React.FC<Props> = ({ setEditProfilePic }) => {
    const [nfts, setNfts] = useState<Array<any>>([]);
    const [currentSelected, setCurrentSelected] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [hasMore, setHasMore] = useState(true);
    const [fetchOffset, setFetchOffset] = useState(0);

    const { showEditProfilePicPopup, setShowEditProfilePicPopup } = usePopup();
    const { Moralis } = useMoralis();
    const { user, setIsOpenseaDown } = useUser();

    const fetcher = async () => {
        let itemsPerPage: number = maxItemsPerPage;
        if (user) {
            let ethAddress = user.get("ethAddress");
            const options = {
                method: "GET",
                headers: {
                    "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEEKEY + "",
                },
            };

            await fetchPage(ethAddress, options)
                .then((res: any) => {
                    itemsPerPage = res?.assets?.length;
                    if (itemsPerPage === maxItemsPerPage) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                    setNfts((old) => [...old, ...res?.assets]);
                    setFetchOffset((old) => old + itemsPerPage);
                })
                .catch((err) => (itemsPerPage = 0));
        }
    };

    const fetchPage = async (ethAddress: string, options: any) => {
        let result = null;
        let url = `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&order_direction=desc&offset=${fetchOffset}&limit=${maxItemsPerPage}`;
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
        else setNfts([]);
    }, [user, Moralis.Web3API.account]);

    const changeProfilePic = (data: any) => {
        if (!data) return;

        setEditProfilePic(data);
        setShowEditProfilePicPopup(false);
    };

    return (
        <PopupWrapper
            isOpen={showEditProfilePicPopup}
            closePopup={() => setShowEditProfilePicPopup(false)}
            size={"full"}
            headerContent={""}
            flexWrapper={false}
        >
            <h1>Select your pfp</h1>

            <h4>(Can be changed later)</h4>
            {isLoading && (
                <div id="profilepicselect_nfts_loading">
                    <div className="lds-ellipsis">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            )}
            {!isLoading && nfts && nfts.length > 0 && (
                <div className="profilepicselect_nfts">
                    <div className="content flex flex--gap--big paddingTop--big">
                        {nfts?.map((nft: any, index: number) => {
                            return (
                                <div
                                    className="pfp__nft grid__item"
                                    key={`nft__${index}`}
                                >
                                    <img
                                        src={nft?.image_preview_url ?? ""}
                                        alt=""
                                        className={
                                            "pfp__nft__image hover" +
                                            (currentSelected &&
                                            currentSelected?.name === nft?.name
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
                                            {nft?.asset_contract?.address}
                                        </span>
                                    </a>
                                </div>
                            );
                        })}
                        {hasMore && (
                            <div className="flex flex-center--vertical flex-center--horizontal w-100">
                                <button
                                    className="button black"
                                    onClick={fetcher}
                                >
                                    Load More...
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {!isLoading && (!nfts || nfts.length <= 0) && (
                <div className="paddingTop--big">
                    It seems that u don't have any nfts yet.
                </div>
            )}
        </PopupWrapper>
    );
};

export default EditProfilePicPopup;
