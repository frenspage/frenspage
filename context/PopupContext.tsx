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
});

export const PopupProvider: React.FC = ({ children }) => {
    const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);
    const [showEditENSPopup, setShowEditENSPopup] = useState(false);
    const [showEditProfilePicPopup, setShowEditProfilePicPopup] =
        useState(false);
    const [showFirstTimePopup, setShowFirstTimePopup] = useState(false);
    const [frenPopup, setFrenPopup] = useState(false);

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
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    return useContext(PopupContext);
};
