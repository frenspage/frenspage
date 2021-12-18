import type { NextPage } from "next";
import Script from "next/script";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface Props {
    addClass?: string;
    showFooter?: boolean;
}

const Layout: NextPage<Props> = ({
    children,
    addClass = "",
    showFooter = false,
}) => {
    return (
        <div className={"root " + addClass}>
            {children}
            {showFooter && (
                <footer className="footer">
                    <a
                        href="https://twitter.com/FrensPage"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                        href="https://discord.gg/9chXdS2V"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon icon={faDiscord} />
                    </a>
                </footer>
            )}
            <Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
        </div>
    );
};
export default Layout;
