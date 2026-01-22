import {
  DataTable as PrimeDataTable,
  DataTableProps as PrimeDataTableProps,
  DataTableSelectionSingleChangeEvent,
  DataTableSelectionMultipleChangeEvent,
} from 'primereact/datatable';
import { Column, ColumnProps } from 'primereact/column';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { classNames } from 'primereact/utils';
import { ReactNode } from 'react';

export interface DataTableColumn extends Omit<ColumnProps, 'sortable'> {
  field: string;
  header: string;
  sortable?: boolean;
  body?: (data: any) => ReactNode;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  filter?: boolean;
  filterElement?: ReactNode;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  rowsPerPageOptions?: number[];
}

export interface DataTableSorting {
  multiSortMeta?: { field: string; order: 1 | -1 }[];
  sortMode?: 'single' | 'multiple';
  onSort: (e: { multiSortMeta?: { field: string; order: 1 | -1 }[] }) => void;
}

export interface DataTableProps<T extends Record<string, any> = any>
  extends Omit<PrimeDataTableProps<T[]>,
    'value' | 'selection' | 'onSelectionChange' | 'paginator' | 'rows' | 'cellSelection'
  > {
  data: T[];
  columns?: DataTableColumn[];

  // Pagination (external)
  pagination?: DataTablePagination;

  /**
   * Columns via JSX (PrimeReact padrão)
   * Se informado, tem precedência sobre `columns`
   */
  children?: ReactNode;

  // Sorting (Django DRF via URL)
  sorting?: DataTableSorting;

  // Loading state
  loading?: boolean;

  // Empty state
  emptyMessage?: string | ReactNode;

  // Selection
  selection?: T | T[] | null;
  onSelectionChange?: (e: { value: T | T[] | null }) => void;
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';

  // Style
  striped?: boolean;
  gridlines?: boolean;
  showHeader?: boolean;

  // Other
  lazy?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any> = any>({
  data,
  columns,
  children,
  pagination,
  sorting,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  selection,
  onSelectionChange,
  selectionMode,
  striped = true,
  gridlines = false,
  showHeader = true,
  lazy = true,
  className,
  ...props
}: DataTableProps<T>) {
  // Adapter de seleção para compatibilidade com PrimeReact
  const handleSelectionChange = (e: DataTableSelectionSingleChangeEvent<T[]> | DataTableSelectionMultipleChangeEvent<T[]>) => {
    if (!onSelectionChange) return;

    // single ou multiple
    if (selectionMode === 'single' || selectionMode === 'radiobutton') {
      onSelectionChange({ value: Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null });
    } else {
      onSelectionChange({ value: e.value ?? [] });
    }
  };

  const shouldRenderChildren = Boolean(children);
  const shouldRenderColumns = !children && columns?.length;

  return (
    <div className={classNames('datatable-wrapper', className)}>
      <PrimeDataTable<T[]>
        value={data}
        lazy={lazy}
        loading={loading}
        emptyMessage={emptyMessage}
        stripedRows={striped}
        showGridlines={gridlines}
        showHeaders={showHeader}
        selection={selection as any}
        onSelectionChange={handleSelectionChange as any}
        cellSelection={false}
        selectionMode={selectionMode}
        dataKey="id"
        sortMode={sorting?.sortMode ?? 'single'}
        multiSortMeta={sorting?.multiSortMeta}
        onSort={sorting?.onSort}
        className="border rounded-lg overflow-hidden"
        {...(props as any)}
      >
        {shouldRenderChildren && children}

        {shouldRenderColumns &&
          columns?.map(({ field, header, body, bodyStyle, headerStyle, filter, filterElement, sortable, ...rest }) => (
            <Column
              key={field}
              field={field}
              header={header}
              body={body}
              sortable={sortable}
              style={bodyStyle}
              headerStyle={headerStyle}
              filter={filter}
              filterElement={filterElement}
              {...rest}
            />
          ))}
      </PrimeDataTable>

      {pagination && (
        <Paginator
          first={(pagination.page - 1) * pagination.pageSize}
          rows={pagination.pageSize}
          totalRecords={pagination.totalRecords}
          rowsPerPageOptions={pagination.rowsPerPageOptions || [10, 25, 50, 100]}
          onPageChange={(e: PaginatorPageChangeEvent) => {
            const newPage = Math.floor(e.first / e.rows) + 1;
            if (newPage !== pagination.page) pagination.onPageChange(newPage);
            if (e.rows !== pagination.pageSize) pagination.onPageSizeChange(e.rows);
          }}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          currentPageReportTemplate="{first} a {last} de {totalRecords} registros"
          className="mt-4"
        />
      )}
    </div>
  );
}
