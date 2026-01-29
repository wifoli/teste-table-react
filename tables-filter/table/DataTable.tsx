import React, { useMemo, useCallback, memo, ReactElement, isValidElement, Children } from "react";
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

export interface DataTablePaginationProps extends PaginationResult {
    page: number;
    pageSize: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
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
    pagination?: DataTablePaginationProps;
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
    sorting?: SortingResult;
    onSort?: (field: string) => void;
}

const ColumnHeader = memo<ColumnHeaderProps>(({ header, field, sortable, sorting, onSort }) => {
    const handleClick = useCallback(() => {
        if (sortable && onSort) {
            onSort(field);
        }
    }, [sortable, onSort, field]);

    const direction = sorting?.getSortDirection(field) ?? null;
    const index = sorting?.getSortIndex(field) ?? -1;

    return (
        <div
            className={classNames("flex items-center", {
                "cursor-pointer select-none hover:text-primary-600": sortable,
            })}
            onClick={handleClick}
            role={sortable ? "button" : undefined}
            tabIndex={sortable ? 0 : undefined}
            onKeyDown={sortable ? (e) => e.key === "Enter" && handleClick() : undefined}
        >
            <span>{header}</span>
            {sortable && <SortIcon direction={direction} index={index} showIndex={false} />}
        </div>
    );
});

ColumnHeader.displayName = "ColumnHeader";

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

    const handleSort = useCallback(
        (field: string) => {
            sorting?.toggleSort(field);
        },
        [sorting],
    );

    const handleSelectionChange = useCallback(
        (e: { value: TData | TData[] }) => {
            onSelectionChange?.(e.value);
        },
        [onSelectionChange],
    );

    const handlePageChange = useCallback(
        (e: PaginatorPageChangeEvent) => {
            if (!pagination) return;

            const newPage = Math.floor(e.first / e.rows) + 1;

            if (e.rows !== pagination.pageSize) {
                pagination.onPageSizeChange(e.rows);
            } else if (newPage !== pagination.page) {
                pagination.onPageChange(newPage);
            }
        },
        [pagination],
    );


    const renderColumns = useMemo(() => {
        if (children) {
            return Children.map(children, (child) => {
                if (!isValidElement(child)) return null;
                const childProps = child.props as ColumnProps & { sortable?: boolean };
                const field = childProps.field;

                if (childProps.sortable && field && sorting) {
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
                                sorting={sorting}
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
                .map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={
                            <ColumnHeader
                                header={col.header}
                                field={col.field}
                                sortable={col.sortable}
                                sorting={sorting}
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
                ));
        }

        return null;
    }, [children, columns, sorting, handleSort]);


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

            {pagination && (
                <Paginator
                    first={(pagination.page - 1) * pagination.pageSize}
                    rows={pagination.pageSize}
                    totalRecords={pagination.totalRecords}
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

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;

