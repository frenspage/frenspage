import { createContext, useContext, useEffect, useState } from "react";
import { ICardItem, TCardItems } from "../types/types";
import { useUser } from "./UserContext";
import { useMoralis } from "react-moralis";

interface ContextProps {
    readonly content: TCardItems;
    readonly addContent: (val: any) => void;
    readonly modifyContentItem: (val: any) => void;
}

export const PageContentContext = createContext<ContextProps>({
    content: [],
    addContent: () => null,
    modifyContentItem: () => null,
});

export const PageContextProvider: React.FC = ({ children }) => {
    const { Moralis } = useMoralis();
    const { page } = useUser();
    const [content, setContent] = useState<any>([]);

    useEffect(() => {
        if (page) {
            loadContent().then((res) => {});
        }
    }, [page]);

    const getCardItemFromObject = (object: any, index: number) => {
        return {
            id: object.id,
            index: index,
            x: object.get("x"),
            y: object.get("y"),
            rotation: 0,
            isDragging: false,
            content: {
                caption: object.get("caption"),
                path: object.get("filePath"),
            },
            object: object,
        };
    };

    const loadContent = async () => {
        if (page) {
            const SlugObject = Moralis.Object.extend("Content");
            const query = new Moralis.Query(SlugObject);
            query.equalTo("page", page);
            query.descending("createdAt");
            const object: any = await query.find();

            if (object) {
                let result: TCardItems = [];
                object.forEach((item: any, index: number) => {
                    let card: ICardItem = getCardItemFromObject(item, index);
                    result?.push(card);
                });
                if (result) setContent(result);
            }
        }
    };

    const addContent = (newItem: ICardItem) => {
        if (!newItem || !page) return;

        let ContentObject = Moralis.Object.extend("Content");
        let contentItem = new ContentObject();

        contentItem.set("page", page);
        contentItem.set("caption", newItem?.content?.caption ?? "");
        contentItem.set("filePath", newItem?.content?.path ?? "");
        contentItem.set("x", newItem?.x ?? 16);
        contentItem.set("y", newItem?.y ?? 16);

        contentItem
            .save()
            .then((item: any) => {
                let card: ICardItem = getCardItemFromObject(
                    item,
                    content.length,
                );
                setContent((old: any) => [...old, card]);
                console.log("AddContent res", card);
            })
            .catch((error: any) => {
                // Execute any logic that should take place if the save fails.
                // error is a Moralis.Error with an error code and message.
                alert("Failed to save card, with error code: " + error.message);
            });
    };

    const modifyContentItem = () => {
        console.log("modifyContent");
    };

    return (
        <PageContentContext.Provider
            value={{ content, addContent, modifyContentItem }}
        >
            {children}
        </PageContentContext.Provider>
    );
};

export const usePageContent = () => {
    return useContext(PageContentContext);
};
