import type { AppProps } from "next/app";
import "../styles/main.sass";
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }: AppProps) {
    const appId: string = process.env.NEXT_PUBLIC_APPID ?? "";
    const serverUrl: string = process.env.NEXT_PUBLIC_SERVERURL ?? "";

    return (
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <Component {...pageProps} />
        </MoralisProvider>
    );
}

export default MyApp;
