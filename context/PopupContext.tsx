import React, { useState, createContext, useContext } from "react";

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
});

export const PopupProvider: React.FC = ({ children }) => {
    const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);
    const [showEditENSPopup, setShowEditENSPopup] = useState(false);
    const [showEditProfilePicPopup, setShowEditProfilePicPopup] =
        useState(false);
    const [showFirstTimePopup, setShowFirstTimePopup] = useState(false);
    const [frenPopup, setFrenPopup] = useState(false);
    const [transferPopup, setTransferPopup] = useState(false);
    const [twitterAuthPopup, setTwitterAuthPopup] = useState(false);

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
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    return useContext(PopupContext);
};
