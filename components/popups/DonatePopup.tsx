import React, { FC, useState, useEffect } from "react";
import { useMoralis, useWeb3Transfer } from "react-moralis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { usePopup } from "../../context/PopupContext";
import DonateError from "../errors/DonateError";

interface Props {
    ethAddress: string;
}

const DonatePopup: FC<Props> = ({ ethAddress }) => {
    const [transferMessage, setTransferMessage] = useState("");
    const [price, setPrice] = useState<number>(0.1);
    const { transferPopup, setTransferPopup } = usePopup();

    const { Moralis } = useMoralis();
    const {
        web3,
        enableWeb3,
        isWeb3Enabled,
        isWeb3EnableLoading,
        web3EnableError,
    } = useMoralis();

    const {
        fetch: transfer,
        error,
        isFetching,
    } = useWeb3Transfer({
        amount: Moralis.Units.ETH(price && price > 0 ? price : 0.1),
        receiver: ethAddress,
        type: "native",
    });

    const sendDonation = async () => {
        if (isWeb3Enabled) {
            await transfer().then((data: any) => {
                setTransferMessage(data?.message);
            });
        }
    };
    useEffect(() => {
        enableWeb3();
    }, []);

    const onChange = (e: string) => {
        const re = new RegExp("^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$");
        if (e === "" || re.test(e)) {
            setPrice(parseFloat(e));
        }
    };

    return (
        <div className={"popupbg" + (!transferPopup ? " hidden" : "")}>
            <div className="popup transferPopup">
                <div
                    className="closepopup"
                    onClick={() => setTransferPopup(false)}
                >
                    <span>&times;</span>
                </div>
                <div className="content flex flex-column-center">
                    {transferMessage && transferMessage !== "" && (
                        <div className="paddingBottom">
                            <p>{transferMessage}</p>
                        </div>
                    )}
                    How much ETH, ser?
                    <input
                        className="input width--s center"
                        value={price}
                        onChange={(val) => onChange(val.target.value)}
                        type="number"
                        step={0.1}
                        min={0.1}
                    />
                    {error && (
                        <DonateError
                            errorCode={(error as any).code ?? 400}
                            errorMessage={error.message ?? ""}
                        />
                    )}
                    <button
                        className="sharebutton marginTop"
                        onClick={() => sendDonation()}
                        disabled={isFetching}
                        tabIndex={0}
                    >
                        Send donation <FontAwesomeIcon icon={faEthereum} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonatePopup;
