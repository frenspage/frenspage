export const getNftImage = (response: any): string => {
    if (!response) return "/images/punk.png";
    return (
        response.metadata?.thumbnail ??
        response.metadata?.thumbnail_url ??
        response.metadata?.image_url ??
        response.metadata?.image
    );
};
