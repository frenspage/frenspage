// Add UserContext

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export interface IEnsDomain {
    name?: string;
    token_id?: string;
}

export type TEnsDomain = IEnsDomain | any;

interface ContextProps {
    readonly isAuthenticated: boolean;
    readonly setIsAuthenticated: (val: boolean) => void;
    readonly user: any;
    readonly setUser: (val: any) => void;
    readonly username: string;
    readonly setUsername: (val: any) => void;
    readonly ensDomain: TEnsDomain;
    readonly setEnsDomain: (val: any) => void;
    readonly pfp: any;
    readonly setPfp: (val: any) => void;
    readonly page: any;
    readonly setPage: (val: any) => void;
    readonly saveEnsDomain: (newName: string, newEns: TEnsDomain) => void;
    readonly authenticate: () => void;
}

export const UserContext = createContext<ContextProps>({
    isAuthenticated: false,
    setIsAuthenticated: () => null,
    user: null,
    setUser: () => null,
    ensDomain: null,
    setEnsDomain: () => null,
    username: "",
    setUsername: () => null,
    pfp: null,
    setPfp: () => null,
    page: null,
    setPage: () => null,
    saveEnsDomain: () => null,
    authenticate: () => null,
});

export const UserProvider: React.FC = ({ children }) => {
    const {
        authenticate: moralisAuth,
        isAuthenticated: isMoralisAuthenticated,
        isAuthenticating: isMoralisAuthenticating,
        user: moralisUser,
        isInitialized,
        Moralis,
        setUserData: setMoralisUserData,
    } = useMoralis();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [ensDomain, setEnsDomain] = useState<any>(null);
    const [username, setUsername] = useState<string>("");
    const [pfp, setPfp] = useState<any>(null);
    const [page, setPage] = useState<any>(null);

    useEffect(() => {
        if (moralisUser && isMoralisAuthenticated) {
            setIsAuthenticated(true);
            setUser(moralisUser);
            setEnsDomain(moralisUser?.get("ensusername"));
            setUsername(moralisUser?.get("ensusername"));
            if (!moralisUser.get("ensusername")) {
                let ens = moralisUser.get("username")?.toLowerCase();
                setEnsDomain({ name: ens });
                setUsername(ens);
                setMoralisUserData({ ensusername: ens });
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
            setEnsDomain(null);
            setUsername("");
        }
        return () => {
            setUser(null);
            setIsAuthenticated(false);
            setEnsDomain(null);
            setUsername("");
        };
    }, [
        moralisUser,
        Moralis.Web3API.account,
        isMoralisAuthenticated,
        isMoralisAuthenticating,
    ]);

    const authenticate = async () => {
        await moralisAuth();
    };

    const saveEnsDomain = async (newName: string, newENS: TEnsDomain) => {
        let tokenId = newENS?.token_id ?? newENS?.attributes?.ensTokenId ?? "";
        let ensusername =
            newName?.toLowerCase() ??
            user?.get("ensusername") ??
            user?.get("username");

        await setEnsDomain({
            name: ensusername,
            token_id: tokenId,
        });

        setMoralisUserData({ ensusername: ensusername.toLowerCase() });

        await setUsername(ensusername);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                ensDomain,
                setEnsDomain,
                username,
                setUsername,
                pfp,
                setPfp,
                page,
                setPage,
                isAuthenticated,
                setIsAuthenticated,
                saveEnsDomain,
                authenticate,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
