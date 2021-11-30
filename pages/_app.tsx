import type { AppProps } from "next/app";
import "../styles/main.sass";
import { MoralisProvider } from "react-moralis";
import { PopupProvider } from "../context/PopupContext";

function MyApp({ Component, pageProps }: AppProps) {
    const appId: string = process.env.NEXT_PUBLIC_APPID ?? "";
    const serverUrl: string = process.env.NEXT_PUBLIC_SERVERURL ?? "";

    return (
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <PopupProvider>
                <Component {...pageProps} />
            </PopupProvider>
        </MoralisProvider>
    );
}

export default MyApp;
