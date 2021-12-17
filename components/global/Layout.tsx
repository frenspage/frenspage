import type { NextPage } from "next";
import Script from "next/script";
import Head from "next/Head";

interface Props {
    addClass?: string;
}

const Layout: NextPage<Props> = ({ children, addClass }) => {
    return (
        <div className={"root " + addClass}>
            <Head>
                <title>frens.page</title>
                <meta name="description" content="gm" />
                <link rel="shortcut icon" href="/favicon.gif" />
            </Head>
            {children}
            <Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
        </div>
    );
};
export default Layout;
