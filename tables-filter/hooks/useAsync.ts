import { useState, useEffect, useCallback } from "react";

interface AsyncState<T> {
    loading: boolean;
    error: Error | null;
    data: T | null;
}

export function useAsync<T>(asyncFunction: () => Promise<T>, immediate: boolean = true) {
    const [state, setState] = useState<AsyncState<T>>({
        loading: immediate,
        error: null,
        data: null,
    });

    const execute = useCallback(async () => {
        setState({ loading: true, error: null, data: null });

        try {
            const data = await asyncFunction();
            setState({ loading: false, error: null, data });
            return data;
        } catch (error) {
            setState({ loading: false, error: error as Error, data: null });
            throw error;
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return {
        ...state,
        execute,
    };
}
