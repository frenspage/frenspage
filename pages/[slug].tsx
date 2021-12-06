import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { init as initCanvas } from "../canvas/main";
import Layout from "../components/global/Layout";
import { useMoralis, useMoralisQuery } from "react-moralis";
import PostitCanvas from "../components/canvas/PostitCanvas";
import UserLoggedIn from "../components/user/UserLoggedIn";

interface Props {
    slug: string;
}

const showCanvas = false;

const UserPage: NextPage<Props> = ({ slug }) => {
    const [pfp, setPfp] = useState<any>(null);
    const [page, setPage] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [doesExist, setDoesExist] = useState(true);
    const [error, setError] = useState<any>(null);
    const { isInitialized, Moralis, isAuthenticated, user } = useMoralis();

    /***** INITIAL LOAD *****/
    useEffect(() => {
        load();
    }, [isInitialized]);

    const load = async () => {
        if (showCanvas) await initCanvas();
        await loadData().then(() => {
            console.log("then");
        });
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
                const owner = userPage.get("owner");

                /*** CHECK IF OWNER EXISTS (to prevent errors) ***/
                if (owner) {
                    const PFPObject = Moralis.Object.extend("ProfilePic");
                    const pfpQuery = await new Moralis.Query(PFPObject);

                    pfpQuery.equalTo("owner", owner);
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
            console.log("not yet initialised");
            setIsLoading(true);
        }
    };

    /**** IF ERROR FROM PFP LOAD *****/
    if (error) return <p>Error {error.message}</p>;

    /**** IF LOADING *****/
    if (isLoading)
        return (
            <Layout addClass="root-user">
                <p>gm</p>
            </Layout>
        );

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
                />
                <p style={{ textAlign: "center" }}>{slug}</p>
            </div>
            {showCanvas && <PostitCanvas />}
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug: string = context.params?.slug as string;
    return {
        props: {
            slug: slug.toLowerCase(),
        },
    };
};

export default UserPage;
