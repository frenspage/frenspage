import type { NextPage } from "next";
import React, { useEffect } from "react";
import Layout from "../components/global/Layout";
import { useRouter } from "next/router";

const Home: NextPage = () => {
    const router = useRouter();

    return (
        <Layout showFooter={true}>
            <div className="container">
                <div id="loggedoutcontent" className="content">
                    <div>
                        gn fren
                        <br />
                        <br />
                        <a
                            href=" https://twitter.com/FrensPage/status/1598670523029856256?s=20&t=4y9XdgG2OFdL3Vk13injkA"
                            target="_blank"
                        >
                            <button className="connectwallet">
                                Read Tweet
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
