import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type {
    FilterMap,
    FilterValue,
    PaginatedResponse,
    SimplePaginatedResponse,
    TableQueryParams,
    UseTableQueryConfig,
    UseTableQueryResult,
    PaginationResult,
    SortingResult,
    FiltersResult,
    SortItem,
    SortDirection,
} from "@front-engine/ui";
import { useUrlState } from "./useUrlState";

// ============================================================================
// TYPES
// ============================================================================

type Listener = () => void;

interface TableState<TData, TFilters extends FilterMap> {
    // Paginação
    page: number;
    pageSize: number;
    // Ordenação
    ordering: string;
    // Filtros
    appliedFilters: TFilters;
    draftFilters: TFilters;
    // Dados
    data: TData[];
    totalRecords: number;
    isLoading: boolean;
    error: Error | null;
}

// ============================================================================
// HELPERS
// ============================================================================

function normalizeResponse<TData>(
    response: PaginatedResponse<TData> | SimplePaginatedResponse<TData>,
): { data: TData[]; total: number } {
    if ("results" in response) {
        return { data: response.results, total: response.count };
    }
    return { data: response.data, total: response.total };
}

function filtersToQueryParams<TFilters extends FilterMap>(
    filters: Partial<TFilters>,
): Record<string, FilterValue> {
    const params: Record<string, FilterValue> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;
        if (Array.isArray(value) && value.length === 0) return;

        if (Array.isArray(value)) {
            params[key] = value.join(",");
        } else {
            params[key] = value;
        }
    });

    return params;
}

function parseOrdering(ordering: string | undefined | null): SortItem[] {
    if (!ordering) return [];

    return ordering
        .split(",")
        .filter(Boolean)
        .map((item) => {
            const trimmed = item.trim();
            if (trimmed.startsWith("-")) {
                return { field: trimmed.slice(1), direction: "desc" as SortDirection };
            }
            return { field: trimmed, direction: "asc" as SortDirection };
        });
}

function formatOrdering(items: SortItem[]): string {
    return items
        .map((item) => (item.direction === "desc" ? `-${item.field}` : item.field))
        .join(",");
}

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
// TABLE STORE
// ============================================================================

class TableStore<TData, TFilters extends FilterMap> {
    private state: TableState<TData, TFilters>;

    // Listeners separados por "slice" do estado
    private paginationListeners = new Set<Listener>();
    private sortingListeners = new Set<Listener>();
    private filtersListeners = new Set<Listener>();
    private dataListeners = new Set<Listener>();
    private globalListeners = new Set<Listener>();

    // Cache para evitar criação de novos objetos
    private paginationCache: PaginationResult | null = null;
    private sortingCache: { items: SortItem[]; ordering: string } | null = null;
    private filtersCache: { draft: TFilters; applied: TFilters; isDirty: boolean } | null = null;
    private dataCache: { data: TData[]; total: number; loading: boolean; error: Error | null } | null = null;

    constructor(initialState: TableState<TData, TFilters>) {
        this.state = initialState;
    }

    // ========== GETTERS ==========

    getState(): TableState<TData, TFilters> {
        return this.state;
    }

    getPaginationState(): PaginationResult {
        const { page, pageSize, totalRecords } = this.state;
        const first = (page - 1) * pageSize;
        const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

        // Retorna cache se nada mudou
        if (
            this.paginationCache &&
            this.paginationCache.page === page &&
            this.paginationCache.pageSize === pageSize &&
            this.paginationCache.first === first &&
            this.paginationCache.totalPages === totalPages
        ) {
            return this.paginationCache;
        }

        // Nota: setPage, setPageSize, resetPage serão injetados pelo hook
        this.paginationCache = {
            page,
            pageSize,
            first,
            totalPages,
            setPage: () => {},
            setPageSize: () => {},
            resetPage: () => {},
        };

        return this.paginationCache;
    }

    getSortingState(): { items: SortItem[]; ordering: string } {
        const { ordering } = this.state;

        if (this.sortingCache && this.sortingCache.ordering === ordering) {
            return this.sortingCache;
        }

        this.sortingCache = {
            items: parseOrdering(ordering),
            ordering,
        };

        return this.sortingCache;
    }

    getFiltersState(): { draft: TFilters; applied: TFilters; isDirty: boolean } {
        const { draftFilters, appliedFilters } = this.state;
        const isDirty = !areFiltersEqual(draftFilters, appliedFilters);

        if (
            this.filtersCache &&
            this.filtersCache.draft === draftFilters &&
            this.filtersCache.applied === appliedFilters
        ) {
            return this.filtersCache;
        }

        this.filtersCache = {
            draft: draftFilters,
            applied: appliedFilters,
            isDirty,
        };

        return this.filtersCache;
    }

    getDataState(): { data: TData[]; total: number; loading: boolean; error: Error | null } {
        const { data, totalRecords, isLoading, error } = this.state;

        if (
            this.dataCache &&
            this.dataCache.data === data &&
            this.dataCache.total === totalRecords &&
            this.dataCache.loading === isLoading &&
            this.dataCache.error === error
        ) {
            return this.dataCache;
        }

        this.dataCache = {
            data,
            total: totalRecords,
            loading: isLoading,
            error,
        };

        return this.dataCache;
    }

    getQueryParams(): TableQueryParams<TFilters> {
        const { page, pageSize, ordering, appliedFilters } = this.state;

        const params: TableQueryParams<TFilters> = {
            page,
            pageSize,
        } as TableQueryParams<TFilters>;

        if (ordering) {
            params.ordering = ordering;
        }

        const filterParams = filtersToQueryParams(appliedFilters);
        Object.assign(params, filterParams);

        return params;
    }

    // ========== SETTERS ==========

    setPage(page: number): void {
        if (this.state.page === page) return;
        this.state = { ...this.state, page };
        this.invalidatePaginationCache();
        this.notifyPagination();
        this.notifyGlobal();
    }

    setPageSize(pageSize: number): void {
        if (this.state.pageSize === pageSize) return;
        this.state = { ...this.state, pageSize, page: 1 };
        this.invalidatePaginationCache();
        this.notifyPagination();
        this.notifyGlobal();
    }

    setOrdering(ordering: string): void {
        if (this.state.ordering === ordering) return;
        this.state = { ...this.state, ordering, page: 1 };
        this.invalidateSortingCache();
        this.invalidatePaginationCache();
        this.notifySorting();
        this.notifyPagination();
        this.notifyGlobal();
    }

    setDraftFilter<K extends keyof TFilters>(key: K, value: TFilters[K]): void {
        const newDraft = { ...this.state.draftFilters, [key]: value };
        this.state = { ...this.state, draftFilters: newDraft };
        this.invalidateFiltersCache();
        this.notifyFilters();
        // NÃO notifica global - draft não afeta query
    }

    setDraftFilters(values: Partial<TFilters>): void {
        const newDraft = { ...this.state.draftFilters, ...values };
        this.state = { ...this.state, draftFilters: newDraft };
        this.invalidateFiltersCache();
        this.notifyFilters();
    }

    applyFilters(): TFilters {
        const cleaned = cleanFilters(this.state.draftFilters) as TFilters;
        if (areFiltersEqual(cleaned, this.state.appliedFilters)) {
            return cleaned;
        }
        this.state = { ...this.state, appliedFilters: cleaned, page: 1 };
        this.invalidateFiltersCache();
        this.invalidatePaginationCache();
        this.notifyFilters();
        this.notifyPagination();
        this.notifyGlobal();
        return cleaned;
    }

    clearFilter<K extends keyof TFilters>(key: K): void {
        const newDraft = { ...this.state.draftFilters };
        delete newDraft[key];

        const newApplied = { ...this.state.appliedFilters };
        delete newApplied[key];

        this.state = { ...this.state, draftFilters: newDraft, appliedFilters: newApplied };
        this.invalidateFiltersCache();
        this.notifyFilters();
        this.notifyGlobal();
    }

    clearAllFilters(): void {
        const empty = {} as TFilters;
        this.state = { ...this.state, draftFilters: empty, appliedFilters: empty };
        this.invalidateFiltersCache();
        this.notifyFilters();
        this.notifyGlobal();
    }

    resetDraft(): void {
        this.state = { ...this.state, draftFilters: { ...this.state.appliedFilters } };
        this.invalidateFiltersCache();
        this.notifyFilters();
    }

    setData(data: TData[], totalRecords: number): void {
        this.state = { ...this.state, data, totalRecords };
        this.invalidateDataCache();
        this.invalidatePaginationCache();
        this.notifyData();
        this.notifyPagination();
    }

    setLoading(isLoading: boolean): void {
        if (this.state.isLoading === isLoading) return;
        this.state = { ...this.state, isLoading };
        this.invalidateDataCache();
        this.notifyData();
    }

    setError(error: Error | null): void {
        this.state = { ...this.state, error };
        this.invalidateDataCache();
        this.notifyData();
    }

    reset(newState: Partial<TableState<TData, TFilters>>): void {
        this.state = { ...this.state, ...newState };
        this.invalidateAllCaches();
        this.notifyAll();
    }

    // ========== SUBSCRIPTIONS ==========

    subscribePagination(listener: Listener): () => void {
        this.paginationListeners.add(listener);
        return () => this.paginationListeners.delete(listener);
    }

    subscribeSorting(listener: Listener): () => void {
        this.sortingListeners.add(listener);
        return () => this.sortingListeners.delete(listener);
    }

    subscribeFilters(listener: Listener): () => void {
        this.filtersListeners.add(listener);
        return () => this.filtersListeners.delete(listener);
    }

    subscribeData(listener: Listener): () => void {
        this.dataListeners.add(listener);
        return () => this.dataListeners.delete(listener);
    }

    subscribeGlobal(listener: Listener): () => void {
        this.globalListeners.add(listener);
        return () => this.globalListeners.delete(listener);
    }

    // ========== PRIVATE ==========

    private invalidatePaginationCache(): void {
        this.paginationCache = null;
    }

    private invalidateSortingCache(): void {
        this.sortingCache = null;
    }

    private invalidateFiltersCache(): void {
        this.filtersCache = null;
    }

    private invalidateDataCache(): void {
        this.dataCache = null;
    }

    private invalidateAllCaches(): void {
        this.paginationCache = null;
        this.sortingCache = null;
        this.filtersCache = null;
        this.dataCache = null;
    }

    private notifyPagination(): void {
        this.paginationListeners.forEach((l) => l());
    }

    private notifySorting(): void {
        this.sortingListeners.forEach((l) => l());
    }

    private notifyFilters(): void {
        this.filtersListeners.forEach((l) => l());
    }

    private notifyData(): void {
        this.dataListeners.forEach((l) => l());
    }

    private notifyGlobal(): void {
        this.globalListeners.forEach((l) => l());
    }

    private notifyAll(): void {
        this.notifyPagination();
        this.notifySorting();
        this.notifyFilters();
        this.notifyData();
        this.notifyGlobal();
    }
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useTableQuery<TData, TFilters extends FilterMap = FilterMap>(
    config: UseTableQueryConfig<TData, TFilters>,
): UseTableQueryResult<TData, TFilters> {
    const {
        fetchFn,
        initialPageSize = 10,
        initialOrdering = "",
        initialFilters: initialFiltersInput = {} as TFilters,
        onError,
        syncWithUrl = true,
        urlPrefix = "",
        arrayFields = [],
    } = config;

    // Estabilizar initialFilters
    const initialFiltersRef = useRef(initialFiltersInput);
    const initialFilters = initialFiltersRef.current;

    // ========== URL STATE ==========

    const resolvedArrayFields = useMemo(() => {
        if (arrayFields.length > 0) return arrayFields;
        return Object.keys(initialFilters).filter((key) =>
            Array.isArray((initialFilters as FilterMap)[key]),
        ) as (keyof TFilters)[];
    }, [arrayFields, initialFilters]);

    const urlStateDefaults = useMemo(
        () => ({
            page: 1,
            pageSize: initialPageSize,
            ordering: initialOrdering,
            filters: initialFilters,
        }),
        [initialPageSize, initialOrdering, initialFilters],
    );

    const { getUrlState, setUrlState } = useUrlState<TFilters>({
        prefix: urlPrefix,
        arrayFields: resolvedArrayFields,
        defaults: urlStateDefaults,
    });

    // ========== STORE ==========

    const storeRef = useRef<TableStore<TData, TFilters> | null>(null);

    if (!storeRef.current) {
        // Inicialização única - lê da URL se syncWithUrl
        const urlState = syncWithUrl ? getUrlState() : null;

        const mergedFilters = {
            ...initialFilters,
            ...(urlState?.filters || {}),
        } as TFilters;

        storeRef.current = new TableStore<TData, TFilters>({
            page: urlState?.page ?? 1,
            pageSize: urlState?.pageSize ?? initialPageSize,
            ordering: urlState?.ordering ?? initialOrdering,
            appliedFilters: mergedFilters,
            draftFilters: { ...mergedFilters },
            data: [],
            totalRecords: 0,
            isLoading: false,
            error: null,
        });
    }

    const store = storeRef.current;

    // ========== FETCH ==========

    const abortControllerRef = useRef<AbortController | null>(null);
    const fetchIdRef = useRef(0);
    const prevQueryParamsRef = useRef<string>("");

    const fetchData = useCallback(async () => {
        const queryParams = store.getQueryParams();
        const queryParamsString = JSON.stringify(queryParams);

        if (queryParamsString === prevQueryParamsRef.current) {
            return;
        }
        prevQueryParamsRef.current = queryParamsString;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const fetchId = ++fetchIdRef.current;

        store.setLoading(true);
        store.setError(null);

        try {
            const response = await fetchFn(queryParams);

            if (fetchId !== fetchIdRef.current) return;

            const normalized = normalizeResponse(response);
            store.setData(normalized.data, normalized.total);
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return;
            if (fetchId !== fetchIdRef.current) return;

            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            store.setError(error);
            store.setData([], 0);
            onError?.(error);

            console.error("[useTableQuery] Erro ao buscar dados:", error);
        } finally {
            if (fetchId === fetchIdRef.current) {
                store.setLoading(false);
            }
        }
    }, [fetchFn, onError, store]);

    // Ref para queryParams - usado no effect
    const queryParamsRef = useRef(store.getQueryParams());

    // Subscribe para mudanças globais (que afetam query)
    useEffect(() => {
        const unsubscribe = store.subscribeGlobal(() => {
            queryParamsRef.current = store.getQueryParams();
        });
        return unsubscribe;
    }, [store]);

    // Effect para fetch
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    // Re-trigger fetch quando queryParams muda (via subscription)
    const queryParams = useSyncExternalStore(
        useCallback((callback) => store.subscribeGlobal(callback), [store]),
        useCallback(() => store.getQueryParams(), [store]),
        useCallback(() => store.getQueryParams(), [store]),
    );

    // Effect separado para URL sync
    useEffect(() => {
        if (!syncWithUrl) return;

        const state = store.getState();
        setUrlState({
            page: state.page,
            pageSize: state.pageSize,
            ordering: state.ordering,
            filters: state.appliedFilters,
        });
    }, [queryParams, syncWithUrl, setUrlState, store]);

    // ========== HANDLERS ESTÁVEIS ==========

    const handlersRef = useRef<{
        pagination: {
            setPage: (page: number) => void;
            setPageSize: (size: number) => void;
            resetPage: () => void;
        };
        sorting: {
            toggleSort: (field: string) => void;
            setSort: (field: string, direction: SortDirection | null) => void;
            clearSort: () => void;
            getSortDirection: (field: string) => SortDirection | null;
            getSortIndex: (field: string) => number;
        };
        filters: {
            setDraftValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
            setDraftValues: (values: Partial<TFilters>) => void;
            applyFilters: () => void;
            clearFilter: <K extends keyof TFilters>(key: K) => void;
            clearAllFilters: () => void;
            resetDraft: () => void;
        };
    } | null>(null);

    if (!handlersRef.current) {
        handlersRef.current = {
            pagination: {
                setPage: (page: number) => {
                    const totalPages = Math.max(
                        1,
                        Math.ceil(store.getState().totalRecords / store.getState().pageSize),
                    );
                    const validPage = Math.max(1, Math.min(page, totalPages));
                    store.setPage(validPage);
                },
                setPageSize: (size: number) => {
                    store.setPageSize(size);
                },
                resetPage: () => {
                    store.setPage(1);
                },
            },
            sorting: {
                toggleSort: (field: string) => {
                    const { items } = store.getSortingState();
                    const existingIndex = items.findIndex((s) => s.field === field);
                    let newItems: SortItem[];

                    if (existingIndex === -1) {
                        newItems = [{ field, direction: "asc" }];
                    } else {
                        const existing = items[existingIndex];
                        if (existing.direction === "asc") {
                            newItems = [{ field, direction: "desc" }];
                        } else {
                            newItems = [];
                        }
                    }

                    store.setOrdering(formatOrdering(newItems));
                },
                setSort: (field: string, direction: SortDirection | null) => {
                    if (direction === null) {
                        store.setOrdering("");
                    } else {
                        store.setOrdering(direction === "desc" ? `-${field}` : field);
                    }
                },
                clearSort: () => {
                    store.setOrdering("");
                },
                getSortDirection: (field: string): SortDirection | null => {
                    const { items } = store.getSortingState();
                    const item = items.find((s) => s.field === field);
                    return item?.direction ?? null;
                },
                getSortIndex: (field: string): number => {
                    const { items } = store.getSortingState();
                    return items.findIndex((s) => s.field === field);
                },
            },
            filters: {
                setDraftValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
                    store.setDraftFilter(key, value);
                },
                setDraftValues: (values: Partial<TFilters>) => {
                    store.setDraftFilters(values);
                },
                applyFilters: () => {
                    store.applyFilters();
                },
                clearFilter: <K extends keyof TFilters>(key: K) => {
                    store.clearFilter(key);
                },
                clearAllFilters: () => {
                    store.clearAllFilters();
                },
                resetDraft: () => {
                    store.resetDraft();
                },
            },
        };
    }

    const handlers = handlersRef.current;

    // ========== SUBSCRIPTIONS COM useSyncExternalStore ==========

    // Pagination
    const paginationState = useSyncExternalStore(
        useCallback((cb) => store.subscribePagination(cb), [store]),
        useCallback(() => store.getPaginationState(), [store]),
        useCallback(() => store.getPaginationState(), [store]),
    );

    // totalRecords vem do dataState mas precisa estar no pagination para o DataTable
    const totalRecords = useSyncExternalStore(
        useCallback((cb) => store.subscribeData(cb), [store]),
        useCallback(() => store.getState().totalRecords, [store]),
        useCallback(() => store.getState().totalRecords, [store]),
    );

    const pagination: PaginationResult & { totalRecords: number } = useMemo(
        () => ({
            ...paginationState,
            totalRecords,
            setPage: handlers.pagination.setPage,
            setPageSize: handlers.pagination.setPageSize,
            resetPage: handlers.pagination.resetPage,
        }),
        [paginationState, totalRecords, handlers.pagination],
    );

    // Sorting
    const sortingState = useSyncExternalStore(
        useCallback((cb) => store.subscribeSorting(cb), [store]),
        useCallback(() => store.getSortingState(), [store]),
        useCallback(() => store.getSortingState(), [store]),
    );

    const sorting: SortingResult = useMemo(
        () => ({
            sortItems: sortingState.items,
            ordering: sortingState.ordering,
            toggleSort: handlers.sorting.toggleSort,
            setSort: handlers.sorting.setSort,
            clearSort: handlers.sorting.clearSort,
            getSortDirection: handlers.sorting.getSortDirection,
            getSortIndex: handlers.sorting.getSortIndex,
        }),
        [sortingState, handlers.sorting],
    );

    // Filters
    const filtersState = useSyncExternalStore(
        useCallback((cb) => store.subscribeFilters(cb), [store]),
        useCallback(() => store.getFiltersState(), [store]),
        useCallback(() => store.getFiltersState(), [store]),
    );

    const filters: FiltersResult<TFilters> = useMemo(
        () => ({
            draft: filtersState.draft,
            applied: filtersState.applied,
            isDirty: filtersState.isDirty,
            setDraftValue: handlers.filters.setDraftValue,
            setDraftValues: handlers.filters.setDraftValues,
            applyFilters: handlers.filters.applyFilters,
            clearFilter: handlers.filters.clearFilter,
            clearAllFilters: handlers.filters.clearAllFilters,
            resetDraft: handlers.filters.resetDraft,
        }),
        [filtersState, handlers.filters],
    );

    // Data
    const dataState = useSyncExternalStore(
        useCallback((cb) => store.subscribeData(cb), [store]),
        useCallback(() => store.getDataState(), [store]),
        useCallback(() => store.getDataState(), [store]),
    );

    // ========== AÇÕES GLOBAIS ==========

    const refetch = useCallback(() => {
        prevQueryParamsRef.current = ""; // Force refetch
        fetchData();
    }, [fetchData]);

    const reset = useCallback(() => {
        store.reset({
            page: 1,
            pageSize: initialPageSize,
            ordering: initialOrdering,
            appliedFilters: initialFilters,
            draftFilters: { ...initialFilters },
        });

        if (syncWithUrl) {
            setUrlState({
                page: 1,
                pageSize: initialPageSize,
                ordering: initialOrdering,
                filters: initialFilters,
            });
        }
    }, [initialPageSize, initialOrdering, initialFilters, syncWithUrl, setUrlState, store]);

    // ========== RETURN ==========

    return {
        // Dados
        data: dataState.data,
        totalRecords: dataState.total,
        isLoading: dataState.loading,
        error: dataState.error,

        // Sub-hooks (pagination inclui totalRecords para compatibilidade com DataTable)
        pagination,
        sorting,
        filters,

        // Ações globais
        refetch,
        reset,

        // Query params (para debug)
        queryParams,
    };
}
