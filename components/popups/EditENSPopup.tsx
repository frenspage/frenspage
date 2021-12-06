import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { usePopup } from "../../context/PopupContext";

interface Props {
    ENS: string;
    setENS: (val: string) => void;
    setEditUsername: (val: string) => void;
}

const EditENSPopup: React.FC<Props> = ({ ENS, setENS, setEditUsername }) => {
    const [ensNames, setEnsNames] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentSelected, setCurrentSelected] = useState<any>(null);

    const { showEditENSPopup, setShowEditENSPopup } = usePopup();
    const { user, Moralis } = useMoralis();

    const fetcher = async () => {
        if (user) {
            let ethAddress = user.get("ethAddress"); //"0x80f0ae4e0b80544330Fc5257fc32c69A4dB6e630"; //"0x6871D1a603fEb9Cc2aA8213B9ab16B33e418cD8F";//
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
                    if (!response || response.length <= 0)
                        console.log(
                            "You have no nfts, neither .eth names in your wallet!",
                        );

                    let domains: any[] = [];
                    response?.assets?.map((element: any) => {
                        if (
                            process.env.NEXT_PUBLIC_ENSCONTRACTADDRESS?.toLowerCase() ===
                            element.asset_contract.address?.toLowerCase()
                        ) {
                            domains = [...domains, element];
                        }
                    });
                    setEnsNames(domains);
                })

                .catch((err) => console.error(err));
        }
    };

    useEffect(() => {
        if (user) fetcher().then(() => setIsLoading(false));
    }, [user, Moralis.Web3API.account]);

    const changeENS = async (data: any) => {
        if (!data) return;

        let name = data.name?.toLowerCase();

        let PageObject = Moralis.Object.extend("Page");

        let checkPageAlreadyExists = new Moralis.Query(PageObject);
        checkPageAlreadyExists.equalTo("slug", name); //data.name);
        const isPageAlreadyExists = await checkPageAlreadyExists.first();

        if (!isPageAlreadyExists) {
            setENS(data);
            setEditUsername(name);
            setShowEditENSPopup(false);
        } else {
            alert(
                "a page with the ens username '" +
                    name +
                    "' already exists!\nPlease use another name!",
            );
        }
    };

    return (
        <div
            id="ensselect_popup"
            className={"popupbg" + (!showEditENSPopup ? " hidden" : "")}
        >
            <div className="bigpopup">
                <div className="content">
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
                    {isLoading && <p>Loading...</p>}
                    {!isLoading && ensNames && ensNames.length > 0 ? (
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
                    ) : (
                        <div className="paddingTop--big">
                            It seems that u don't have any nfts yet.
                        </div>
                    )}

                    <div className="clearfix"></div>

                    <div
                        id="saveens"
                        className={
                            "savebutton" + (currentSelected ? " cansubmit" : "")
                        }
                        onClick={() => {
                            if (currentSelected) changeENS(currentSelected);
                        }}
                    >
                        Save
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditENSPopup;
