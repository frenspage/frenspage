/** File and Storage library **/

export const createWithNewFileName = (file: File): File | null => {
    if (!file) return null;
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
