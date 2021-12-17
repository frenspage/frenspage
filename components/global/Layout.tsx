import type { NextPage } from "next";
import Script from "next/script";

interface Props {
    addClass?: string;
}

const Layout: NextPage<Props> = ({ children, addClass }) => {
    return (
        <div className={"root " + addClass}>
            {children}
            <Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
        </div>
    );
};
export default Layout;
