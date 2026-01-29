import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
    FilterMap,
    FilterValue,
    PaginatedResponse,
    SimplePaginatedResponse,
    TableQueryParams,
    UseTableQueryConfig,
    UseTableQueryResult,
} from "@front-engine/ui";
import { useUrlState } from "./useUrlState";
import { useControlledPagination } from "./usePagination";
import { useControlledSorting } from "./useSorting";
import { useControlledFilters } from "./useFilters";

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Normaliza resposta do servidor para formato consistente
 */
function normalizeResponse<TData>(
    response: PaginatedResponse<TData> | SimplePaginatedResponse<TData>,
): { data: TData[]; total: number } {
    if ("results" in response) {
        return { data: response.results, total: response.count };
    }
    return { data: response.data, total: response.total };
}

/**
 * Converte filtros para formato de query params
 */
function filtersToQueryParams<TFilters extends FilterMap>(
    filters: Partial<TFilters>,
): Record<string, FilterValue> {
    const params: Record<string, FilterValue> = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;
        if (Array.isArray(value) && value.length === 0) return;

        // Arrays são serializados como comma-separated
        if (Array.isArray(value)) {
            params[key] = value.join(",");
        } else {
            params[key] = value;
        }
    });

    return params;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Hook principal para gerenciar tabelas com paginação server-side
 *
 * Este hook orquestra:
 * - Paginação (com atualização imediata)
 * - Ordenação (com atualização imediata, padrão DRF)
 * - Filtros (somente ao clicar em "Filtrar")
 * - Sincronização com URL
 * - Fetch de dados
 *
 * IMPORTANTE: No refresh da página, o estado é restaurado da URL automaticamente!
 *
 * @example
 * ```tsx
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 *   status: 'active' | 'inactive';
 * }
 *
 * interface UserFilters {
 *   search?: string;
 *   status?: string[];
 * }
 *
 * const {
 *   data,
 *   totalRecords,
 *   isLoading,
 *   pagination,
 *   sorting,
 *   filters
 * } = useTableQuery<User, UserFilters>({
 *   fetchFn: async (params) => {
 *     const response = await api.get('/users', { params });
 *     return response.data;
 *   },
 *   initialPageSize: 10,
 *   syncWithUrl: true,
 *   // IMPORTANTE: declare campos que são arrays para deserialização correta da URL
 *   arrayFields: ['status']
 * });
 * ```
 */
export function useTableQuery<TData, TFilters extends FilterMap = FilterMap>(
    config: UseTableQueryConfig<TData, TFilters>,
): UseTableQueryResult<TData, TFilters> {
    const {
        fetchFn,
        initialPageSize = 10,
        initialOrdering = "",
        initialFilters: initialFiltersInput = {} as TFilters,
        // pageSizeOptions = [10, 25, 50, 100],
        onError,
        syncWithUrl = true,
        urlPrefix = "",
        arrayFields = [],
    } = config;

    // Estabilizar initialFilters com useRef para manter referência inicial
    const initialFiltersRef = useRef(initialFiltersInput);
    const initialFilters = initialFiltersRef.current;

    // ============================================================================
    // URL STATE
    // ============================================================================

    // Determina campos array: usa config explícita OU infere do initialFilters
    const resolvedArrayFields = useMemo(() => {
        if (arrayFields.length > 0) {
            return arrayFields;
        }
        // Fallback: infere do initialFilters
        return Object.keys(initialFilters).filter((key) =>
            Array.isArray((initialFilters as FilterMap)[key]),
        ) as (keyof TFilters)[];
    }, [arrayFields, initialFilters]);

    // ANTES de chamar useUrlState, estabilizar o objeto defaults
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

    // Estado inicial baseado na URL (se syncWithUrl) ou defaults
    // CRÍTICO: Isso é executado ANTES do primeiro render, garantindo que
    // os valores da URL sejam lidos imediatamente no refresh da página
    const initialState = useMemo(() => {
        if (syncWithUrl) {
            const urlState = getUrlState();

            // Merge: URL tem prioridade, depois initialFilters para valores não presentes
            const mergedFilters = {
                ...initialFilters,
                ...(urlState.filters || {}),
            } as TFilters;

            return {
                page: urlState.page ?? 1,
                pageSize: urlState.pageSize ?? initialPageSize,
                ordering: urlState.ordering ?? initialOrdering,
                filters: mergedFilters,
            };
        }
        return {
            page: 1,
            pageSize: initialPageSize,
            ordering: initialOrdering,
            filters: initialFilters,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Executa apenas uma vez na montagem

    // ============================================================================
    // ESTADO LOCAL
    // ============================================================================

    const [page, setPageState] = useState(initialState.page);
    const [pageSize, setPageSizeState] = useState(initialState.pageSize);
    const [ordering, setOrderingState] = useState(initialState.ordering);
    const [appliedFilters, setAppliedFiltersState] = useState<TFilters>(initialState.filters);

    // Estado de dados
    const [data, setData] = useState<TData[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Ref para controle de requisições
    const abortControllerRef = useRef<AbortController | null>(null);
    const fetchIdRef = useRef(0);

    // Ref para armazenar queryParams anterior e comparar
    const prevQueryParamsRef = useRef<string>("");

    // ============================================================================
    // HANDLERS COM URL SYNC
    // ============================================================================

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPageState(newPage);
            if (syncWithUrl) {
                setUrlState({ page: newPage });
            }
        },
        [syncWithUrl, setUrlState],
    );

    const handlePageSizeChange = useCallback(
        (newPageSize: number) => {
            setPageSizeState(newPageSize);
            setPageState(1); // Reset para primeira página
            if (syncWithUrl) {
                setUrlState({ page: 1, pageSize: newPageSize });
            }
        },
        [syncWithUrl, setUrlState],
    );

    const handleOrderingChange = useCallback(
        (newOrdering: string) => {
            setOrderingState(newOrdering);
            setPageState(1); // Reset para primeira página
            if (syncWithUrl) {
                setUrlState({ page: 1, ordering: newOrdering });
            }
        },
        [syncWithUrl, setUrlState],
    );

    const handleFiltersApply = useCallback(
        (newFilters: TFilters) => {
            setAppliedFiltersState(newFilters);
            setPageState(1); // Reset para primeira página
            if (syncWithUrl) {
                setUrlState({ page: 1, filters: newFilters });
            }
        },
        [syncWithUrl, setUrlState],
    );

    // ============================================================================
    // SUB-HOOKS CONTROLADOS
    // ============================================================================

    const pagination = useControlledPagination({
        page,
        pageSize,
        totalRecords,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
    });

    const sorting = useControlledSorting({
        ordering,
        multiSort: false,
        onOrderingChange: handleOrderingChange,
    });

    const filters = useControlledFilters<TFilters>({
        applied: appliedFilters,
        onApply: handleFiltersApply,
    });

    // ============================================================================
    // QUERY PARAMS
    // ============================================================================

    const queryParams = useMemo<TableQueryParams<TFilters>>(() => {
        const params: TableQueryParams<TFilters> = {
            page,
            pageSize: pageSize,
        } as TableQueryParams<TFilters>;

        if (ordering) {
            params.ordering = ordering;
        }

        // Adiciona filtros aplicados
        const filterParams = filtersToQueryParams(appliedFilters);
        Object.assign(params, filterParams);

        return params;
    }, [page, pageSize, ordering, appliedFilters]);

    // ============================================================================
    // FETCH DE DADOS
    // ============================================================================

    const fetchData = useCallback(async () => {
        // Serializar queryParams para comparação
        const queryParamsString = JSON.stringify(queryParams);

        // Evitar fetch se queryParams não mudou de verdade
        if (queryParamsString === prevQueryParamsRef.current) {
            return;
        }
        prevQueryParamsRef.current = queryParamsString;

        // Cancela requisição anterior se existir
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Cria novo AbortController
        abortControllerRef.current = new AbortController();
        const fetchId = ++fetchIdRef.current;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchFn(queryParams);

            // Verifica se esta é a requisição mais recente
            if (fetchId !== fetchIdRef.current) return;

            const normalized = normalizeResponse(response);
            setData(normalized.data);
            setTotalRecords(normalized.total);
        } catch (err) {
            // Ignora erros de abort
            if (err instanceof Error && err.name === "AbortError") return;

            // Verifica se esta é a requisição mais recente
            if (fetchId !== fetchIdRef.current) return;

            const error = err instanceof Error ? err : new Error("Erro desconhecido");
            setError(error);
            setData([]);
            setTotalRecords(0);
            onError?.(error);

            console.error("[useTableQuery] Erro ao buscar dados:", error);
        } finally {
            // Verifica se esta é a requisição mais recente
            if (fetchId === fetchIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [fetchFn, queryParams, onError]);

    // Fetch inicial e quando queryParams mudam
    useEffect(() => {
        // pequeno debounce para evitar requisições em rajada
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 0); // microtask, agrupa mudanças síncronas

        return () => {
            clearTimeout(timeoutId);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    // ============================================================================
    // AÇÕES GLOBAIS
    // ============================================================================

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    const reset = useCallback(() => {
        setPageState(1);
        setPageSizeState(initialPageSize);
        setOrderingState(initialOrdering);
        setAppliedFiltersState(initialFilters);

        if (syncWithUrl) {
            setUrlState({
                page: 1,
                pageSize: initialPageSize,
                ordering: initialOrdering,
                filters: initialFilters,
            });
        }
    }, [initialPageSize, initialOrdering, initialFilters, syncWithUrl, setUrlState]);

    // ============================================================================
    // RETORNO
    // ============================================================================

    return {
        // Dados
        data,
        totalRecords,
        isLoading,
        error,

        // Sub-hooks
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
