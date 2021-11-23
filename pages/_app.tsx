import type { AppProps } from "next/app";
import "../styles/main.sass";

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
