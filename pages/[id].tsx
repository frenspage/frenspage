import type { NextPage, GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { init } from "../canvas/main";
import Layout from "../components/global/Layout";

interface Props {
    id: string;
    data: any;
}

const UserPage: NextPage<Props> = ({ id, data }) => {
    useEffect(() => {
        init();
    }, []);

    return (
        <Layout addClass="root-user">
            <div className="user-container">
                <div
                    className="profilepicselect myprofilepic"
                    style={{ backgroundImage: "url('/images/punk.png')" }}
                    data-onClick="openProfilePicSelect();"
                >
                    {" "}
                </div>
                <p style={{ textAlign: "center" }}>Welcome {id}</p>
            </div>
            <div id="main-canvas-container" className="canvas-container">
                {" "}
            </div>

            <button className="fab" id="fab">
                +
            </button>
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
