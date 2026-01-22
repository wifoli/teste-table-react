/**
 * Formata o número como moeda BRL
 */
export function currency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

/**
 * Converte uma string de moeda para número
 */
export function parseCurrency(value: string): number {
    const cleaned = value
        .replace(/[R$\s]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    return parseFloat(cleaned) || 0;
}

/**
 * Formata número com separador de milhares
 */
export function number(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

/**
 * Formata como porcentagem
 */
export function percentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Formato compacto de número (1K, 1M, 1B)
 */
export function compact(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        notation: "compact",
        compactDisplay: "short",
    }).format(value);
}
