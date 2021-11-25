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
