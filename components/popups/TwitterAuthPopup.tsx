import React, { FC, useState, useEffect } from "react";
import { usePopup } from "../../context/PopupContext";
import DonateError from "../errors/DonateError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useUser } from "../../context/UserContext";

interface Props {}

const TwitterAuthPopup: FC<Props> = ({}) => {
    const { twitterAuthPopup, setTwitterAuthPopup } = usePopup();
    const { twitter, setTwitter } = useUser();
    const [error, setError] = useState<any>(null);
    const [isFetching, setIsFetching] = useState(false);

    const [username, setUsername] = useState<string>("");

    const saveTwitter = async () => {
        setTwitter(username);
        setTwitterAuthPopup(false);
    };

    return (
        <div className={"popupbg" + (!twitterAuthPopup ? " hidden" : "")}>
            <div className="popup transferPopup">
                <button
                    className="closepopup"
                    onClick={() => setTwitterAuthPopup(false)}
                    tabIndex={0}
                >
                    <span>&times;</span>
                </button>
                <div className="content flex flex-column-center">
                    <p className="paddingTop paddingBottom">
                        want to validate your twitter acc, ser?
                    </p>
                    <input
                        className="input center font--md"
                        value={username}
                        onChange={(val) => setUsername(val.target.value)}
                        type="text"
                        placeholder="@username"
                    />
                    {/*error && (
                        <DonateError
                            errorCode={(error as any).code ?? 400}
                            errorMessage={error.message ?? ""}
                        />
                    )*/}
                    <button
                        className="sharebutton marginTop button black"
                        onClick={() => saveTwitter()}
                        disabled={isFetching}
                        tabIndex={0}
                    >
                        add Twitter account{" "}
                        <FontAwesomeIcon
                            icon={faTwitter}
                            style={{ fontSize: "1rem", height: "1rem" }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwitterAuthPopup;
