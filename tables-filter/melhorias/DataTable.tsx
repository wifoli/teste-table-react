import React, { useMemo, useCallback, memo, ReactElement, isValidElement, Children, useRef } from "react";
import {
    DataTable as PrimeDataTable,
    DataTableProps as PrimeDataTableProps,
} from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { classNames } from "primereact/utils";
import type { TableColumn, PaginationResult, SortingResult, SortDirection } from "./types";

// ============================================================================
// TYPES
// ============================================================================

export interface DataTableColumn<TData = unknown> extends TableColumn<TData> {}

/**
 * Props de paginação - compatível com PaginationResult do useTableQuery
 * Aceita tanto setPage/setPageSize quanto onPageChange/onPageSizeChange
 */
export interface DataTablePaginationProps {
    page: number;
    pageSize: number;
    totalRecords: number;
    /** @deprecated Use setPage - mantido para compatibilidade */
    onPageChange?: (page: number) => void;
    /** @deprecated Use setPageSize - mantido para compatibilidade */
    onPageSizeChange?: (size: number) => void;
    /** Método preferido do PaginationResult */
    setPage?: (page: number) => void;
    /** Método preferido do PaginationResult */
    setPageSize?: (size: number) => void;
    rowsPerPageOptions?: number[];
}

export interface DataTableProps<
    TData extends Record<string, any> = Record<string, any>,
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
> {
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

const ColumnHeader = memo<ColumnHeaderProps>(({ 
    header, 
    field, 
    sortable, 
    direction, 
    index, 
    onSort 
}) => {
    const handleClick = useCallback(() => {
        if (sortable) {
            onSort(field);
        }
    }, [sortable, onSort, field]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleClick();
        }
    }, [handleClick]);

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
});

ColumnHeader.displayName = "ColumnHeader";

// ============================================================================
// HELPER - Normaliza pagination props
// ============================================================================

function normalizePagination(pagination: DataTablePaginationProps | PaginationResult) {
    return {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords: 'totalRecords' in pagination 
            ? pagination.totalRecords 
            : 0,
        setPage: 'setPage' in pagination && pagination.setPage 
            ? pagination.setPage 
            : ('onPageChange' in pagination ? pagination.onPageChange : undefined),
        setPageSize: 'setPageSize' in pagination && pagination.setPageSize
            ? pagination.setPageSize
            : ('onPageSizeChange' in pagination ? pagination.onPageSizeChange : undefined),
    };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PrimeDataTableAny = PrimeDataTable as unknown as React.ComponentType<any>;

function DataTableComponent<TData extends Record<string, any> = Record<string, any>>({
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
    dataKey = "id",
    striped = true,
    gridLines = false,
    showHeader = true,
    className,
    size = "normal",
    children,
    ...restProps
}: DataTableProps<TData>) {
    // ========== REFS PARA ESTABILIDADE ==========
    
    const sortingRef = useRef(sorting);
    sortingRef.current = sorting;

    const paginationRef = useRef(pagination);
    paginationRef.current = pagination;

    // ========== HANDLERS ESTÁVEIS ==========

    const handleSort = useCallback((field: string) => {
        sortingRef.current?.toggleSort(field);
    }, []);

    const handleSelectionChange = useCallback(
        (e: { value: TData | TData[] }) => {
            onSelectionChange?.(e.value);
        },
        [onSelectionChange],
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

    // ========== MEMOIZED VALUES ==========

    // Extrair valores de sorting para dependências estáveis
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
                .map((col) => {
                    const direction = sorting?.getSortDirection(col.field) ?? null;
                    const index = sorting?.getSortIndex(col.field) ?? -1;

                    return (
                        <Column
                            key={col.field}
                            field={col.field}
                            header={
                                <ColumnHeader
                                    header={col.header}
                                    field={col.field}
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

    // Normalizar pagination para render
    const normalizedPagination = useMemo(() => {
        if (!pagination) return null;
        return normalizePagination(pagination);
    }, [pagination]);

    // ========== RENDER ==========

    return (
        <div className={classNames("datatable-container", className)}>
            <PrimeDataTableAny
                value={data}
                lazy
                loading={loading}
                emptyMessage={emptyMessage}
                stripedRows={striped}
                showGridlines={gridLines}
                showHeaders={showHeader}
                selection={selection}
                onSelectionChange={handleSelectionChange}
                selectionMode={selectionMode}
                dataKey={dataKey}
                className={classNames("rounded-lg overflow-hidden", sizeClass)}
                {...restProps}
            >
                {renderColumns}
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
