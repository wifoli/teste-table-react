// ============================================================================
// DATA TABLE TYPES
// ============================================================================

import type { CSSProperties, ReactNode } from "react";

/** Direção de ordenação */
export type SortDirection = "asc" | "desc";

/** Estado de ordenação de um campo */
export interface SortState {
    field: string;
    direction: SortDirection;
}

/** Resultado do hook de ordenação */
export interface SortingResult {
    ordering: string;
    sorts: SortState[];
    toggleSort: (field: string) => void;
    setSort: (field: string, direction: SortDirection) => void;
    clearSort: () => void;
    getSortDirection: (field: string) => SortDirection | null;
    getSortIndex: (field: string) => number;
}

/** Resultado do hook de paginação */
export interface PaginationResult {
    page: number;
    pageSize: number;
    totalRecords: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
}

/** Definição de uma coluna da tabela */
export interface TableColumn<TData = unknown> {
    field?: keyof TData | string;
    header: string;
    sortable?: boolean;
    hidden?: boolean;
    width?: string | number;
    align?: "left" | "center" | "right";
    body?: (row: TData, options?: { rowIndex: number }) => ReactNode;
    headerStyle?: CSSProperties;
    bodyStyle?: CSSProperties;
    headerClassName?: string;
    bodyClassName?: string;
}

// ============================================================================
// TREE STATE SELECTION TYPES
// ============================================================================

/**
 * Estado visual do checkbox de seleção
 * - 'none': Nenhum item selecionado
 * - 'partial': Alguns itens selecionados (da página atual)
 * - 'all': Todos os itens selecionados (incluindo outras páginas)
 */
export type SelectionCheckboxState = "none" | "partial" | "all";

/**
 * Tipo discriminado para o estado de seleção
 * Permite tipagem segura dos três estados possíveis
 */
export type TreeSelectionState<TData, TFilters = Record<string, unknown>> =
    | { type: "none" }
    | { type: "partial"; rows: TData[] }
    | { type: "all"; filters: TFilters; excludedIds?: Array<string | number> };

/**
 * Props específicas para Tree State Selection
 */
export interface TreeSelectionProps<TData, TFilters = Record<string, unknown>> {
    /**
     * Habilita o modo de seleção com três estados
     * Quando true, adiciona checkbox no header com estados: none, partial, all
     */
    treeSelection?: boolean;

    /**
     * Itens atualmente selecionados (para estado 'partial')
     */
    selectedRows?: TData[];

    /**
     * Callback quando itens individuais são selecionados/desselecionados
     */
    onSelectedRowsChange?: (rows: TData[]) => void;

    /**
     * Callback quando "Selecionar Todos" é acionado
     * Recebe os filtros atuais para o backend processar
     */
    onSelectAll?: (filters: TFilters) => void;

    /**
     * Callback quando a seleção é limpa completamente
     */
    onSelectionClear?: () => void;

    /**
     * Estado atual da seleção (controlado externamente)
     * Se não fornecido, será calculado automaticamente
     */
    selectionState?: SelectionCheckboxState;

    /**
     * Filtros atuais aplicados na tabela
     * Serão passados para onSelectAll quando acionado
     */
    currentFilters?: TFilters;

    /**
     * IDs excluídos quando em modo "all"
     * Permite desmarcar itens específicos mesmo com "todos" selecionados
     */
    excludedIds?: Array<string | number>;

    /**
     * Callback quando um ID é excluído no modo "all"
     */
    onExcludedIdsChange?: (ids: Array<string | number>) => void;

    /**
     * Texto exibido quando todos estão selecionados
     * @default "{totalRecords} registros selecionados"
     */
    selectAllLabel?: string | ((total: number) => string);

    /**
     * Texto do botão para limpar seleção
     * @default "Limpar seleção"
     */
    clearSelectionLabel?: string;
}

// ============================================================================
// HOOK RESULT TYPE
// ============================================================================

/**
 * Resultado do hook useTreeSelection para gerenciar estado de seleção
 */
export interface UseTreeSelectionResult<TData, TFilters = Record<string, unknown>> {
    /** Estado atual da seleção */
    state: TreeSelectionState<TData, TFilters>;

    /** Estado do checkbox (para UI) */
    checkboxState: SelectionCheckboxState;

    /** Rows selecionadas (vazio se state.type === 'all') */
    selectedRows: TData[];

    /** Verifica se uma row específica está selecionada */
    isSelected: (row: TData, idKey: keyof TData) => boolean;

    /** Toggle seleção de uma row */
    toggleRow: (row: TData, idKey: keyof TData) => void;

    /** Seleciona todas as rows da página atual */
    selectPageRows: (rows: TData[]) => void;

    /** Seleciona todos (dispara onSelectAll com filtros) */
    selectAll: () => void;

    /** Limpa toda a seleção */
    clearSelection: () => void;

    /** Quantidade de itens selecionados (ou -1 se todos) */
    selectedCount: number;

    /** Se está no modo "todos selecionados" */
    isAllSelected: boolean;
}
