/**
 * Remove duplicatas do array
 * ex: unique([1, 2, 2, 3]) -> [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
    return [...new Set(array)];
}

/**
 * Agrupa um array de objetos por uma chave específica
 * ex: groupBy([{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 1, name: 'C' }], 'id')
 * -> { '1': [{ id: 1, name: 'A' }, { id: 1, name: 'C' }], '2': [{ id: 2, name: 'B' }] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce(
        (result, item) => {
            const groupKey = String(item[key]);
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        },
        {} as Record<string, T[]>,
    );
}

/**
 * Divide um array em pedaços menores de tamanho fixo
 * ex: chunk([1, 2, 3, 4, 5], 2) -> [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

// Sort array by key
/**
 * Ordena um array de objetos por uma chave específica
 * ex: sortBy([{ id: 2 }, { id: 1 }], 'id', 'asc') -> [{ id: 1 }, { id: 2 }]
 */
export function sortBy<T>(array: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
    });
}

/**
 * Achata arrays aninhados
 * ex: flatten([1, [2, 3], [4, [5]]]) -> [1, 2, 3, 4, 5]
 */
export function flatten<T>(array: (T | T[])[]): T[] {
    return array.flat(Infinity) as T[];
}

/**
 * Retorna um item aleatório de um array
 * ex: sample([1, 2, 3]) -> 2 (ou outro número aleatório)
 */
export function sample<T>(array: T[]): T | undefined {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Embaralha os itens de um array
 * ex: shuffle([1, 2, 3]) -> [3, 1, 2] (ou outra ordem aleatória)
 */
export function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Soma os números do array
 * ex: sum([1, 2, 3]) -> 6
 */
export function sum(array: number[]): number {
    return array.reduce((acc, val) => acc + val, 0);
}

/**
 * Média do array
 * ex: average([1, 2, 3]) -> 2
 */
export function average(array: number[]): number {
    return array.length > 0 ? sum(array) / array.length : 0;
}

/**
 * Encontra o maior valor em um array
 * ex: max([1, 2, 3]) -> 3
 */
export function max(array: number[]): number | undefined {
    return array.length > 0 ? Math.max(...array) : undefined;
}

/**
 * Encontra o menor valor em um array
 * ex: min([1, 2, 3]) -> 1
 */
export function min(array: number[]): number | undefined {
    return array.length > 0 ? Math.min(...array) : undefined;
}

/**
 * Divide um array em dois arrays com base em uma condição
 * ex: partition([1, 2, 3, 4], x => x % 2 === 0) -> [[2, 4], [1, 3]]
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const pass: T[] = [];
    const fail: T[] = [];

    array.forEach((item) => {
        if (predicate(item)) {
            pass.push(item);
        } else {
            fail.push(item);
        }
    });

    return [pass, fail];
}
