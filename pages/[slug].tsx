import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import UserLoggedIn from "../components/user/UserLoggedIn";
import FrenPopup from "../components/popups/FrenPopup";
import { usePopup } from "../context/PopupContext";
import { punifyCode } from "../lib/textLib";
import Loader from "../components/global/Loader";
import DonatePopup from "../components/popups/DonatePopup";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import NewLineText from "../components/global/NewLinetext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import dynamic from "next/dynamic";
import CardsRenderer from "../components/mobile/CardsRenderer";
import Hide from "../components/global/Hide";

const FrenCanvas = dynamic(() => import("../components/canvas/FrenCanvas"), {
    ssr: false,
});

interface Props {}

const showCanvas = true;

const UserPage: NextPage<Props> = ({}) => {
    const router = useRouter();

    const [pfp, setPfp] = useState<any>(null);
    const [page, setPage] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [doesExist, setDoesExist] = useState(true);
    const [error, setError] = useState<any>(null);
    const [isClickAuth, setIsClickAuth] = useState(false);

    const routeredSlug: string = router?.query?.slug as string;
    const lowercasedSlug = routeredSlug?.toLowerCase();
    const slug = punifyCode(lowercasedSlug);

    const { isInitialized, Moralis } = useMoralis();
    const {
        user,
        isAuthenticated,
        authenticate,
        disconnect,
        isOpenseaDown,
        setIsOpenseaDown,
    } = useUser();

    const { setFrenPopup } = usePopup();

    /***** INITIAL LOAD *****/
    useEffect(() => {
        if (slug) load();
    }, [isInitialized, slug]);

    /***** CHECK IF USER has page claimed after connect *****/
    useEffect(() => {
        if (isAuthenticated && user && isClickAuth && !user.get("hasClaimed")) {
            setIsClickAuth(false);
            if (user.get("ensusername") !== router?.query?.slug)
                router.push("/");
        }
        if (!user) loadData();
    }, [user, isAuthenticated, Moralis.Web3API.account]);

    const load = async () => {
        await loadData().then(() => {});
    };

    /**********************************************
     * 1. Check if Moralis is Initialized
     * 2. Check if Page with given slug exists
     * 3. Check if User has pfp -> then get pfp
     **********************************************/
    const loadData = async () => {
        if (isInitialized) {
            let PageObject = Moralis.Object.extend("Page");

            let checkUserHasPage = new Moralis.Query(PageObject);
            checkUserHasPage.equalTo("slug", slug);
            checkUserHasPage.descending("createdAt");
            const userPage = await checkUserHasPage.first();

            /*** CHECK IF PAGE EXISTS ***/
            if (userPage) {
                setPage(userPage);

                const pageOwner = userPage.get("owner");

                /*** CHECK IF OWNER EXISTS (to prevent errors) ***/
                if (pageOwner) {
                    /*** Fetch ProfilePic from DB ***/
                    const PFPObject = Moralis.Object.extend("ProfilePic");
                    const pfpQuery = await new Moralis.Query(PFPObject);
                    pfpQuery.equalTo("owner", pageOwner);
                    pfpQuery.descending("createdAt");
                    const pfp = await pfpQuery.first();

                    /*** CHECK IF USER HAS PFP ***/
                    if (pfp && pfp?.isDataAvailable()) {
                        let ta = pfp.get("token_address");
                        let ti = pfp.get("token_id");
                        const options: any = {
                            method: "GET",
                            headers: {
                                "X-API-KEY":
                                    process.env.NEXT_PUBLIC_OPENSEEKEY + "",
                            },
                            redirect: "follow",
                        };
                        /*await fetch(
                            `https://api.opensea.io/api/v1/asset/${ta}/${ti}/`,
                            options,
                        )*/
                        console.log(ta);
                        await fetch(
                            `https://eth-mainnet.alchemyapi.io/nft/v2/demo/getNFTs?owner=${ta}`,
                            options,
                        )
                            .then((response) => response.json())
                            .then((response) => {
                                /*******************
                                 *  User has PFP
                                 * *****************/
                                setPfp(response);
                                setIsLoading(false);
                            })
                            .catch((err) => {
                                setError(err);
                                setIsOpenseaDown(true);
                                setIsLoading(false);
                            });
                    } else {
                        /**********************
                         *  User has no PFP
                         * ********************/
                        setPfp(null);
                        setIsLoading(false);
                    }
                }
            } else {
                /************************
                 *  Page does not exist
                 *   --> no fren here
                 * **********************/
                if (!page) {
                    setPfp(null);
                    setIsLoading(false);
                    setDoesExist(false);
                }
            }
        } else {
            /********************************
             *  Moralis not yet initialised
             * ******************************/
            setIsLoading(true);
        }
    };

    /**** IF ERROR FROM PFP LOAD *****/
    if (error && !isOpenseaDown) return <p>Error {error.message}</p>;

    /**** IF LOADING *****/
    if (isLoading) return <Loader />;

    /**** IF NO USER *****/
    if (!isLoading && !doesExist)
        return (
            <Layout addClass="root-user centertext">
                <div>
                    <h3>no fren here</h3>
                    <br />
                    <p>
                        <Link href="/">
                            <a>go back home</a>
                        </Link>
                    </p>
                </div>
            </Layout>
        );

    /**** IF USER === OWNER *****/
    if (
        !isLoading &&
        doesExist &&
        isAuthenticated &&
        user?.id === page?.get("owner")?.id
    )
        return <UserLoggedIn showCanvas={showCanvas} page={page} />;

    /**** IF PAGE *****/
    return (
        <Layout addClass="root-user root-user__mobile">
            <div className="user-container">
                <div id="profilepicbox">
                    <img
                        src={pfp?.image_preview_url ?? "/images/punk.png"}
                        className="profilepic"
                        onClick={() => setFrenPopup(true)}
                        style={{ cursor: "pointer" }}
                        tabIndex={0}
                    />

                    <br />
                    <div className="ellipsis flex flex-center--horizontal">
                        <h3
                            onClick={() => setFrenPopup(true)}
                            className="username profilename"
                        >
                            {slug}
                        </h3>
                    </div>
                    {(page?.get("twitterName") || page?.get("biography")) && (
                        <div className="flex flex-column-center">
                            {page?.get("biography") && (
                                <div className="marginTop marginBottom greyfont centertext biography">
                                    <NewLineText
                                        text={page?.get("biography")}
                                        addClass="centertext"
                                    />
                                </div>
                            )}

                            {page?.get("twitterName") && (
                                <a
                                    href={`https://twitter.com/${page?.get(
                                        "twitterName",
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={
                                        "button addIcon small tooltip--twitterName"
                                    }
                                    data-name={page?.get("twitterName")}
                                >
                                    <FontAwesomeIcon
                                        icon={faTwitter}
                                        style={{
                                            fontSize: "1rem",
                                            height: "1rem",
                                        }}
                                    />
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <FrenPopup pageData={page} profilePic={pfp} />
            <DonatePopup ethAddress={page?.get("ethAddress")} />

            {user && (
                <div className="walletinfo" tabIndex={0}>
                    <Link href={"/" + user?.get("ensusername")}>
                        <a className="address">
                            connected as {user?.get("ethAddress")}
                        </a>
                    </Link>
                    <div className="disconnect" onClick={() => disconnect()}>
                        disconnect
                    </div>
                </div>
            )}

            {
                //@ts-ignore
                !user && window?.ethereum && (
                    <div className={"walletinfo"} tabIndex={0}>
                        <div
                            className="address hover"
                            onClick={() => {
                                setIsClickAuth(true);
                                authenticate();
                            }}
                        >
                            connect wallet
                        </div>
                    </div>
                )
            }
            {
                //@ts-ignore
                !user && !window.ethereum && (
                    <div className={"walletinfo"}>
                        <div className="address">no web3 wallet found</div>
                    </div>
                )
            }

            {showCanvas && (
                <Hide down={"phone"}>
                    <FrenCanvas page={page} />
                </Hide>
            )}
            {showCanvas && (
                <Hide up={"phone"}>
                    <CardsRenderer page={page} />
                </Hide>
            )}
        </Layout>
    );
};

export default UserPage;
