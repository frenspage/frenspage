import { createContext, useContext, useEffect, useState } from "react";
import { ICardItem, TCardItems } from "../types/types";
import { useUser } from "./UserContext";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { punifyCode } from "../lib/textLib";

interface ContextProps {
    readonly content: TCardItems;
    readonly loadContent: () => any;
    readonly addContent: (val: any) => Promise<boolean>;
    readonly deleteContent: (val: any) => void;
    readonly modifyContentItem: (val: any) => void;
    readonly setFrenPage: (val: any) => TCardItems | null;
}

export const PageContentContext = createContext<ContextProps>({
    content: [],
    loadContent: () => null,
    addContent: () => Promise.resolve(false),
    deleteContent: () => null,
    modifyContentItem: () => null,
    setFrenPage: () => null,
});

export const PageContextProvider: React.FC = ({ children }) => {
    const { Moralis } = useMoralis();
    const { page: userPage, user, ensDomain, username } = useUser();
    const [page, setPage] = useState<any>();
    const [content, setContent] = useState<any>([]);

    const router = useRouter();
    const routeredSlug: string = router?.query?.slug as string;
    const lowercasedSlug = routeredSlug?.toLowerCase();
    const slug = punifyCode(lowercasedSlug);

    useEffect(() => {
        if (page) {
            loadContent().then((res) => {});
        } else {
            if (userPage && username === slug) setPage(userPage);
        }
    }, [page, userPage, router]);

    /*** Trigger the useEffect above when the slug changes
    useEffect(() => {
        if (userPage && username === slug) {
            setPage(userPage);
            loadContent(userPage).then((res) => {});
        }
    }, [router]);***/

    const setFrenPage = async (newPage: any) => {
        if (newPage) {
            await setPage(newPage);
            return await loadContent(newPage).then((res) => res);
        }
        return null;
    };

    const getCardItemFromObject = (object: any, index: number) => {
        return {
            id: object.id,
            index: index,
            x: object.get("x"),
            y: object.get("y"),
            rotation: object.get("rotation"),
            isDragging: false,
            content: {
                caption: object.get("caption"),
                path: object.get("filePath"),
            },
            object: object,
        };
    };

    const loadContent = async (newPage: any | (() => void) = null) => {
        let pageToUse = newPage ?? page;
        await setContent(null);
        if (pageToUse) {
            const SlugObject = Moralis.Object.extend("Content");
            const query = new Moralis.Query(SlugObject);
            query.equalTo("page", pageToUse);
            query.ascending("createdAt");
            const object: any = await query.find();

            if (object) {
                let result: TCardItems = [];
                object.forEach((item: any, index: number) => {
                    let card: ICardItem = getCardItemFromObject(item, index);
                    result?.push(card);
                });

                //console.log("Result: ", result);
                if (result) {
                    setContent(result);
                    return result;
                }
            }
        }
        return null;
    };

    const addContent = async (newItem: ICardItem) => {
        if (!newItem || !page) return;

        let ContentObject = Moralis.Object.extend("Content");
        let contentItem = new ContentObject();

        contentItem.set("page", page);
        contentItem.set("caption", newItem?.content?.caption ?? "");
        contentItem.set("filePath", newItem?.content?.path ?? "");
        contentItem.set("rotation", 0);
        contentItem.set("x", newItem?.x ?? 16);
        contentItem.set("y", newItem?.y ?? 16);

        return await contentItem
            .save()
            .then((item: any) => {
                let card: ICardItem = getCardItemFromObject(
                    item,
                    content.length,
                );
                setContent((old: any) => [...old, card]);
                return true;
            })
            .catch((error: any) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                alert("Failed to save card, with error code: " + error.message);
                return false;
            });
    };

    const deleteContent = async (item: ICardItem) => {
        if (!item || !page) return;
        let tempItemContent = item.content;

        await item.object
            ?.destroy()
            .then(async (res: any) => {
                console.log("cardWasDeleted: ", res);
                console.log("contentBeforeDelete: ", tempItemContent);

                if (tempItemContent.path && tempItemContent.path !== "") {
                    const bodyData = {
                        imageUrl: tempItemContent.path,
                        userId: ensDomain?.name ?? "",
                    };

                    await fetch("/api/s3-delete", {
                        method: "POST",
                        body: JSON.stringify(bodyData),
                    })
                        .then((res) => res.json())
                        .then((res) =>
                            console.log("Delete image response: ", res),
                        )
                        .catch((err) =>
                            console.error("delete image error: ", err),
                        );
                }
                /*let filteredItems = content.filter(
                    (it: ICardItem) => it.id !== res.id,
                );

                let reindexedItems = filteredItems.map(
                    (it: ICardItem, itIndex: number) => {
                        return { ...it, index: itIndex };
                    },
                );

                await setContent((old: any) =>
                    old.filter((item: ICardItem) => item.id !== res.id),
                );

                await setContent(reindexedItems);

                /** AWS IMAGE DELETE **/
                await loadContent();
            })
            .catch((err: any) => console.error(err));
    };

    const modifyContentItem = () => {
        console.log("modifyContent");
    };

    return (
        <PageContentContext.Provider
            value={{
                content,
                loadContent,
                addContent,
                deleteContent,
                modifyContentItem,
                setFrenPage,
            }}
        >
            {children}
        </PageContentContext.Provider>
    );
};

export const usePageContent = () => {
    return useContext(PageContentContext);
};
