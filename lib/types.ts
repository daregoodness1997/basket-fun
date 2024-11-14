export type Basket = {
    basket_id: string;
    basket_name: string;
    rebalance_interval: number;
    created_at: string;
};

export type BasketToken = {
    id: string;
    basket_id: string;
    token_symbol: string;
    token_address: string;
    allocation: number;
};

export type TokenPrice = {
    id: string;
    token_symbol: string;
    token_address: string;
    price: number;
    volume: number;
    timestamp: string;
};

export type TokenHistory = {
    id: string;
    token_symbol: string;
    token_address: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: string;
};

export type BasketValue = {
    id: string;
    basket_id: string;
    total_value: number;
    timestamp: string;
};
