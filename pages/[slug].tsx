import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { init as initCanvas } from "../canvas/main";
import Layout from "../components/global/Layout";
import { useMoralis, useMoralisQuery } from "react-moralis";
import PostitCanvas from "../components/canvas/PostitCanvas";
import UserLoggedIn from "../components/user/UserLoggedIn";
import FrenPopup from "../components/popups/FrenPopup";
import { usePopup } from "../context/PopupContext";
import { punify, punifyCode } from "../lib/lib";
import Loader from "../components/global/Loader";
import { useUser } from "../context/UserContext";
import { log } from "util";
import DonatePopup from "../components/popups/DonatePopup";

interface Props {
    slug: string;
}

const showCanvas = false;

const UserPage: NextPage<Props> = ({ slug }) => {
    const { authenticate } = useMoralis();

    const [pfp, setPfp] = useState<any>(null);
    const [page, setPage] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [doesExist, setDoesExist] = useState(true);
    const [error, setError] = useState<any>(null);
    const [disconnectIsShown, setDisconnectIsShown] = useState(false);

    const { isInitialized, Moralis, isAuthenticated, user, logout } =
        useMoralis();

    const { setFrenPopup, setTransferPopup } = usePopup();

    /***** INITIAL LOAD *****/
    useEffect(() => {
        load();
    }, [isInitialized, slug]);

    /** Initial load function **/
    const load = async () => {
        if (false) await initCanvas(); //this was causing an error with the connect wallet button
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
                        const options = { method: "GET" };
                        await fetch(
                            `https://api.opensea.io/api/v1/asset/${ta}/${ti}/`,
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
                            .catch((err) => setError(err));
                    } else {
                        /**********************
                         *  User has no PFP
                         * ********************/
                        setIsLoading(false);
                    }
                }
            } else {
                /************************
                 *  Page does not exist
                 *   --> no fren here
                 * **********************/
                if (!page) {
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
    if (error) return <p>Error {error.message}</p>;

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
        return <UserLoggedIn />;

    /**** IF PAGE *****/
    return (
        <Layout addClass="root-user">
            <div className="user-container">
                <img
                    src={pfp?.image_preview_url ?? "/images/punk.png"}
                    className="profilepic"
                    onClick={() => setFrenPopup(true)}
                    style={{ cursor: "pointer" }}
                    id="profilepic"
                    tabIndex={0}
                />
                <br />
                <h3
                    onClick={() => setFrenPopup(true)}
                    style={{ cursor: "pointer" }}
                    className="centertext ethname"
                >
                    {slug}
                </h3>
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
                    <div className="disconnect" onClick={() => logout()}>
                        disconnect
                    </div>
                </div>
            )}

            {!user && (
                <div className="walletinfo" tabIndex={0}>
                    <div
                        className="address"
                        onClick={() =>
                            authenticate({
                                signingMessage: "gm fren",
                            })
                        }
                    >
                        connect wallet
                    </div>
                </div>
            )}

            {showCanvas && <PostitCanvas />}
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug: string = context.params?.slug as string;
    const lowercase = slug.toLowerCase();
    const punifiedSlug = punifyCode(lowercase);

    return {
        props: {
            slug: punifiedSlug,
        },
    };
};

export default UserPage;
