import type { AppProps } from "next/app";
import "../styles/main.sass";
import { MoralisProvider } from "react-moralis";
import { PopupProvider } from "../context/PopupContext";
import Head from "next/head";
import { UserProvider } from "../context/UserContext";
import { PageContextProvider } from "../context/PageContentContext";
import { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

function MyApp({ Component, pageProps }: AppProps) {
    const appId: string = process.env.NEXT_PUBLIC_APPID ?? "";
    const serverUrl: string = process.env.NEXT_PUBLIC_SERVERURL ?? "";

    const [hasAccess, setHasAccess] = useLocalStorage(
        "hasAccessToDev",
        "false",
    );
    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_SHOWLOGIN);
        if (
            process.env.NEXT_PUBLIC_SHOWLOGIN === "1" &&
            hasAccess === "false"
        ) {
            let result = prompt("password:");
            if (result === process.env.NEXT_PUBLIC_PASSWORD) {
                setHasAccess("true");
            }
        }
    }, []);

    if (process.env.NEXT_PUBLIC_SHOWLOGIN === "1" && hasAccess === "false")
        return null;

    return (
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <UserProvider>
                <PageContextProvider>
                    <PopupProvider>
                        <Head>
                            <title>frens.page</title>
                            <meta name="description" content="gm" />
                            <link rel="icon" href="/images/favicon.png" />
                        </Head>
                        <Component {...pageProps} />
                    </PopupProvider>
                </PageContextProvider>
            </UserProvider>
        </MoralisProvider>
    );
}

export default MyApp;
