import type { AppProps } from "next/app";
import "../styles/main.sass";
import { MoralisProvider } from "react-moralis";
import { PopupProvider } from "../context/PopupContext";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    const appId: string = process.env.NEXT_PUBLIC_APPID ?? "";
    const serverUrl: string = process.env.NEXT_PUBLIC_SERVERURL ?? "";
    return (
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <PopupProvider>
                <Head>
                    <title>frens.page</title>
                    <meta name="description" content="gm" />
                    <link rel="icon" href="/images/favicon.png" />
                </Head>
                <Component {...pageProps} />
            </PopupProvider>
        </MoralisProvider>
    );
}

export default MyApp;
