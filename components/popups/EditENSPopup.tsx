import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useUser } from "../../context/UserContext";

interface Props {
    setEditUsername: (val: string) => void;
}

const maxItemsPerPage: number = 50;

const EditENSPopup: React.FC<Props> = ({ setEditUsername }) => {
    const [ensNames, setEnsNames] = useState<any[]>([]);
    const [currentSelected, setCurrentSelected] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [hasMore, setHasMore] = useState(true);
    const [fetchOffset, setFetchOffset] = useState(0);

    const { showEditENSPopup, setShowEditENSPopup } = usePopup();
    const { Moralis } = useMoralis();
    const { user, setEnsDomain } = useUser();

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
                    setEnsNames((old) => [...old, ...res?.assets]);
                    setFetchOffset((old) => old + itemsPerPage);
                })
                .catch((err) => (itemsPerPage = 0));
        }
    };

    const fetchPage = async (ethAddress: string, options: any) => {
        let result = null;
        let url = `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&asset_contract_address=${process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS}&offset=${fetchOffset}&limit=${maxItemsPerPage}`;
        await fetch(url, options)
            .then((res) => res.json())
            .then((response) => {
                result = response;
            })
            .catch((err) => console.error(err));
        return result;
    };

    useEffect(() => {
        if (user) fetcher().then(() => setIsLoading(false));
        else setEnsNames([]);
    }, [user, Moralis.Web3API.account]);

    const changeENS = async (data: any) => {
        if (!data) return;

        let name = data.name?.toLowerCase();

        let PageObject = Moralis.Object.extend("Page");

        let checkPageAlreadyExists = new Moralis.Query(PageObject);
        checkPageAlreadyExists.equalTo("slug", name); //data.name);
        const isPageAlreadyExists = await checkPageAlreadyExists.first();

        if (!isPageAlreadyExists) {
            setEnsDomain(data);
            setEditUsername(name);
            setShowEditENSPopup(false);
        } else {
            /*alert(
                "a page with the ens username '" +
                    name +
                    "' already exists!\nPlease use another name!",
            );*/
        }
    };

    return (
        <div
            id="ensselect_popup"
            className={"popupbg" + (!showEditENSPopup ? " hidden" : "")}
        >
            <div className="bigpopup">
                <div className="content">
                    <button
                        className="closepopup"
                        onClick={() => setShowEditENSPopup(false)}
                        tabIndex={0}
                    >
                        <span>&times;</span>
                    </button>

                    <h1>Anon, select your .eth name</h1>
                    <h4>(Can be changed later)</h4>

                    {isLoading && (
                        <div id="ensselect_nfts_loading">
                            <div className="lds-ellipsis">
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
                    )}

                    {!isLoading && ensNames && ensNames.length > 0 && (
                        <div className="profilepicselect_nfts">
                            <div className="content flex flex--gap--big paddingTop--big">
                                {ensNames?.map((nft: any, index: number) => {
                                    return (
                                        <div
                                            className="pfp__nft grid__item"
                                            key={`nft__${index}`}
                                        >
                                            <img
                                                src={
                                                    nft?.traits &&
                                                    nft?.traits?.length > 0
                                                        ? nft?.image_preview_url ??
                                                          ""
                                                        : "/images/punk.png"
                                                }
                                                alt=""
                                                className={
                                                    "pfp__nft__image overflow-hidden" +
                                                    (nft?.traits &&
                                                    nft?.traits?.length > 0
                                                        ? " hover"
                                                        : "") +
                                                    (nft?.traits &&
                                                    nft?.traits?.length > 0 &&
                                                    currentSelected &&
                                                    currentSelected?.name ===
                                                        nft?.name
                                                        ? " active"
                                                        : "")
                                                }
                                                onClick={() => {
                                                    if (
                                                        nft?.traits &&
                                                        nft?.traits?.length > 0
                                                    )
                                                        changeENS(nft);
                                                }}
                                            />
                                            <h3 className="pfp__nft__title">
                                                {nft?.name ?? ""}
                                            </h3>
                                            <a
                                                href={nft?.permalink ?? ""}
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
                    {!isLoading && (!ensNames || ensNames.length <= 0) && (
                        <div className="paddingTop--big">
                            It seems that you don't have any ENS domains yet.{" "}
                            <br />
                            <a
                                href="https://ens.domains"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Buy one here
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditENSPopup;
