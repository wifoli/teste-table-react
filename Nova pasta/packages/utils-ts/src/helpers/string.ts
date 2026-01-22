/**
 * Capitaliza a primeira letra de uma string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitaliza cada palavra de uma string
 */
export function capitalizeWords(str: string): string {
    return str.split(" ").map(capitalize).join(" ");
}

/**
 * Converte uma string para slug (URL-friendly)
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

/**
 * Trunca uma string para um comprimento específico, adicionando um sufixo
 */
export function truncate(str: string, length: number, suffix: string = "..."): string {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Limpa espaços extras de uma string (substitui múltiplos espaços por um único)
 */
export function cleanSpaces(str: string): string {
    return str.replace(/\s+/g, " ").trim();
}

/**
 * Verifica se uma string contém uma substring (case insensitive)
 */
export function contains(str: string, search: string): boolean {
    return str.toLowerCase().includes(search.toLowerCase());
}

/**
 * Conta quantas vezes uma substring aparece em uma string
 */
export function countOccurrences(str: string, search: string): number {
    return (str.match(new RegExp(search, "g")) || []).length;
}

/**
 * Reverte uma string
 */
export function reverse(str: string): string {
    return str.split("").reverse().join("");
}

/**
 * Verifica se uma string é um palíndromo
 * Nota: Palíndromo é uma palavra, frase ou sequência que pode ser lida da mesma forma de trás para frente
 */
export function isPalindrome(str: string): boolean {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === reverse(cleaned);
}

/**
 * Mascara uma string (mostra apenas os primeiros e últimos N caracteres)
 * Exemplo: mask('1234567890', 4) -> '1234****7890'
 */
export function mask(str: string, visibleChars: number = 4, maskChar: string = "*"): string {
    if (str.length <= visibleChars * 2) return str;

    const start = str.slice(0, visibleChars);
    const end = str.slice(-visibleChars);
    const middle = maskChar.repeat(str.length - visibleChars * 2);

    return start + middle + end;
}

/**
 * Gera uma string aleatória de um comprimento específico
 * Exemplo: randomString(10) -> 'a1B2c3D4e5'
 */
export function randomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Converte camel case para snake case
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converte snake case para camel case
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Remove acentos de uma string
 * Exemplo: removeAccents('Olá, mundo!') -> 'Ola, mundo!'
 */
export function removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
