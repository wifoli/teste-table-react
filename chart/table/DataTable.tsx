import React, {
    useMemo,
    useCallback,
    memo,
    ReactElement,
    isValidElement,
    Children,
    useRef,
} from "react";
import {
    DataTable as PrimeDataTable,
    DataTableProps as PrimeDataTableProps,
} from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import type {
    TableColumn,
    PaginationResult,
    SortingResult,
    SortDirection,
    TreeSelectionProps,
    SelectionCheckboxState,
} from "./types";
import { useTreeSelection } from "./useTreeSelection";

// ============================================================================
// TYPES
// ============================================================================

export interface DataTableColumn<TData = unknown> extends TableColumn<TData> {}

export interface DataTablePaginationProps {
    page: number;
    pageSize: number;
    totalRecords: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    setPage?: (page: number) => void;
    setPageSize?: (size: number) => void;
    rowsPerPageOptions?: number[];
}

export interface DataTableActionsProps<TData> {
    header?: React.ReactNode;
    width?: string | number;
    align?: "left" | "center" | "right";
    body: (row: TData) => React.ReactNode;
}

export interface DataTableProps<
    TData extends Record<string, any> = Record<string, any>,
    TFilters = Record<string, unknown>
> extends Omit<
        PrimeDataTableProps<TData[]>,
        | "value"
        | "paginator"
        | "rows"
        | "onSort"
        | "sortField"
        | "sortOrder"
        | "selection"
        | "onSelectionChange"
        | "dataKey"
    >,
        TreeSelectionProps<TData, TFilters> {
    data: TData[];
    columns?: DataTableColumn<TData>[];
    loading?: boolean;
    emptyMessage?: string | React.ReactNode;
    pagination?: DataTablePaginationProps | PaginationResult;
    pageSizeOptions?: number[];
    sorting?: SortingResult;
    selection?: TData | TData[];
    onSelectionChange?: (value: TData | TData[]) => void;
    selectionMode?: "single" | "multiple" | "checkbox" | "radiobutton";
    dataKey?: keyof TData;
    striped?: boolean;
    gridLines?: boolean;
    showHeader?: boolean;
    className?: string;
    size?: "small" | "normal" | "large";
    actions?: DataTableActionsProps<TData>;
    children?: React.ReactNode;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SortIconProps {
    direction: SortDirection | null;
    index?: number;
    showIndex?: boolean;
}

const SortIcon = memo<SortIconProps>(({ direction, index = -1, showIndex = false }) => {
    if (direction === "asc") {
        return (
            <span className="ml-2 inline-flex items-center">
                <i className="pi pi-sort-up text-primary-600" />
                {showIndex && index >= 0 && (
                    <span className="ml-1 text-xs text-gray-500">{index + 1}</span>
                )}
            </span>
        );
    }

    if (direction === "desc") {
        return (
            <span className="ml-2 inline-flex items-center">
                <i className="pi pi-sort-down text-primary-600" />
                {showIndex && index >= 0 && (
                    <span className="ml-1 text-xs text-gray-500">{index + 1}</span>
                )}
            </span>
        );
    }

    return <i className="pi pi-sort-alt ml-2 text-gray-400" />;
});

SortIcon.displayName = "SortIcon";

interface ColumnHeaderProps {
    header: string;
    field: string;
    sortable?: boolean;
    direction: SortDirection | null;
    index: number;
    onSort: (field: string) => void;
}

const ColumnHeader = memo<ColumnHeaderProps>(
    ({ header, field, sortable, direction, index, onSort }) => {
        const handleClick = useCallback(() => {
            if (sortable) {
                onSort(field);
            }
        }, [sortable, onSort, field]);

        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                    handleClick();
                }
            },
            [handleClick]
        );

        return (
            <div
                className={classNames("flex items-center", {
                    "cursor-pointer select-none hover:text-primary-600": sortable,
                })}
                onClick={handleClick}
                role={sortable ? "button" : undefined}
                tabIndex={sortable ? 0 : undefined}
                onKeyDown={sortable ? handleKeyDown : undefined}
            >
                <span>{header}</span>
                {sortable && <SortIcon direction={direction} index={index} showIndex={false} />}
            </div>
        );
    }
);

ColumnHeader.displayName = "ColumnHeader";

// ============================================================================
// TREE STATE CHECKBOX COMPONENT
// ============================================================================

interface TreeCheckboxHeaderProps {
    state: SelectionCheckboxState;
    onToggle: () => void;
    disabled?: boolean;
}

const TreeCheckboxHeader = memo<TreeCheckboxHeaderProps>(({ state, onToggle, disabled }) => {
    const isChecked = state === "all";
    const isIndeterminate = state === "partial";

    return (
        <div className="flex items-center justify-center">
            <Checkbox
                checked={isChecked}
                onChange={onToggle}
                disabled={disabled}
                className={classNames({
                    "p-checkbox-indeterminate": isIndeterminate,
                })}
                pt={{
                    box: {
                        className: classNames({
                            "bg-primary-100 border-primary-500": isIndeterminate,
                        }),
                    },
                }}
            />
        </div>
    );
});

TreeCheckboxHeader.displayName = "TreeCheckboxHeader";

interface TreeCheckboxCellProps<TData> {
    row: TData;
    isSelected: boolean;
    onToggle: (row: TData) => void;
    disabled?: boolean;
}

const TreeCheckboxCellComponent = <TData,>({
    row,
    isSelected,
    onToggle,
    disabled,
}: TreeCheckboxCellProps<TData>) => {
    const handleChange = useCallback(() => {
        onToggle(row);
    }, [onToggle, row]);

    return (
        <div className="flex items-center justify-center">
            <Checkbox checked={isSelected} onChange={handleChange} disabled={disabled} />
        </div>
    );
};

const TreeCheckboxCell = memo(TreeCheckboxCellComponent) as typeof TreeCheckboxCellComponent;

// ============================================================================
// SELECTION BANNER COMPONENT
// ============================================================================

interface SelectionBannerProps {
    selectedCount: number;
    totalRecords: number;
    isAllSelected: boolean;
    onSelectAll: () => void;
    onClear: () => void;
    selectAllLabel?: string | ((total: number) => string);
    clearSelectionLabel?: string;
}

const SelectionBanner = memo<SelectionBannerProps>(
    ({
        selectedCount,
        totalRecords,
        isAllSelected,
        onSelectAll,
        onClear,
        selectAllLabel,
        clearSelectionLabel = "Limpar seleção",
    }) => {
        if (selectedCount === 0 && !isAllSelected) return null;

        const getSelectAllText = () => {
            if (typeof selectAllLabel === "function") {
                return selectAllLabel(totalRecords);
            }
            return selectAllLabel ?? `${totalRecords} registros selecionados`;
        };

        return (
            <div className="bg-primary-50 border-b border-primary-200 px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-primary-700">
                    {isAllSelected ? (
                        getSelectAllText()
                    ) : (
                        <>
                            <strong>{selectedCount}</strong> registro(s) selecionado(s) nesta
                            página.
                            {totalRecords > selectedCount && (
                                <button
                                    type="button"
                                    onClick={onSelectAll}
                                    className="ml-2 text-primary-600 hover:text-primary-800 underline font-medium"
                                >
                                    Selecionar todos os {totalRecords} registros
                                </button>
                            )}
                        </>
                    )}
                </span>

                <button
                    type="button"
                    onClick={onClear}
                    className="text-sm text-gray-600 hover:text-gray-800"
                >
                    {clearSelectionLabel}
                </button>
            </div>
        );
    }
);

SelectionBanner.displayName = "SelectionBanner";

// ============================================================================
// HELPER - Normaliza pagination props
// ============================================================================

function normalizePagination(pagination: DataTablePaginationProps | PaginationResult) {
    return {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords: "totalRecords" in pagination ? pagination.totalRecords : 0,
        setPage:
            "setPage" in pagination && pagination.setPage
                ? pagination.setPage
                : "onPageChange" in pagination
                  ? pagination.onPageChange
                  : undefined,
        setPageSize:
            "setPageSize" in pagination && pagination.setPageSize
                ? pagination.setPageSize
                : "onPageSizeChange" in pagination
                  ? pagination.onPageSizeChange
                  : undefined,
    };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PrimeDataTableAny = PrimeDataTable as unknown as React.ComponentType<any>;

function DataTableComponent<
    TData extends Record<string, any> = Record<string, any>,
    TFilters = Record<string, unknown>
>({
    data,
    columns,
    loading = false,
    emptyMessage = "Nenhum registro encontrado",
    pagination,
    pageSizeOptions = [10, 25, 50, 100],
    sorting,
    selection,
    onSelectionChange,
    selectionMode,
    dataKey = "id" as keyof TData,
    striped = true,
    gridLines = false,
    showHeader = true,
    className,
    size = "normal",
    actions,
    children,
    // Tree Selection Props
    treeSelection = false,
    selectedRows,
    onSelectedRowsChange,
    onSelectAll,
    onSelectionClear,
    selectionState: forcedSelectionState,
    currentFilters,
    excludedIds,
    onExcludedIdsChange,
    selectAllLabel,
    clearSelectionLabel,
    ...restProps
}: DataTableProps<TData, TFilters>) {
    // ========== REFS PARA ESTABILIDADE ==========

    const sortingRef = useRef(sorting);
    sortingRef.current = sorting;

    const paginationRef = useRef(pagination);
    paginationRef.current = pagination;

    // ========== TREE SELECTION HOOK ==========

    const normalizedPagination = useMemo(() => {
        if (!pagination) return null;
        return normalizePagination(pagination);
    }, [pagination]);

    const treeSelectionResult = useTreeSelection<TData, TFilters>({
        selectedRows,
        onSelectedRowsChange,
        onSelectAll,
        onSelectionClear,
        currentFilters,
        forcedState: forcedSelectionState,
        totalRecords: normalizedPagination?.totalRecords ?? 0,
        pageData: data,
        idKey: dataKey,
    });

    // ========== HANDLERS ESTÁVEIS ==========

    const handleSort = useCallback((field: string) => {
        sortingRef.current?.toggleSort(field);
    }, []);

    const handleSelectionChange = useCallback(
        (e: { value: TData | TData[] }) => {
            onSelectionChange?.(e.value);
        },
        [onSelectionChange]
    );

    const handlePageChange = useCallback((e: PaginatorPageChangeEvent) => {
        const pag = paginationRef.current;
        if (!pag) return;

        const normalized = normalizePagination(pag);
        const newPage = Math.floor(e.first / e.rows) + 1;

        if (e.rows !== normalized.pageSize) {
            normalized.setPageSize?.(e.rows);
        } else if (newPage !== normalized.page) {
            normalized.setPage?.(newPage);
        }
    }, []);

    // Tree Selection Handlers
    const handleTreeHeaderToggle = useCallback(() => {
        if (treeSelectionResult.checkboxState === "none") {
            // Seleciona todos da página atual
            treeSelectionResult.selectPageRows(data);
        } else if (treeSelectionResult.checkboxState === "partial") {
            // Já tem alguns selecionados, pergunta se quer todos
            treeSelectionResult.selectAll();
        } else {
            // Já está tudo selecionado, limpa
            treeSelectionResult.clearSelection();
        }
    }, [treeSelectionResult, data]);

    const handleTreeRowToggle = useCallback(
        (row: TData) => {
            treeSelectionResult.toggleRow(row, dataKey);
        },
        [treeSelectionResult, dataKey]
    );

    const isRowSelected = useCallback(
        (row: TData) => {
            if (treeSelectionResult.isAllSelected) return true;
            return treeSelectionResult.isSelected(row, dataKey);
        },
        [treeSelectionResult, dataKey]
    );

    // ========== MEMOIZED VALUES ==========

    const sortingOrdering = sorting?.ordering ?? "";

    const renderColumns = useMemo(() => {
        if (children) {
            return Children.map(children, (child) => {
                if (!isValidElement(child)) return null;
                const childProps = child.props as ColumnProps & { sortable?: boolean };
                const field = childProps.field;

                if (childProps.sortable && field && sorting) {
                    const direction = sorting.getSortDirection(field);
                    const index = sorting.getSortIndex(field);

                    return React.cloneElement(child as ReactElement<ColumnProps>, {
                        ...childProps,
                        sortable: false,
                        header: (
                            <ColumnHeader
                                header={
                                    typeof childProps.header === "string"
                                        ? childProps.header
                                        : String(childProps.header)
                                }
                                field={field}
                                sortable={true}
                                direction={direction}
                                index={index}
                                onSort={handleSort}
                            />
                        ),
                    });
                }

                return child;
            });
        }

        if (columns) {
            return columns
                .filter((col) => !col.hidden)
                .map((col, idx) => {
                    const hasField = Boolean(col.field);

                    const direction = hasField
                        ? (sorting?.getSortDirection(col.field as string) ?? null)
                        : null;

                    const index = hasField
                        ? (sorting?.getSortIndex(col.field as string) ?? -1)
                        : -1;

                    return (
                        <Column
                            key={String(col.field ?? `__virtual__${idx}`)}
                            {...(hasField && { field: col.field as string })}
                            header={
                                <ColumnHeader
                                    header={String(col.header)}
                                    field={col.field as string}
                                    sortable={col.sortable}
                                    direction={direction}
                                    index={index}
                                    onSort={handleSort}
                                />
                            }
                            body={col.body as ColumnProps["body"]}
                            style={{
                                ...col.bodyStyle,
                                width: col.width,
                                textAlign: col.align,
                            }}
                            headerStyle={{
                                ...col.headerStyle,
                                width: col.width,
                                textAlign: col.align,
                            }}
                            headerClassName={col.headerClassName}
                            bodyClassName={col.bodyClassName}
                            sortable={false}
                        />
                    );
                });
        }

        return null;
    }, [children, columns, sortingOrdering, handleSort, sorting]);

    const sizeClass = useMemo(() => {
        switch (size) {
            case "small":
                return "p-datatable-sm";
            case "large":
                return "p-datatable-lg";
            default:
                return "";
        }
    }, [size]);

    // Tree Selection Column
    const treeSelectionColumn = useMemo(() => {
        if (!treeSelection) return null;

        return (
            <Column
                key="__tree_selection__"
                header={
                    <TreeCheckboxHeader
                        state={treeSelectionResult.checkboxState}
                        onToggle={handleTreeHeaderToggle}
                        disabled={loading}
                    />
                }
                body={(row: TData) => (
                    <TreeCheckboxCell
                        row={row}
                        isSelected={isRowSelected(row)}
                        onToggle={handleTreeRowToggle}
                        disabled={loading}
                    />
                )}
                headerStyle={{ width: "3rem" }}
                bodyStyle={{ textAlign: "center" }}
            />
        );
    }, [
        treeSelection,
        treeSelectionResult.checkboxState,
        handleTreeHeaderToggle,
        handleTreeRowToggle,
        isRowSelected,
        loading,
    ]);

    // Standard Selection Column (non-tree)
    const selectionColumn = useMemo(() => {
        if (treeSelection) return null; // Tree selection já adiciona sua coluna
        if (selectionMode !== "checkbox") return null;

        return (
            <Column
                key="__selection__"
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
                bodyStyle={{ textAlign: "center" }}
            />
        );
    }, [selectionMode, treeSelection]);

    const actionsColumn = useMemo(() => {
        if (!actions) return null;

        return (
            <Column
                key="__actions__"
                header={actions.header ?? ""}
                body={(row: TData) => actions.body(row)}
                style={{
                    width: actions.width ?? "1%",
                    textAlign: actions.align ?? "right",
                    whiteSpace: "nowrap",
                }}
                headerStyle={{
                    width: actions.width ?? "1%",
                    textAlign: actions.align ?? "right",
                }}
            />
        );
    }, [actions]);

    // ========== RENDER ==========

    return (
        <div className={classNames("datatable-container", className)}>
            {/* Selection Banner */}
            {treeSelection && (
                <SelectionBanner
                    selectedCount={treeSelectionResult.selectedCount}
                    totalRecords={normalizedPagination?.totalRecords ?? 0}
                    isAllSelected={treeSelectionResult.isAllSelected}
                    onSelectAll={treeSelectionResult.selectAll}
                    onClear={treeSelectionResult.clearSelection}
                    selectAllLabel={selectAllLabel}
                    clearSelectionLabel={clearSelectionLabel}
                />
            )}

            <PrimeDataTableAny
                value={data}
                lazy
                loading={loading}
                emptyMessage={emptyMessage}
                stripedRows={striped}
                showGridlines={gridLines}
                showHeaders={showHeader}
                selection={treeSelection ? undefined : selection}
                onSelectionChange={treeSelection ? undefined : handleSelectionChange}
                selectionMode={treeSelection ? undefined : selectionMode}
                dataKey={dataKey as string}
                className={classNames("rounded-lg overflow-hidden", sizeClass)}
                {...restProps}
            >
                {treeSelectionColumn}
                {selectionColumn}
                {renderColumns}
                {actionsColumn}
            </PrimeDataTableAny>

            {normalizedPagination && (
                <Paginator
                    first={(normalizedPagination.page - 1) * normalizedPagination.pageSize}
                    rows={normalizedPagination.pageSize}
                    totalRecords={normalizedPagination.totalRecords}
                    rowsPerPageOptions={pageSizeOptions}
                    onPageChange={handlePageChange}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                    currentPageReportTemplate="{first} a {last} de {totalRecords} registros"
                    className="mt-4 border-t border-gray-200 pt-4"
                />
            )}
        </div>
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;

// Re-export types
export type { TreeSelectionProps, SelectionCheckboxState, TreeSelectionState } from "./types";
