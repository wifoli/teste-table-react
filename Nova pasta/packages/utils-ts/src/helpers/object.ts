/**
 * Clona um objeto profundamente (apenas para objetos simples)
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Mescla um objeto com as chaves especificadas
 * ex: pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) -> { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}

/**
 * Remove as chaves especificadas de um objeto
 * ex: omit({ a: 1, b: 2, c: 3 }, ['a', 'c']) -> { b: 2 }
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
        delete result[key];
    });
    return result;
}

/**
 * Mescla objetos profundamente
 * Exemplo: merge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 }) -> { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * Nota: Este método não é seguro para objetos complexos ou com ciclos de referência.
 * Use com cuidado e apenas para objetos simples.
 */
export function merge<T extends object>(target: T, ...sources: Partial<T>[]): T {
    const result = { ...target };

    sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
            const sourceValue = source[key as keyof T];
            const targetValue = result[key as keyof T];

            if (isObject(sourceValue) && isObject(targetValue)) {
                result[key as keyof T] = merge(targetValue as any, sourceValue as any);
            } else {
                result[key as keyof T] = sourceValue as any;
            }
        });
    });

    return result;
}

/**
 * Verifica se o valor é um objeto
 */
function isObject(value: any): value is object {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Obtém uma propriedade aninhada de um objeto por caminho
 * Exemplo: get({ a: { b: { c: 1 } } }, 'a.b.c') -> 1
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T {
    const keys = path.split(".");
    let result = obj;

    for (const key of keys) {
        result = result?.[key];
        if (result === undefined) {
            return defaultValue as T;
        }
    }

    return result as T;
}

/**
 * Define uma propriedade aninhada de um objeto por caminho
 * Exemplo: set({}, 'a.b.c', 1) -> { a: { b: { c: 1 } } }
 *
 * Nota: Este método cria objetos intermediários se eles não existirem.
 * Use com cuidado para evitar sobrescrever objetos existentes.
 */
export function set(obj: any, path: string, value: any): void {
    const keys = path.split(".");
    const lastKey = keys.pop()!;

    let current = obj;
    for (const key of keys) {
        if (!(key in current) || !isObject(current[key])) {
            current[key] = {};
        }
        current = current[key];
    }

    current[lastKey] = value;
}

/**
 * Verifica se um objeto está vazio (sem chaves)
 */
export function isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0;
}

/**
 * Obtém as chaves de um objeto com segurança de tipo
 * ex: keys({ a: 1, b: 2 }) -> ['a', 'b']
 */
export function keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

/**
 * Obtém os valores de um objeto com segurança de tipo
 * ex: values({ a: 1, b: 2 }) -> [1, 2]
 */
export function values<T extends object>(obj: T): T[keyof T][] {
    return Object.values(obj) as T[keyof T][];
}

/**
 * Obtém as entradas (pares chave-valor) de um objeto com segurança de tipo
 * ex: entries({ a: 1, b: 2 }) -> [['a', 1], ['b', 2]]
 */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
}
