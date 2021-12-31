import React, { FC, useState } from "react";
import { usePopup } from "../../context/PopupContext";
import { useUser } from "../../context/UserContext";

interface Props {}

const TwitterAuthPopup: FC<Props> = ({}) => {
    const { twitterAuthPopup, setTwitterAuthPopup } = usePopup();
    const { twitter, setTwitter } = useUser();

    const [username, setUsername] = useState<string>("");

    const saveTwitter = async () => {
        let editedName = username.startsWith("@")
            ? username.substring(1)
            : username;
        setTwitter(editedName);
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
                        want to add your twitter acc, ser?
                    </p>
                    <input
                        className="input center font--md"
                        value={username}
                        onChange={(val) => setUsername(val.target.value)}
                        type="text"
                        placeholder="@username"
                    />
                    <button
                        className="marginTop button black"
                        onClick={() => saveTwitter()}
                        tabIndex={0}
                    >
                        {twitter ? "update" : "add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwitterAuthPopup;
