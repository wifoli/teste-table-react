import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { FilterMap, FiltersResult } from "@front-engine/ui";

// ============================================================================
// TYPES
// ============================================================================

type Listener = () => void;

// ============================================================================
// HELPERS
// ============================================================================

function areFiltersEqual<T extends FilterMap>(a: T, b: T): boolean {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => {
        const valA = a[key];
        const valB = b[key];

        if (Array.isArray(valA) && Array.isArray(valB)) {
            return valA.length === valB.length && valA.every((v, i) => v === valB[i]);
        }

        return valA === valB;
    });
}

function cleanFilters<T extends FilterMap>(filters: T): Partial<T> {
    const cleaned: Partial<T> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;
        if (Array.isArray(value) && value.length === 0) return;

        (cleaned as FilterMap)[key] = value;
    });

    return cleaned;
}

// ============================================================================
// FILTERS STORE
// ============================================================================

class FiltersStore<TFilters extends FilterMap> {
    private draft: TFilters;
    private applied: TFilters;
    private listeners = new Set<Listener>();
    private stateCache: { draft: TFilters; applied: TFilters; isDirty: boolean } | null = null;

    constructor(initialFilters: TFilters) {
        this.draft = { ...initialFilters };
        this.applied = { ...initialFilters };
    }

    getState(): { draft: TFilters; applied: TFilters; isDirty: boolean } {
        const isDirty = !areFiltersEqual(this.draft, this.applied);

        if (
            this.stateCache &&
            this.stateCache.draft === this.draft &&
            this.stateCache.applied === this.applied
        ) {
            return this.stateCache;
        }

        this.stateCache = {
            draft: this.draft,
            applied: this.applied,
            isDirty,
        };

        return this.stateCache;
    }

    setDraftValue<K extends keyof TFilters>(key: K, value: TFilters[K]): void {
        this.draft = { ...this.draft, [key]: value };
        this.invalidateCache();
        this.notify();
    }

    setDraftValues(values: Partial<TFilters>): void {
        this.draft = { ...this.draft, ...values };
        this.invalidateCache();
        this.notify();
    }

    applyFilters(): TFilters {
        const cleaned = cleanFilters(this.draft) as TFilters;
        if (areFiltersEqual(cleaned, this.applied)) {
            return cleaned;
        }
        this.applied = cleaned;
        this.invalidateCache();
        this.notify();
        return cleaned;
    }

    clearFilter<K extends keyof TFilters>(key: K): void {
        const newDraft = { ...this.draft };
        delete newDraft[key];

        const newApplied = { ...this.applied };
        delete newApplied[key];

        this.draft = newDraft;
        this.applied = newApplied;
        this.invalidateCache();
        this.notify();
    }

    clearAllFilters(): void {
        this.draft = {} as TFilters;
        this.applied = {} as TFilters;
        this.invalidateCache();
        this.notify();
    }

    resetDraft(): void {
        this.draft = { ...this.applied };
        this.invalidateCache();
        this.notify();
    }

    // Sync com estado externo (para versão controlada)
    syncApplied(applied: TFilters): void {
        if (areFiltersEqual(applied, this.applied)) return;
        this.applied = { ...applied };
        this.draft = { ...applied };
        this.invalidateCache();
        this.notify();
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private invalidateCache(): void {
        this.stateCache = null;
    }

    private notify(): void {
        this.listeners.forEach((l) => l());
    }
}

// ============================================================================
// HOOK - VERSÃO NÃO CONTROLADA
// ============================================================================

export interface UseFiltersOptions<TFilters extends FilterMap> {
    initialFilters?: TFilters;
    onApply?: (filters: TFilters) => void;
    onClear?: () => void;
}

export function useFilters<TFilters extends FilterMap = FilterMap>(
    options: UseFiltersOptions<TFilters> = {},
): FiltersResult<TFilters> {
    const { initialFilters = {} as TFilters, onApply, onClear } = options;

    const storeRef = useRef<FiltersStore<TFilters> | null>(null);
    if (!storeRef.current) {
        storeRef.current = new FiltersStore<TFilters>(initialFilters);
    }
    const store = storeRef.current;

    // Handlers estáveis
    const handlersRef = useRef<{
        setDraftValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
        setDraftValues: (values: Partial<TFilters>) => void;
        applyFilters: () => void;
        clearFilter: <K extends keyof TFilters>(key: K) => void;
        clearAllFilters: () => void;
        resetDraft: () => void;
    } | null>(null);

    if (!handlersRef.current) {
        handlersRef.current = {
            setDraftValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
                store.setDraftValue(key, value);
            },
            setDraftValues: (values: Partial<TFilters>) => {
                store.setDraftValues(values);
            },
            applyFilters: () => {
                const applied = store.applyFilters();
                onApply?.(applied);
            },
            clearFilter: <K extends keyof TFilters>(key: K) => {
                store.clearFilter(key);
                onApply?.(store.getState().applied);
            },
            clearAllFilters: () => {
                store.clearAllFilters();
                onClear?.();
                onApply?.({} as TFilters);
            },
            resetDraft: () => {
                store.resetDraft();
            },
        };
    }

    const handlers = handlersRef.current;

    // Subscribe com useSyncExternalStore
    const state = useSyncExternalStore(
        useCallback((cb) => store.subscribe(cb), [store]),
        useCallback(() => store.getState(), [store]),
        useCallback(() => store.getState(), [store]),
    );

    return useMemo(
        () => ({
            draft: state.draft,
            applied: state.applied,
            isDirty: state.isDirty,
            setDraftValue: handlers.setDraftValue,
            setDraftValues: handlers.setDraftValues,
            applyFilters: handlers.applyFilters,
            clearFilter: handlers.clearFilter,
            clearAllFilters: handlers.clearAllFilters,
            resetDraft: handlers.resetDraft,
        }),
        [state, handlers],
    );
}

// ============================================================================
// HOOK - VERSÃO CONTROLADA
// ============================================================================

export interface UseControlledFiltersOptions<TFilters extends FilterMap> {
    applied: TFilters;
    onApply: (filters: TFilters) => void;
}

export function useControlledFilters<TFilters extends FilterMap = FilterMap>(
    options: UseControlledFiltersOptions<TFilters>,
): FiltersResult<TFilters> {
    const { applied: externalApplied, onApply } = options;

    const storeRef = useRef<FiltersStore<TFilters> | null>(null);
    if (!storeRef.current) {
        storeRef.current = new FiltersStore<TFilters>(externalApplied);
    }
    const store = storeRef.current;

    // Sync quando applied externo muda
    const prevAppliedRef = useRef<string>(JSON.stringify(externalApplied));

    useEffect(() => {
        const appliedString = JSON.stringify(externalApplied);
        if (prevAppliedRef.current !== appliedString) {
            prevAppliedRef.current = appliedString;
            store.syncApplied(externalApplied);
        }
    }, [externalApplied, store]);

    // Handlers estáveis
    const handlersRef = useRef<{
        setDraftValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
        setDraftValues: (values: Partial<TFilters>) => void;
        applyFilters: () => void;
        clearFilter: <K extends keyof TFilters>(key: K) => void;
        clearAllFilters: () => void;
        resetDraft: () => void;
    } | null>(null);

    // Atualiza referência do onApply sem recriar handlers
    const onApplyRef = useRef(onApply);
    onApplyRef.current = onApply;

    if (!handlersRef.current) {
        handlersRef.current = {
            setDraftValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
                store.setDraftValue(key, value);
            },
            setDraftValues: (values: Partial<TFilters>) => {
                store.setDraftValues(values);
            },
            applyFilters: () => {
                const cleaned = cleanFilters(store.getState().draft) as TFilters;
                onApplyRef.current(cleaned);
            },
            clearFilter: <K extends keyof TFilters>(key: K) => {
                const state = store.getState();
                const newApplied = { ...state.applied };
                delete newApplied[key];
                onApplyRef.current(newApplied);
            },
            clearAllFilters: () => {
                onApplyRef.current({} as TFilters);
            },
            resetDraft: () => {
                store.resetDraft();
            },
        };
    }

    const handlers = handlersRef.current;

    // Subscribe com useSyncExternalStore
    const state = useSyncExternalStore(
        useCallback((cb) => store.subscribe(cb), [store]),
        useCallback(() => store.getState(), [store]),
        useCallback(() => store.getState(), [store]),
    );

    return useMemo(
        () => ({
            draft: state.draft,
            applied: state.applied,
            isDirty: state.isDirty,
            setDraftValue: handlers.setDraftValue,
            setDraftValues: handlers.setDraftValues,
            applyFilters: handlers.applyFilters,
            clearFilter: handlers.clearFilter,
            clearAllFilters: handlers.clearAllFilters,
            resetDraft: handlers.resetDraft,
        }),
        [state, handlers],
    );
}
