import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { init } from "../canvas/main";
import Layout from "../components/global/Layout";
import { useMoralis } from "react-moralis";
import PostitCanvas from "../components/canvas/PostitCanvas";

interface Props {
    id: string;
    data: any;
}

const UserPage: NextPage<Props> = ({ id, data }) => {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setLoading] = useState(true);
    const { isInitialized, Moralis } = useMoralis();

    useEffect(() => {
        load().then(() => setLoading(false));
    }, []);

    const load = async () => {
        await init();
        await loadPFP();
    };

    const loadPFP = async () => {
        const PFP = Moralis.Object.extend("ProfilePic");
        const query = await new Moralis.Query(PFP);

        const UserObject = Moralis.Object.extend("User");
        const userQuery = new Moralis.Query(UserObject);
        //userQuery.equalTo("ensusername", id);
        //userQuery.descending("createdAt");
        const users = await userQuery.find({ useMasterKey: true });
        console.log("users: ", users);

        /*const user = await userQuery
            .get(id)
            .then((result: any) => console.log("result:", result))
            .catch((err: any) => console.error("error: ", err));
        console.log("queried user: ", user);

        query.equalTo("owner", user);
        query.descending("createdAt");
        const object = await query.first();

        if (object && object?.isDataAvailable()) {
            let ta = object.get("token_address");
            let ti = object.get("token_id");
            const options = { method: "GET" };
            fetch(`https://api.opensea.io/api/v1/asset/${ta}/${ti}/`, options)
                .then((response) => response.json())
                .then((response) => {
                    setProfile(response);
                    console.log("opensea response:", response);
                })
                .catch((err) => console.error(err));
        } else {
            console.log("No PFP yet");
        }*/
    };

    if (!isInitialized || isLoading)
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

    return (
        <Layout addClass="root-user">
            <div className="user-container">
                <img
                    src={profile?.image_preview_url ?? "/images/punk.png"}
                    className="profilepic"
                />
                <p style={{ textAlign: "center" }}>Welcome {id}</p>
            </div>
            <PostitCanvas />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            id: context.params?.id,
        },
    };
};

export default UserPage;
