import React, { createContext, useContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { TUser } from "../types/types";
import { getNftImage } from "../lib/getNftImage";

export interface IEnsDomain {
    name?: string;
    token_id?: string;
}

export type TEnsDomain = IEnsDomain | any;

interface ContextProps {
    readonly isAuthenticated: boolean;
    readonly setIsAuthenticated: (val: boolean) => void;
    readonly user: TUser;
    readonly setUser: (val: any) => void;
    readonly username: string;
    readonly setUsername: (val: any) => void;
    readonly ensDomain: TEnsDomain;
    readonly setEnsDomain: (val: any) => void;
    readonly pfp: any;
    readonly setPfp: (val: any) => void;
    readonly page: any;
    readonly setPage: (val: any) => void;
    readonly biography: string | any;
    readonly setBiography: (val: string | any) => void;
    readonly twitter: string;
    readonly setTwitter: (val: string) => void;
    readonly saveEnsDomain: (newName: string, newEns: TEnsDomain) => void;
    readonly authenticate: () => void;
    readonly disconnect: () => void;
    readonly hasClaimed: () => boolean | any;
    readonly saveProfile: (editPfp: any, editBio: string) => any;
    readonly deleteUser: () => boolean;
    readonly isOpenseaDown: boolean;
    readonly setIsOpenseaDown: (val: boolean) => void;
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
    biography: null,
    setBiography: () => null,
    twitter: "",
    setTwitter: () => null,
    saveEnsDomain: () => null,
    authenticate: () => null,
    disconnect: () => null,
    hasClaimed: () => null,
    saveProfile: () => null,
    deleteUser: () => false,
    isOpenseaDown: false,
    setIsOpenseaDown: () => null,
});

export const UserProvider: React.FC<{
    children?: React.ReactChild | React.ReactChild[];
}> = ({ children }) => {
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
    const [user, setUser] = useState<TUser>(null);
    const [ensDomain, setEnsDomain] = useState<any>(null);
    const [username, setUsername] = useState<string>("");
    const [pfp, setPfp] = useState<any>(null);
    const [page, setPage] = useState<any>(null);
    const [biography, setBiography] = useState<string | any>(null);
    const [twitter, setTwitter] = useState<string>("");
    const [isOpenseaDown, setIsOpenseaDown] = useState(false);

    /** saves all data in states when loggedin (user-obeject changes) **/
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
            setPfp(null);
        }

        return () => {
            setUser(null);
            setIsAuthenticated(false);
            setEnsDomain(null);
            setUsername("");
            setPfp(null);
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

    /** authentificate/login user and load page **/
    const authenticate = async () => {
        await moralisAuth({ signingMessage: "gm fren" });
        await loadPage();
    };

    /** diconnect/logout user and cleanup all states **/
    const disconnect = async () => {
        await moralisLogout();
        setUser(null);
        setIsAuthenticated(false);
        setEnsDomain(null);
        setUsername("");
    };

    /** load page from DB **/
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
                setBiography(object.get("biography") ?? "");
                setTwitter(object.get("twitterName") ?? "");
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
                        setBiography("");
                        setTwitter("");
                    })
                    .catch((error: any) => {
                        console.error(
                            "Failed to create new page, with error: ",
                            error,
                        );
                        alert(
                            "Failed to create new page, with error code: " +
                                error.message,
                        );
                    });
            }
        }
    };

    /** Load user pfp from DB **/
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
                const options: any = {
                    method: "GET",
                    headers: {
                        "X-API-KEY": process.env.NEXT_PUBLIC_OPENSEEKEY + "",
                    },
                };

                const tokenType = "erc721";
                let baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY}/getNFTMetadata`;
                let finalUrl = `${baseURL}?contractAddress=${ta}&tokenId=${ti}&tokenType=${tokenType}`;
                await fetch(finalUrl, options)
                    .then((response) => response.json())
                    .then((response) => {
                        if (response?.metadata) {
                            let imageUrl = getNftImage(response);
                            setPfp(imageUrl);
                        } else {
                            throw new Error("No metadata available.");
                        }
                    })
                    .catch((err) => {
                        console.error("usercontext loadPfp error: ", err);
                        setIsOpenseaDown(true);
                    });
            } else {
                //console.log("No PFP yet");
            }
        }
    };

    /** Saves ENS domain as state and in DB **/
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

    /** saves new pfp to DB **/
    const saveChangeProfilePic = async (editProfilePic: any) => {
        let data = editProfilePic;

        if (!data) return;

        let PFP = Moralis.Object.extend("ProfilePic");
        let pfp = new PFP();

        pfp.set("owner", user);
        pfp.set("token_address", data.asset_contract?.address);
        pfp.set("token_id", data.token_id);

        pfp.save()
            .then((res: any) => {
                setPfp(data);
            })
            .catch((error: any) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                alert("Failed to save pfp, with error code: " + error.message);
            });
    };

    const savePage = async (editBiography: string) => {
        let PageObject = Moralis.Object.extend("Page");

        let checkUserHasPage = new Moralis.Query(PageObject);
        checkUserHasPage.equalTo("owner", user);
        checkUserHasPage.descending("createdAt");
        const userPage = await checkUserHasPage.first();
        if (userPage) {
            userPage.set("twitterName", twitter ?? "");
            userPage.set("biography", editBiography ?? biography ?? "");
            if (ensDomain) {
                userPage.set("slug", ensDomain?.name);
                userPage.set("ensTokenId", ensDomain?.token_id ?? "");
            }

            userPage
                .save()
                .then(() => {
                    setTwitter(twitter ?? "");
                    setBiography(editBiography ?? biography ?? "");
                    if (ensDomain) {
                        saveEnsDomain(ensDomain?.name, ensDomain);
                    }
                })
                .catch((err: any) =>
                    console.error(
                        "Save new ens slug for page ERROR: ",
                        err.message,
                    ),
                );
        } else {
            let page = new PageObject();

            page.set("owner", user);
            page.set("slug", ensDomain?.name);
            page.set("ensTokenId", ensDomain?.token_id ?? "");
            page.set("twitterName", twitter ?? "");
            page.set("biography", editBiography ?? biography ?? "");
            page.save()
                .then(() => {
                    setTwitter(twitter ?? "");
                    setBiography(biography ?? "");
                    saveEnsDomain(ensDomain?.name, ensDomain);
                })
                .catch((error: any) => {
                    alert(
                        "Failed to create new page, with error code: " +
                            error.message,
                    );
                });
        }
    };

    /** save profile changes **/
    const saveProfile = async (editProfilePic: any, editBiography: string) => {
        await saveChangeProfilePic(editProfilePic).then(() =>
            savePage(editBiography).then(() => {}),
        );
    };

    /** returns user.hasClaimed value **/
    const hasClaimed = () => {
        if (user && moralisUser) {
            return moralisUser.get("hasClaimed") ?? false;
        } else {
            return false;
        }
    };

    /** Deletes the user and all its data **/
    const deleteUser = () => {
        console.log("Delete user");
        return false;
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
                biography,
                setBiography,
                twitter,
                setTwitter,
                isAuthenticated,
                setIsAuthenticated,
                saveEnsDomain,
                authenticate,
                disconnect,
                hasClaimed,
                saveProfile,
                deleteUser,
                isOpenseaDown,
                setIsOpenseaDown,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
