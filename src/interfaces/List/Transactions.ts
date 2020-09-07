export enum TransactionType {
    DEPOSIT     = "Depósito",
    WITHDRAW    = "Resgate",
    PAYMENT     = "Pagamento"
}

export interface Transactions {
    type: TransactionType;
    title: string;
    description?: string;
    date: number;
    value: number;
}