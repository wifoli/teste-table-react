import React, { memo, useCallback, FormEvent, ReactNode, useState, useRef, useMemo } from "react";
import { classNames } from "primereact/utils";
import type { FiltersResult, FilterMap } from "./types";

import { FormLayout, FormActions } from "../../layouts/FormLayout";
import { ButtonGradient, GhostButton, OutlinedButton } from "../../buttons";
import {
    BroomIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import { Dialog } from "../../dialog";
import { Caption } from "../../Typography";
import { Center } from "../../layouts";

// ============================================================================
// TYPES
// ============================================================================

export interface TableFiltersProps<TFilters extends FilterMap = FilterMap> {
    filters: FiltersResult<TFilters>;
    children: ReactNode;
    filterLabel?: string;
    clearLabel?: string;
    showClear?: boolean;
    loading?: boolean;
    className?: string;
    moreFilters?: ReactNode;
    layout?: "horizontal" | "vertical" | "grid";
    columns?: 1 | 2 | 3 | 4 | 5 | 6;
    onFilter?: () => void;
    onClear?: () => void;
}

// ============================================================================
// HELPERS
// ============================================================================

function hasAppliedFilters(applied: FilterMap): boolean {
    return Object.keys(applied).some((key) => {
        const value = applied[key];
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
    });
}

// ============================================================================
// SUB-COMPONENTS MEMOIZADOS
// ============================================================================

interface FilterStatusProps {
    isDirty: boolean;
    hasFilters: boolean;
}

const FilterStatus = memo(function FilterStatus({ isDirty, hasFilters }: FilterStatusProps) {
    return (
        <>
            {isDirty && (
                <Center axis="vertical" className="text-amber-600 gap-2">
                    <WarningCircleIcon size={24} />
                    <Caption>Filtragem não aplicada</Caption>
                </Center>
            )}

            {hasFilters && (
                <Center axis="vertical" className="text-gray-600 gap-2">
                    <FunnelIcon size={24} weight="fill" />
                    <Caption>Filtros ativos</Caption>
                </Center>
            )}
        </>
    );
});

interface FilterActionsProps {
    showClear: boolean;
    clearLabel: string;
    filterLabel: string;
    loading: boolean;
    isDirty: boolean;
    hasFilters: boolean;
    moreFilters: boolean;
    onClear: () => void;
    onOpenMore: () => void;
}

const FilterActions = memo(function FilterActions({
    showClear,
    clearLabel,
    filterLabel,
    loading,
    isDirty,
    hasFilters,
    moreFilters,
    onClear,
    onOpenMore,
}: FilterActionsProps) {
    const clearDisabled = !hasFilters && !isDirty;
    const submitDisabled = !isDirty && !hasFilters;

    return (
        <FormActions align="right">
            <FilterStatus isDirty={isDirty} hasFilters={hasFilters} />

            {showClear && (
                <GhostButton
                    type="button"
                    label={clearLabel}
                    icon={<BroomIcon size={24} />}
                    onClick={onClear}
                    disabled={clearDisabled}
                    intent="danger"
                    size="small"
                    className="px-6 py-2"
                />
            )}

            {moreFilters && (
                <OutlinedButton
                    type="button"
                    label="Filtros"
                    className="px-6 py-2"
                    size="small"
                    intent="tertiary"
                    icon={<FunnelIcon size={24} />}
                    onClick={onOpenMore}
                />
            )}

            <ButtonGradient
                type="submit"
                label={filterLabel}
                icon={<MagnifyingGlassIcon size={24} />}
                loading={loading}
                disabled={submitDisabled}
                intent="primary"
                size="small"
                className="px-6 py-2"
            />
        </FormActions>
    );
});

// ============================================================================
// COMPONENT
// ============================================================================

function TableFiltersComponent<TFilters extends FilterMap = FilterMap>({
    filters,
    children,
    filterLabel = "Pesquisar",
    clearLabel = "Limpar",
    showClear = true,
    loading = false,
    className,
    moreFilters,
    layout = "horizontal",
    columns = 4,
    onFilter,
    onClear,
}: TableFiltersProps<TFilters>) {
    // ============================================================================
    // STATE
    // ============================================================================
    const [visible, setVisible] = useState(false);

    // Refs para callbacks estáveis
    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    const onFilterRef = useRef(onFilter);
    onFilterRef.current = onFilter;

    const onClearRef = useRef(onClear);
    onClearRef.current = onClear;

    // ============================================================================
    // HANDLERS ESTÁVEIS
    // ============================================================================

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        filtersRef.current.applyFilters();
        onFilterRef.current?.();
    }, []);

    const handleClear = useCallback(() => {
        filtersRef.current.clearAllFilters();
        onClearRef.current?.();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            filtersRef.current.applyFilters();
            onFilterRef.current?.();
        }
    }, []);

    const handleOpenMore = useCallback(() => {
        setVisible(true);
    }, []);

    const handleHideDialog = useCallback(() => {
        setVisible(false);
    }, []);

    // ============================================================================
    // DERIVED STATE
    // ============================================================================

    const hasFilters = useMemo(() => hasAppliedFilters(filters.applied), [filters.applied]);

    // ============================================================================
    // LAYOUT MAPPING
    // ============================================================================

    type FormLayoutColumns = 1 | 2 | 3 | 4 | 6 | 12;

    const layoutConfig = useMemo(() => {
        if (layout === "vertical") {
            return { columns: 12 as FormLayoutColumns };
        }

        if (layout === "horizontal") {
            return { columns: 12 as FormLayoutColumns };
        }

        const map: Record<1 | 2 | 3 | 4 | 5 | 6, FormLayoutColumns> = {
            1: 12,
            2: 6,
            3: 4,
            4: 3,
            5: 2,
            6: 2,
        };

        return { columns: map[columns] };
    }, [layout, columns]);

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className={classNames(
                "table-filters bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4",
                className,
            )}
        >
            {/* Conteúdo dos filtros */}
            <FormLayout columns={layoutConfig.columns} gap={4} responsive>
                {children}
            </FormLayout>

            {moreFilters && (
                <Dialog
                    header="Filtragem Avançada"
                    visible={visible}
                    onHide={handleHideDialog}
                >
                    {moreFilters}
                </Dialog>
            )}

            {/* Ações */}
            <FilterActions
                showClear={showClear}
                clearLabel={clearLabel}
                filterLabel={filterLabel}
                loading={loading}
                isDirty={filters.isDirty}
                hasFilters={hasFilters}
                moreFilters={!!moreFilters}
                onClear={handleClear}
                onOpenMore={handleOpenMore}
            />
        </form>
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const TableFilters = memo(TableFiltersComponent) as typeof TableFiltersComponent;
