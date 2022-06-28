import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { useUser } from "../../context/UserContext";
import PopupWrapper from "./PopupWrapper";
import { ensContractAdress } from "../../lib/variousContractAddresses";
import { getNftImage } from "../../lib/getNftImage";

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
    const { user, setEnsDomain, setIsOpenseaDown } = useUser();

    const fetcher = async () => {
        let itemsPerPage: number = maxItemsPerPage;
        if (user) {
            let ethAddress = user.get("ethAddress");
            const options = {
                method: "GET",
                headers: {
                    "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEEKEY + "",
                },
                redirect: "follow",
            };

            await fetchPage(ethAddress, options)
                .then((res: any) => {
                    itemsPerPage = res?.ownedNfts?.length;
                    if (itemsPerPage === maxItemsPerPage) {
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
                    if (!ensNames) setEnsNames((old) => [...old, ...res]);
                    else setEnsNames([...res]);
                    setFetchOffset((old) => old + itemsPerPage);
                })
                .catch((err) => (itemsPerPage = 0));
        }
    };

    const fetchPage = async (ethAddress: string, options: any) => {
        let result = null;
        //let url = `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&asset_contract_address=${process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS}&offset=${fetchOffset}&limit=${maxItemsPerPage}`;
        let urlAlchemy = `https://eth-mainnet.alchemyapi.io/nft/v2/demo/getNFTs?owner=${ethAddress}`;
        await fetch(urlAlchemy, options)
            .then((res) => res.json())
            .then((response) => {
                result = response?.ownedNfts?.filter((item: any) => {
                    return (
                        item.contract.address.toLowerCase() ===
                        ensContractAdress.toLowerCase()
                    );
                });
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
        }
    };

    return (
        <PopupWrapper
            isOpen={showEditENSPopup}
            closePopup={() => setShowEditENSPopup(false)}
            size={"full"}
            headerContent={""}
            flexWrapper={false}
        >
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
                                        src={getNftImage(nft) ?? ""}
                                        alt=""
                                        data-alt={nft?.title}
                                        className={
                                            "pfp__nft__image overflow-hidden" +
                                            (nft?.traits &&
                                            nft?.traits?.length > 0
                                                ? " hover"
                                                : "") +
                                            (nft?.traits &&
                                            nft?.traits?.length > 0 &&
                                            currentSelected &&
                                            currentSelected?.name === nft?.name
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
            {!isLoading && (!ensNames || ensNames.length <= 0) && (
                <div className="paddingTop--big">
                    It seems that you don't have any ENS domains yet. <br />
                    <a
                        href="https://ens.domains"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Buy one here
                    </a>
                </div>
            )}
        </PopupWrapper>
    );
};
export default EditENSPopup;
