import React, { useState, createContext, useContext } from "react";

interface ContextProps {
    readonly showEditProfilePopup: boolean;
    readonly setShowEditProfilePopup: (value: boolean) => void;
    readonly showEditENSPopup: boolean;
    readonly setShowEditENSPopup: (value: boolean) => void;
    readonly showEditProfilePicPopup: boolean;
    readonly setShowEditProfilePicPopup: (value: boolean) => void;
}

export const PopupContext = createContext<ContextProps>({
    showEditProfilePopup: false,
    setShowEditProfilePopup: () => null,
    showEditENSPopup: false,
    setShowEditENSPopup: () => null,
    showEditProfilePicPopup: false,
    setShowEditProfilePicPopup: () => null,
});

export const PopupProvider: React.FC = ({ children }) => {
    const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);
    const [showEditENSPopup, setShowEditENSPopup] = useState(false);
    const [showEditProfilePicPopup, setShowEditProfilePicPopup] =
        useState(false);

    return (
        <PopupContext.Provider
            value={{
                showEditProfilePopup,
                setShowEditProfilePopup,
                showEditENSPopup,
                setShowEditENSPopup,
                showEditProfilePicPopup,
                setShowEditProfilePicPopup,
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = () => {
    return useContext(PopupContext);
};
