// ============================================================================
// PAGINAÇÃO
// ============================================================================

/**
 * Estado da paginação
 */
export interface PaginationState {
    /** Página atual (1-indexed) */
    page: number;
    /** Quantidade de itens por página */
    pageSize: number;
}

/**
 * Ações de paginação
 */
export interface PaginationActions {
    /** Muda para uma página específica */
    setPage: (page: number) => void;
    /** Muda o tamanho da página */
    setPageSize: (size: number) => void;
    /** Reseta para a primeira página */
    resetPage: () => void;
}

/**
 * Retorno completo do hook de paginação
 */
export interface PaginationResult extends PaginationState, PaginationActions {
    /** Primeiro índice (0-indexed, para PrimeReact) */
    first: number;
    /** Total de páginas */
    totalPages: number;
}

// ============================================================================
// ORDENAÇÃO (Padrão Django DRF)
// ============================================================================

/**
 * Direção da ordenação
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Item de ordenação individual
 */
export interface SortItem {
    field: string;
    direction: SortDirection;
}

/**
 * Estado da ordenação
 */
export interface SortingState {
    /** Lista de ordenações ativas */
    sortItems: SortItem[];
    /** String de ordenação no formato DRF (ex: "name,-created_at") */
    ordering: string;
}

/**
 * Ações de ordenação
 */
export interface SortingActions {
    /** Toggle de ordenação em um campo (cicla: asc -> desc -> null) */
    toggleSort: (field: string) => void;
    /** Define ordenação específica para um campo */
    setSort: (field: string, direction: SortDirection | null) => void;
    /** Limpa todas as ordenações */
    clearSort: () => void;
    /** Obtém a direção atual de um campo */
    getSortDirection: (field: string) => SortDirection | null;
    /** Obtém o índice de ordenação de um campo (para multi-sort) */
    getSortIndex: (field: string) => number;
}

/**
 * Retorno completo do hook de ordenação
 */
export interface SortingResult extends SortingState, SortingActions { }

// ============================================================================
// FILTROS
// ============================================================================

/**
 * Valor de filtro permitido
 */
export type FilterValue = string | number | boolean | string[] | number[] | null | undefined;

/**
 * Mapa de filtros genérico
 */
export type FilterMap<T extends Record<string, FilterValue> = Record<string, FilterValue>> = T;

/**
 * Estado dos filtros
 */
export interface FiltersState<TFilters extends FilterMap = FilterMap> {
    /** Valores temporários dos filtros (durante digitação) */
    draft: TFilters;
    /** Valores aplicados dos filtros (após clicar em Filtrar) */
    applied: TFilters;
    /** Indica se há mudanças não aplicadas */
    isDirty: boolean;
}

/**
 * Ações dos filtros
 */
export interface FiltersActions<TFilters extends FilterMap = FilterMap> {
    /** Atualiza um valor no draft (não dispara requisição) */
    setDraftValue: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
    /** Atualiza múltiplos valores no draft */
    setDraftValues: (values: Partial<TFilters>) => void;
    /** Aplica os filtros do draft (dispara requisição) */
    applyFilters: () => void;
    /** Limpa um filtro específico (do draft e aplicado) */
    clearFilter: <K extends keyof TFilters>(key: K) => void;
    /** Limpa todos os filtros */
    clearAllFilters: () => void;
    /** Reseta draft para os valores aplicados */
    resetDraft: () => void;
}

/**
 * Retorno completo do hook de filtros
 */
export interface FiltersResult<TFilters extends FilterMap = FilterMap>
    extends FiltersState<TFilters>, FiltersActions<TFilters> { }

// ============================================================================
// URL STATE
// ============================================================================

/**
 * Parâmetros de URL para a tabela
 */
export interface TableUrlParams<TFilters extends FilterMap = FilterMap> {
    page?: number;
    pageSize?: number;
    ordering?: string;
    filters?: Partial<TFilters>;
}

/**
 * Ações do URL state
 */
export interface UrlStateActions<TFilters extends FilterMap = FilterMap> {
    /** Atualiza parâmetros na URL */
    updateUrl: (params: Partial<TableUrlParams<TFilters>>) => void;
    /** Obtém parâmetros atuais da URL */
    getUrlParams: () => TableUrlParams<TFilters>;
    /** Limpa todos os parâmetros de tabela da URL */
    clearUrl: () => void;
}

// ============================================================================
// RESPOSTA DO SERVIDOR
// ============================================================================

/**
 * Resposta paginada padrão do servidor (compatível com DRF)
 */
export interface PaginatedResponse<TData> {
    /** Lista de resultados */
    results: TData[];
    /** Total de registros */
    count: number;
    /** URL da próxima página (opcional) */
    next?: string | null;
    /** URL da página anterior (opcional) */
    previous?: string | null;
}

/**
 * Alternativa com estrutura simplificada
 */
export interface SimplePaginatedResponse<TData> {
    data: TData[];
    total: number;
    page: number;
    pageSize: number;
}

// ============================================================================
// QUERY PARAMS (para API)
// ============================================================================

/**
 * Parâmetros de query para enviar ao servidor
 */
export type TableQueryParams<TFilters extends FilterMap = FilterMap> = {
    /** Página atual (1-indexed) */
    page: number;
    /** Tamanho da página */
    pageSize: number;
    /** String de ordenação no formato DRF */
    ordering?: string;
} & Partial<TFilters> /** Filtros como query params */

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

/**
 * Configuração do hook de tabela
 */
export interface UseTableQueryConfig<TData, TFilters extends FilterMap = FilterMap> {
    /** Função para buscar dados */
    fetchFn: (params: TableQueryParams<TFilters>) => Promise<PaginatedResponse<TData> | SimplePaginatedResponse<TData>>;
    /** Tamanho inicial da página */
    initialPageSize?: number;
    /** Ordenação inicial */
    initialOrdering?: string;
    /** Filtros iniciais */
    initialFilters?: TFilters;
    /** Opções de tamanho de página */
    pageSizeOptions?: number[];
    /** Callback de erro */
    onError?: (error: Error) => void;
    /** Sincronizar com URL */
    syncWithUrl?: boolean;
    /** Prefixo para parâmetros na URL (evita conflitos) */
    urlPrefix?: string;
    /** 
     * Campos que são arrays (para deserialização correta da URL)
     * IMPORTANTE: Necessário para que filtros de array funcionem no refresh!
     * Ex: ['status', 'roles'] para URLs como ?status=active,inactive
     */
    arrayFields?: (keyof TFilters)[];
}

/**
 * Retorno do hook principal de tabela
 */
export interface UseTableQueryResult<TData, TFilters extends FilterMap = FilterMap> {
    // Dados
    data: TData[];
    totalRecords: number;
    isLoading: boolean;
    error: Error | null;

    // Paginação
    pagination: PaginationResult;

    // Ordenação
    sorting: SortingResult;

    // Filtros
    filters: FiltersResult<TFilters>;

    // Ações globais
    refetch: () => void;
    reset: () => void;

    // Query params (para debug ou uso externo)
    queryParams: TableQueryParams<TFilters>;
}

// ============================================================================
// COMPONENTE DATATABLE
// ============================================================================

/**
 * Definição de coluna para o DataTable
 */
export interface TableColumn<TData = unknown> {
    /** Campo do objeto de dados */
    field: keyof TData & string;
    /** Texto do cabeçalho */
    header: string;
    /** Coluna pode ser ordenada */
    sortable?: boolean;
    /** Template customizado para o corpo */
    body?: (rowData: TData, options: { rowIndex: number }) => React.ReactNode;
    /** Estilo do cabeçalho */
    headerStyle?: React.CSSProperties;
    /** Classe CSS do cabeçalho */
    headerClassName?: string;
    /** Estilo do corpo */
    bodyStyle?: React.CSSProperties;
    /** Classe CSS do corpo */
    bodyClassName?: string;
    /** Largura da coluna */
    width?: string;
    /** Alinhamento */
    align?: 'left' | 'center' | 'right';
    /** Coluna oculta */
    hidden?: boolean;
}
