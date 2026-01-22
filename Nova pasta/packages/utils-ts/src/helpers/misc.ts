/**
 * Limita um número entre um valor mínimo e máximo
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Arredonda um número para um número específico de casas decimais
 */
export function round(value: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Gera um número aleatório entre um valor mínimo e máximo
 */
export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Verifica se um número está dentro de um intervalo
 */
export function inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}
