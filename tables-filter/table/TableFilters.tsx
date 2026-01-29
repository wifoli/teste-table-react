import React, { memo, useCallback, FormEvent, ReactNode, useState } from "react";
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
    moreFilters = false,
    layout = "horizontal",
    columns = 4,
    onFilter,
    onClear,
}: TableFiltersProps<TFilters>) {
    // ============================================================================
    // HANDLERS
    // ============================================================================
    const [visible, setVisible] = useState(false);

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            filters.applyFilters();
            onFilter?.();
        },
        [filters, onFilter],
    );

    const handleClear = useCallback(() => {
        filters.clearAllFilters();
        onClear?.();
    }, [filters, onClear]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                filters.applyFilters();
                onFilter?.();
            }
        },
        [filters, onFilter],
    );

    // ============================================================================
    // LAYOUT MAPPING
    // ============================================================================

    type FormLayoutColumns = 1 | 2 | 3 | 4 | 6 | 12;

    const layoutConfig: { columns: FormLayoutColumns } = (() => {
        if (layout === "vertical") {
            return { columns: 12 };
        }

        if (layout === "horizontal") {
            return { columns: 12 };
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
    })();

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
                    onHide={() => {
                        if (!visible) return;
                        setVisible(false);
                    }}
                >
                    {moreFilters}
                </Dialog>
            )}

            {/* Ações */}
            <FormActions align="right">
                {filters.isDirty && (
                    <Center axis="vertical" className="text-amber-600 gap-2">
                        <WarningCircleIcon size={24} />
                        <Caption>Filtragem não aplicada</Caption>
                    </Center>
                )}

                {hasAppliedFilters(filters.applied) && (
                    <Center axis="vertical" className="text-gray-600 gap-2">
                        <FunnelIcon size={24} weight="fill" />
                        <Caption>Filtros ativos</Caption>
                    </Center>
                )}

                {showClear && (
                    <GhostButton
                        type="button"
                        label={clearLabel}
                        icon={<BroomIcon size={24} />}
                        onClick={handleClear}
                        disabled={!hasAppliedFilters(filters.applied) && !filters.isDirty}
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
                        onClick={() => setVisible(true)}
                    />
                )}

                <ButtonGradient
                    type="submit"
                    label={filterLabel}
                    icon={<MagnifyingGlassIcon size={24} />}
                    loading={loading}
                    disabled={!filters.isDirty && !hasAppliedFilters(filters.applied)}
                    intent="primary"
                    size="small"
                    className="px-6 py-2"
                />
            </FormActions>
        </form>
    );
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
// EXPORT
// ============================================================================

export const TableFilters = memo(TableFiltersComponent) as typeof TableFiltersComponent;
