export interface INFT {
    amount?: string;
    block_number?: string;
    block_number_minted?: string;
    contract_type: string;
    frozen?: number;
    is_valid?: number;
    metadata?: string;
    name?: string;
    symbol?: string;
    owner_of?: string;
    synced_of?: string | Date | any;
    token_address?: string;
    token_id?: string | number | any;
    token_url?: string;
}
export interface INFTs {
    page?: number;
    page_size?: number;
    result?: INFT[] | [];
    total?: number;
}

export interface ICardItem {
    id: string;
    index: number;
    x: number;
    y: number;
    rotation: number;
    isDragging: boolean;
    content: {
        caption: string;
        path: string | any;
    };
    object: any; // Moralis object to update/save/destroy
}

export type TCardItems = Array<ICardProps> | Array;

export interface ICardProps {
    index: string | number;
    item: ICardItem | any;
    handleDragStart?: (e: any) => void;
    handleDragEnd?: (e: any) => void;
    handleClick?: (e: any) => void;
    handleMouseEnter?: (e: any) => void;
    handleMouseLeave?: (e: any) => void;
    isUsersOwnPage?: boolean;
}

/** AWS S3 TYPES **/
interface IS3Config {
    bucketName: string;
    dirName: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    s3Url: string;
}

export interface IS3UploadResponse {
    bucket?: string;
    key?: string;
    location?: string;
    signedRequest?: any;
}
