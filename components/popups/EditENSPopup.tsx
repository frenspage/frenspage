import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/UserContext";

interface Props {
    setEditUsername: (val: string) => void;
}

const maxItemsPerPage: number = 50;

const EditENSPopup: React.FC<Props> = ({ setEditUsername }) => {
    const [ensNames, setEnsNames] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentSelected, setCurrentSelected] = useState<any>(null);

    const { showEditENSPopup, setShowEditENSPopup } = usePopup();
    const { Moralis } = useMoralis();
    const { user, ensDomain, setEnsDomain } = useUser();

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

            setEnsNames(fetchedItems);
        }
    };

    const fetchPage = async (
        offset: number,
        ethAddress: string,
        options: any,
    ) => {
        let result = null;

        let url = `https://api.opensea.io/api/v1/assets?owner=${ethAddress}&asset_contract_address=${process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS}&offset=${offset}&limit=${maxItemsPerPage}`;
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
    }, [user, Moralis.Web3API.account]);

    const changeENS = async (data: any) => {
        if (!data) return;
        //console.log("ENS DATA: ", data);
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
