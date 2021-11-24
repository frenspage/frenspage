import type { NextPage } from "next";
import Script from "next/script";

const Scripts: NextPage = () => {
    return (
        <>
            <Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
            <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
            <Script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js" />
            <Script src="https://unpkg.com/moralis/dist/moralis.js" />
            <Script src="../../canvas/lib/msh.js" />
        </>
    );
};
export default Scripts;
