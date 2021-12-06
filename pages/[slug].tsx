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
    const [profile, setProfile] = useState<any>(null);
    const [doesExist, setDoesExist] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { isInitialized, Moralis, isAuthenticated, user } = useMoralis();

    /**
     * useMoralisQuery from "react-moralis"-package
     * return { data, error, isLoading, ... }
     * This is the same as Moralis.Query("Page")
     */
    const {
        data: pageData,
        error: pageError,
        isLoading: isLoadingPage,
    } = useMoralisQuery("Page", (query) =>
        query.equalTo("slug", slug).descending("createdAt").limit(1),
    );

    /**
     * This useEffect check if the page with slug exists
     * after pageData from useMoralisQuery hook is loaded
     */
    useEffect(() => {
        load().then(() => {
            if (pageData && pageData.length > 0) {
                setDoesExist(true);
            }
            setLoading(false);
        });
    }, [pageData, isLoadingPage]);

    /** Initial load function **/
    const load = async () => {
        if (showCanvas) await initCanvas();
        await loadPFP();
    };

    /** Load ProfilePicture from Database **/
    const loadPFP = async () => {
        if (pageData[0]) {
            const owner = pageData[0].get("owner");

            if (owner) {
                const PFPObject = Moralis.Object.extend("ProfilePic");
                const pfpQuery = await new Moralis.Query(PFPObject);

                pfpQuery.equalTo("owner", owner);
                pfpQuery.descending("createdAt");
                const pfp = await pfpQuery.first();

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
                            setProfile(response);
                        })
                        .catch((err) => console.error(err));
                } else {
                    //console.log("No PFP yet");
                }
            }
        } else {
            //console.log("No data");
        }
    };

    if (isLoading && !isAuthenticated)
        return (
            <Layout addClass="root-user">
                <p>gm</p>
            </Layout>
        );

    if (pageError) return <p>Error {pageError.message}</p>;

    if (!isLoading && !doesExist && !isAuthenticated)
        return (
            <Layout addClass="root-user centertext">
                <div>
                    <h3>no fren here</h3>
                    <br />
                    <p>
                        <Link href="/">go back home</Link>
                    </p>
                </div>
            </Layout>
        );

    if (
        !isLoading &&
        doesExist &&
        isAuthenticated &&
        user?.id === pageData[0]?.get("owner")?.id
    )
        return <UserLoggedIn />;

    return (
        <Layout addClass="root-user">
            <div className="user-container">
                <img
                    src={profile?.image_preview_url ?? "/images/punk.png"}
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
