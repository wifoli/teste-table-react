/**
 * Pausa por um número especificado de milissegundos
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Tenta executar uma função várias vezes com um intervalo crescente entre as tentativas
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options?: {
        retries?: number;
        delay?: number;
        backoff?: number;
    },
): Promise<T> {
    const { retries = 3, delay = 1000, backoff = 2 } = options || {};

    let lastError: Error | undefined;

    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < retries - 1) {
                await sleep(delay * Math.pow(backoff, i));
            }
        }
    }

    throw lastError;
}

/**
 * Função debounce para limitar a frequência de execução de uma função
 * Dispara a execução da função após um período de espera
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function (...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Função throttle para limitar a frequência de execução de uma função
 * Executa a função no máximo uma vez a cada `limit` milissegundos
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function (...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Memoiza uma função para armazenar em cache seus resultados com base nos argumentos de entrada
 * Útil para cálculos caros que são chamados com os mesmos argumentos várias vezes
 */
export function memoize<T extends (...args: any[]) => any>(func: T): T {
    const cache = new Map();

    return function (...args: Parameters<T>): ReturnType<T> {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func(...args);
        cache.set(key, result);
        return result;
    } as T;
}

/**
 * Debounce para funções que retornam Promises
 * Útil para evitar múltiplas chamadas de API quando o usuário está digitando rapidamente
 */
export function debouncePromise<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number) {
    let timeout: NodeJS.Timeout | null = null;
    let pendingReject: ((reason?: any) => void) | null = null;

    return (...args: Parameters<T>): ReturnType<T> => {  // ⚡ aqui usamos ReturnType<T> direto
        if (timeout) clearTimeout(timeout);
        if (pendingReject) pendingReject?.('canceled');

        return new Promise((resolve, reject) => {
            pendingReject = reject;
            timeout = setTimeout(() => {
                fn(...args).then(resolve).catch(reject);
            }, delay);
        }) as ReturnType<T>; 
    };
}

