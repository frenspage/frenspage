import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { init } from "../canvas/main";
import Layout from "../components/global/Layout";
import { useMoralis, useMoralisQuery } from "react-moralis";
import PostitCanvas from "../components/canvas/PostitCanvas";

interface Props {
    slug: string;
}

const UserPage: NextPage<Props> = ({ slug }) => {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setLoading] = useState(true);
    const { isInitialized, Moralis } = useMoralis();

    const {
        data: pageData,
        error: pageError,
        isLoading: isLoadingPage,
    } = useMoralisQuery("Page", (query) =>
        query.equalTo("slug", slug).descending("createdAt").limit(1),
    );

    useEffect(() => {
        load().then(() => setLoading(false));
    }, [pageData, isLoadingPage]);

    const load = async () => {
        await init();
        await loadPFP();
    };

    const loadPFP = async () => {
        if (pageData[0]) {
            console.log("pageData:", pageData);
            const owner = pageData[0].get("owner");

            if (owner) {
                const PFPObject = Moralis.Object.extend("ProfilePic");
                const pfpQuery = await new Moralis.Query(PFPObject);

                pfpQuery.equalTo("owner", owner);
                pfpQuery.descending("createdAt");
                const pfp = await pfpQuery.first();

                console.log("PFP", pfp);

                if (pfp && pfp?.isDataAvailable()) {
                    let ta = pfp.get("token_address");
                    let ti = pfp.get("token_id");
                    const options = { method: "GET" };
                    fetch(
                        `https://api.opensea.io/api/v1/asset/${ta}/${ti}/`,
                        options,
                    )
                        .then((response) => response.json())
                        .then((response) => {
                            setProfile(response);
                            console.log("opensea response:", response);
                        })
                        .catch((err) => console.error(err));
                } else {
                    console.log("No PFP yet");
                }
            }
        }
    };

    if (!isInitialized || isLoadingPage || isLoading)
        return (
            <Layout>
                <div id="loading">
                    <div className="lds-ellipsis">
                        gm<div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <PostitCanvas />
            </Layout>
        );

    if (pageError) return <p>Error {pageError.message}</p>;

    return (
        <Layout addClass="root-user">
            <div className="user-container">
                <img
                    src={profile?.image_preview_url ?? "/images/punk.png"}
                    className="profilepic"
                />
                <p style={{ textAlign: "center" }}>{slug}</p>
            </div>
            <PostitCanvas />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            slug: context.params?.slug,
        },
    };
};

export default UserPage;
