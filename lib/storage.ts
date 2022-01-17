import { Web3Storage } from "web3.storage";

export const makeStorageClient = () => {
    return new Web3Storage({
        token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN ?? "",
    });
};

export const createWithNewFileName = (file: File) => {
    let fileName = `${Math.floor(Math.random() * 1000)}_${+new Date()}_${
        file.name
    }`;

    return new File([file], fileName, {
        type: file.type,
    });
};

export const makeFileObjects = () => {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = { hello: "world" };
    const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

    const files = [
        new File(["contents-of-file-1"], "plain-utf8.txt"),
        new File([blob], "hello.json"),
    ];
    return files;
};

export const storeFiles = async (file: any) => {
    const client = makeStorageClient();
    const cid = await client.put([file]);
    //console.log("stored files with cid:", cid);
    return cid;
};

export const storeWithProgress = (
    file: any,
    setUploadProgress: (val: any) => void,
) => {
    if (!file) return;
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid: any) => {
        console.log("uploading file with cid:", cid);
    };

    // when each chunk is stored, update the percentage complete and display
    const totalSize = file.size;
    let uploaded = 0;

    const onStoredChunk = (size: any) => {
        uploaded += size;
        const pct = totalSize / uploaded;
        const number = pct.toFixed(2);
        setUploadProgress(number);
        console.log(`Uploading... ${number}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put([file], { onRootCidReady, onStoredChunk });
};

export const retrieveFiles = async (cid: any) => {
    const client = makeStorageClient();
    const res = await client.get(cid);
    if (!res?.ok) {
        throw new Error(`failed to get ${cid}`);
    }

    const files: any = await res.files();
    if (files.length > 0) {
        return files[0];
    }
    return null;
};
