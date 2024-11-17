export type Basket = {
    id: string;
    name: string;
    rebalanceInterval: number;
    createdAt: string;
    tokens: BasketToken[];
    currentPrice: number;
    price1hChange: number;
    price4hChange: number;
    price24hChange: number;
};

export type BasketToken = {
    id?: string;
    basket_id?: string;
    symbol: string;
    address: string;
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
