// Add UserContext

import React, { createContext, useContext, useState } from "react";

interface ContextProps {
    readonly disconnectIsShown: boolean;
    readonly setDisconnectIsShown: (val: boolean) => void;
}

export const UserContext = createContext<ContextProps>({
    disconnectIsShown: false,
    setDisconnectIsShown: () => null,
});

export const UserProvider: React.FC = ({ children }) => {
    const [disconnectIsShown, setDisconnectIsShown] = useState(false);

    return (
        <UserContext.Provider
            value={{ disconnectIsShown, setDisconnectIsShown }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
