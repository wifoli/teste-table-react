import { useCallback, useMemo, useRef } from "react";
import type {
    TreeSelectionState,
    SelectionCheckboxState,
    UseTreeSelectionResult,
} from "./types";

// ============================================================================
// HOOK OPTIONS
// ============================================================================

export interface UseTreeSelectionOptions<TData, TFilters = Record<string, unknown>> {
    /** Rows atualmente selecionadas */
    selectedRows?: TData[];

    /** Callback quando rows individuais mudam */
    onSelectedRowsChange?: (rows: TData[]) => void;

    /** Callback quando "selecionar todos" é acionado */
    onSelectAll?: (filters: TFilters) => void;

    /** Callback quando seleção é limpa */
    onSelectionClear?: () => void;

    /** Filtros atuais para passar ao onSelectAll */
    currentFilters?: TFilters;

    /** Estado forçado externamente */
    forcedState?: SelectionCheckboxState;

    /** Total de registros (para determinar se página está toda selecionada) */
    totalRecords?: number;

    /** Registros da página atual */
    pageData?: TData[];

    /** Chave para identificar cada row */
    idKey?: keyof TData;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useTreeSelection<TData, TFilters = Record<string, unknown>>(
    options: UseTreeSelectionOptions<TData, TFilters>
): UseTreeSelectionResult<TData, TFilters> {
    const {
        selectedRows = [],
        onSelectedRowsChange,
        onSelectAll,
        onSelectionClear,
        currentFilters,
        forcedState,
        totalRecords = 0,
        pageData = [],
        idKey = "id" as keyof TData,
    } = options;

    // Refs para handlers estáveis
    const optionsRef = useRef(options);
    optionsRef.current = options;

    // ========== COMPUTED STATE ==========

    const checkboxState = useMemo<SelectionCheckboxState>(() => {
        if (forcedState) return forcedState;

        if (selectedRows.length === 0) return "none";

        // Se temos todos os registros selecionados
        if (totalRecords > 0 && selectedRows.length >= totalRecords) {
            return "all";
        }

        return "partial";
    }, [forcedState, selectedRows.length, totalRecords]);

    const state = useMemo<TreeSelectionState<TData, TFilters>>(() => {
        switch (checkboxState) {
            case "none":
                return { type: "none" };
            case "all":
                return {
                    type: "all",
                    filters: (currentFilters ?? {}) as TFilters,
                };
            case "partial":
            default:
                return { type: "partial", rows: selectedRows };
        }
    }, [checkboxState, selectedRows, currentFilters]);

    // ========== MEMOIZED HELPERS ==========

    const selectedIdsSet = useMemo(() => {
        const set = new Set<unknown>();
        selectedRows.forEach((row) => {
            const id = row[idKey];
            if (id !== undefined) set.add(id);
        });
        return set;
    }, [selectedRows, idKey]);

    // ========== STABLE HANDLERS ==========

    const isSelected = useCallback(
        (row: TData, key: keyof TData = idKey): boolean => {
            const id = row[key];
            return selectedIdsSet.has(id);
        },
        [selectedIdsSet, idKey]
    );

    const toggleRow = useCallback(
        (row: TData, key: keyof TData = idKey) => {
            const { onSelectedRowsChange, selectedRows = [] } = optionsRef.current;
            if (!onSelectedRowsChange) return;

            const id = row[key];
            const isCurrentlySelected = selectedRows.some((r) => r[key] === id);

            if (isCurrentlySelected) {
                onSelectedRowsChange(selectedRows.filter((r) => r[key] !== id));
            } else {
                onSelectedRowsChange([...selectedRows, row]);
            }
        },
        [idKey]
    );

    const selectPageRows = useCallback((rows: TData[]) => {
        const { onSelectedRowsChange, selectedRows = [] } = optionsRef.current;
        if (!onSelectedRowsChange) return;

        const currentKey = optionsRef.current.idKey ?? ("id" as keyof TData);

        // Merge com rows existentes, evitando duplicatas
        const existingIds = new Set(selectedRows.map((r) => r[currentKey]));
        const newRows = rows.filter((r) => !existingIds.has(r[currentKey]));

        onSelectedRowsChange([...selectedRows, ...newRows]);
    }, []);

    const selectAll = useCallback(() => {
        const { onSelectAll, currentFilters } = optionsRef.current;
        if (onSelectAll) {
            onSelectAll((currentFilters ?? {}) as TFilters);
        }
    }, []);

    const clearSelection = useCallback(() => {
        const { onSelectionClear, onSelectedRowsChange } = optionsRef.current;

        if (onSelectionClear) {
            onSelectionClear();
        }

        if (onSelectedRowsChange) {
            onSelectedRowsChange([]);
        }
    }, []);

    // ========== COMPUTED VALUES ==========

    const selectedCount = useMemo(() => {
        if (checkboxState === "all") return -1; // -1 indica "todos"
        return selectedRows.length;
    }, [checkboxState, selectedRows.length]);

    const isAllSelected = checkboxState === "all";

    // ========== RETURN ==========

    return {
        state,
        checkboxState,
        selectedRows,
        isSelected,
        toggleRow,
        selectPageRows,
        selectAll,
        clearSelection,
        selectedCount,
        isAllSelected,
    };
}
