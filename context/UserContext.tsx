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
    readonly disconnect: () => void;
    readonly hasClaimed: () => boolean | any;
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
    disconnect: () => null,
    hasClaimed: () => null,
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
        logout: moralisLogout,
    } = useMoralis();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [ensDomain, setEnsDomain] = useState<any>(null);
    const [username, setUsername] = useState<string>("");
    const [pfp, setPfp] = useState<any>(null);
    const [page, setPage] = useState<any>(null);

    useEffect(() => {
        if (moralisUser && isMoralisAuthenticated) {
            setUser(moralisUser);

            if (moralisUser.get("ensusername")) {
                setEnsDomain(moralisUser?.get("ensusername"));
                setUsername(moralisUser?.get("ensusername"));
            } else {
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

    useEffect(() => {
        if (user) {
            loadPage().then(() => loadPFP().then());
        }
    }, [user, Moralis.Web3API.account]);

    const authenticate = async () => {
        await moralisAuth();
        await loadPage();
    };

    const disconnect = async () => {
        await moralisLogout();
        setUser(null);
        setIsAuthenticated(false);
        setEnsDomain(null);
        setUsername("");
    };

    const loadPage = async () => {
        if (user) {
            //const slug = user?.get("ensusername") ?? user?.get("username");

            const SlugObject = Moralis.Object.extend("Page");
            const query = new Moralis.Query(SlugObject);
            query.equalTo("owner", user);
            query.descending("createdAt");
            const object: any = await query.first();

            if (object) {
                setPage(object);
                saveEnsDomain(object.get("slug"), object);
                setIsAuthenticated(true);
            } else {
                let slug = user?.get("username").toLowerCase();
                let MoralisPage = Moralis.Object.extend("Page");
                let pageObject = new MoralisPage();

                pageObject.set("owner", user);
                pageObject.set("slug", slug);
                pageObject.set("ethAddress", user?.get("ethAddress"));
                pageObject
                    .save()
                    .then((res: any) => {
                        setPage(res);
                        setIsAuthenticated(true);
                        saveEnsDomain(user?.get("username"), {
                            name: user?.get("username"),
                        });
                    })
                    .catch((error: any) => {
                        alert(
                            "Failed to create new page, with error code: " +
                                error.message,
                        );
                    });
            }
        }
    };

    const loadPFP = async () => {
        if (user) {
            setPfp(null);
            const PFP = Moralis.Object.extend("ProfilePic");
            const query = new Moralis.Query(PFP);
            query.equalTo("owner", user);
            query.descending("createdAt");
            const object = await query?.first();

            if (object && object.isDataAvailable()) {
                let ta = object.get("token_address");
                let ti = object.get("token_id");
                const options = { method: "GET" };
                fetch(
                    `https://api.opensea.io/api/v1/asset/${ta}/${ti}/`,
                    options,
                )
                    .then((response) => response.json())
                    .then((response) => {
                        setPfp(response);
                    })
                    .catch((err) => console.error(err));
            } else {
                //console.log("No PFP yet");
            }
        }
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
        await setUsername(ensusername);
        await setMoralisUserData({ ensusername: ensusername.toLowerCase() });
    };

    const hasClaimed = () => {
        if (user && moralisUser) {
            return moralisUser.get("hasClaimed") ?? false;
        } else {
            return false;
        }
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
                disconnect,
                hasClaimed,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
