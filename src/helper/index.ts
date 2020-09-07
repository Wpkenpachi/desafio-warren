export function currencyMask(valueNumber: number): string {
    const value = parseFloat((valueNumber / 100).toString());
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(value);
}