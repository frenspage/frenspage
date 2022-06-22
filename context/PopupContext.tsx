import React, { useState, createContext, useContext, useEffect } from "react";

interface ContextProps {
    readonly showEditProfilePopup: boolean;
    readonly setShowEditProfilePopup: (value: boolean) => void;
    readonly showEditENSPopup: boolean;
    readonly setShowEditENSPopup: (value: boolean) => void;
    readonly showEditProfilePicPopup: boolean;
    readonly setShowEditProfilePicPopup: (value: boolean) => void;
    readonly showFirstTimePopup: boolean;
    readonly setShowFirstTimePopup: (value: boolean) => void;
    readonly frenPopup: boolean;
    readonly setFrenPopup: (value: boolean) => void;
    readonly transferPopup: boolean;
    readonly setTransferPopup: (value: boolean) => void;
    readonly twitterAuthPopup: boolean;
    readonly setTwitterAuthPopup: (value: boolean) => void;
    readonly editCardPopup: boolean;
    readonly setEditCardPopup: (value: boolean) => void;
    readonly frenCardPopup: boolean;
    readonly setFrenCardPopup: (value: boolean) => void;
    readonly cropImagePopup: boolean;
    readonly setCropImagePopup: (value: boolean) => void;
    readonly confirmPopup: boolean;
    readonly setConfirmPopup: (value: boolean) => void;
}

export const PopupContext = createContext<ContextProps>({
    showEditProfilePopup: false,
    setShowEditProfilePopup: () => null,
    showEditENSPopup: false,
    setShowEditENSPopup: () => null,
    showEditProfilePicPopup: false,
    setShowEditProfilePicPopup: () => null,
    showFirstTimePopup: false,
    setShowFirstTimePopup: () => null,
    frenPopup: false,
    setFrenPopup: () => null,
    transferPopup: false,
    setTransferPopup: () => null,
    twitterAuthPopup: false,
    setTwitterAuthPopup: () => null,
    editCardPopup: false,
    setEditCardPopup: () => null,
    frenCardPopup: false,
    setFrenCardPopup: () => null,
    cropImagePopup: false,
    setCropImagePopup: () => null,
    confirmPopup: false,
    setConfirmPopup: () => null,
});

export const PopupProvider: React.FC<{
    children?: React.ReactChild | React.ReactChild[];
}> = ({ children }) => {
    const [showEditProfilePopup, _setShowEditProfilePopup] = useState(false);
    const [showEditENSPopup, _setShowEditENSPopup] = useState(false);
    const [showEditProfilePicPopup, _setShowEditProfilePicPopup] =
        useState(false);
    const [showFirstTimePopup, _setShowFirstTimePopup] = useState(false);
    const [frenPopup, _setFrenPopup] = useState(false);
    const [transferPopup, _setTransferPopup] = useState(false);
    const [twitterAuthPopup, _setTwitterAuthPopup] = useState(false);
    const [editCardPopup, _setEditCardPopup] = useState(false);
    const [frenCardPopup, _setFrenCardPopup] = useState(false);
    const [cropImagePopup, _setCropImagePopup] = useState(false);
    const [confirmPopup, _setConfirmPopup] = useState(false);

    /** Opened-Popup timeline/history, to track which popup should be closed at first with escape-key **/
    const [timeline, _setTimeline] = useState<Array<string>>([]);
    const timelineRef = React.useRef(timeline);
    const setTimeline = (data: any) => {
        timelineRef.current = data;
        _setTimeline(data);
    };

    useEffect(() => {
        window.addEventListener("keydown", (evt) => escapeChecker(evt));
        return () => {
            window.removeEventListener("keydown", (evt) => escapeChecker(evt));
        };
    }, []);

    const escapeChecker = (evt: KeyboardEvent) => {
        let current = timelineRef.current;

        if (current.length > 0) {
            if (evt.keyCode == 27 || evt.key === "Escape") {
                let popup = current[current.length - 1];
                switch (popup) {
                    case "showEditProfilePopup":
                        setShowEditProfilePopup(false);
                        break;
                    case "showEditENSPopup":
                        setShowEditENSPopup(false);
                        break;
                    case "showEditProfilePicPopup":
                        setShowEditProfilePicPopup(false);
                        break;
                    case "showFirstTimePopup":
                        setShowFirstTimePopup(false);
                        break;
                    case "frenPopup":
                        setFrenPopup(false);
                        break;
                    case "transferPopup":
                        setTransferPopup(false);
                        break;
                    case "twitterAuthPopup":
                        setTwitterAuthPopup(false);
                        break;
                    case "editCardPopup":
                        setEditCardPopup(false);
                        break;
                    case "frenCardPopup":
                        setFrenCardPopup(false);
                        break;
                    case "cropImagePopup":
                        setCropImagePopup(false);
                        break;
                    case "confirmPopup":
                        setConfirmPopup(false);
                        break;
                }
            }
        }
    };

    const changeTimeline = (val: boolean, name: string) => {
        if (val) setTimeline([...timeline, name]);
        else
            setTimeline(
                timelineRef.current.filter((item: string) => item !== name),
            );
    };

    const setShowEditProfilePopup = (val: boolean) => {
        changeTimeline(val, "showEditProfilePopup");
        _setShowEditProfilePopup(val);
    };

    const setShowEditENSPopup = (val: boolean) => {
        changeTimeline(val, "showEditENSPopup");
        _setShowEditENSPopup(val);
    };
    const setShowEditProfilePicPopup = (val: boolean) => {
        changeTimeline(val, "showEditProfilePicPopup");
        _setShowEditProfilePicPopup(val);
    };
    const setShowFirstTimePopup = (val: boolean) => {
        changeTimeline(val, "showFirstTimePopup");
        _setShowFirstTimePopup(val);
    };
    const setFrenPopup = (val: boolean) => {
        changeTimeline(val, "frenPopup");
        _setFrenPopup(val);
    };
    const setTransferPopup = (val: boolean) => {
        changeTimeline(val, "transferPopup");
        _setTransferPopup(val);
    };
    const setTwitterAuthPopup = (val: boolean) => {
        changeTimeline(val, "twitterAuthPopup");
        _setTwitterAuthPopup(val);
    };
    const setEditCardPopup = (val: boolean) => {
        changeTimeline(val, "editCardPopup");
        _setEditCardPopup(val);
    };
    const setFrenCardPopup = (val: boolean) => {
        changeTimeline(val, "frenCardPopup");
        _setFrenCardPopup(val);
    };
    const setCropImagePopup = (val: boolean) => {
        changeTimeline(val, "cropImagePopup");
        _setCropImagePopup(val);
    };
    const setConfirmPopup = (val: boolean) => {
        changeTimeline(val, "confirmPopup");
        _setConfirmPopup(val);
    };

    return (
        <PopupContext.Provider
            value={{
                showEditProfilePopup,
                setShowEditProfilePopup,
                showEditENSPopup,
                setShowEditENSPopup,
                showEditProfilePicPopup,
                setShowEditProfilePicPopup,
                showFirstTimePopup,
                setShowFirstTimePopup,
                frenPopup,
                setFrenPopup,
                transferPopup,
                setTransferPopup,
                twitterAuthPopup,
                setTwitterAuthPopup,
                editCardPopup,
                setEditCardPopup,
                frenCardPopup,
                setFrenCardPopup,
                cropImagePopup,
                setCropImagePopup,
                confirmPopup,
                setConfirmPopup,
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    return useContext(PopupContext);
};
