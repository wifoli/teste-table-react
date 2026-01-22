import React, { useMemo, useCallback, memo, ReactElement, isValidElement, Children } from 'react';
import {
  DataTable as PrimeDataTable,
  DataTableProps as PrimeDataTableProps
} from 'primereact/datatable';
import { Column, ColumnProps } from 'primereact/column';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { classNames } from 'primereact/utils';
import type {
  TableColumn,
  PaginationResult,
  SortingResult,
  SortDirection
} from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface DataTableColumn<TData = unknown> extends TableColumn<TData> { }

export interface DataTablePaginationProps extends PaginationResult {
  totalRecords: number;
}


export interface DataTableProps<
  TData extends Record<string, any> = Record<string, any>
> extends Omit<
  PrimeDataTableProps<TData[]>,
  | 'value'
  | 'paginator'
  | 'rows'
  | 'onSort'
  | 'sortField'
  | 'sortOrder'
  | 'selection'
  | 'onSelectionChange'
  | 'dataKey'
> {
  /** Dados a serem exibidos */
  data: TData[];

  /** Definição das colunas (alternativa a children) */
  columns?: DataTableColumn<TData>[];

  /** Estado de carregamento */
  loading?: boolean;

  /** Mensagem quando vazio */
  emptyMessage?: string | React.ReactNode;

  // Paginação
  /** Props de paginação (do useTableQuery) */
  pagination?: DataTablePaginationProps;
  /** Opções de itens por página */
  pageSizeOptions?: number[];

  // Ordenação
  /** Props de ordenação (do useTableQuery) */
  sorting?: SortingResult;

  // Seleção
  /** Valor selecionado */
  selection?: TData | TData[];
  /** Callback de seleção */
  onSelectionChange?: (value: TData | TData[]) => void;
  /** Modo de seleção */
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';
  /** Campo de chave única */
  dataKey?: keyof TData;

  // Estilo
  /** Linhas zebradas */
  striped?: boolean;
  /** Mostrar grid */
  gridLines?: boolean;
  /** Mostrar cabeçalho */
  showHeader?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Tamanho da tabela */
  size?: 'small' | 'normal' | 'large';

  /** Children (colunas via JSX) */
  children?: React.ReactNode;
}

// ============================================================================
// SORT ICON COMPONENT (Memoizado)
// ============================================================================

interface SortIconProps {
  direction: SortDirection | null;
  index?: number;
  showIndex?: boolean;
}

const SortIcon = memo<SortIconProps>(({ direction, index = -1, showIndex = false }) => {
  if (direction === 'asc') {
    return (
      <span className="ml-2 inline-flex items-center">
        <i className="pi pi-sort-up text-primary-600" />
        {showIndex && index >= 0 && (
          <span className="ml-1 text-xs text-gray-500">{index + 1}</span>
        )}
      </span>
    );
  }

  if (direction === 'desc') {
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

SortIcon.displayName = 'SortIcon';

// ============================================================================
// COLUMN HEADER COMPONENT (Memoizado)
// ============================================================================

interface ColumnHeaderProps {
  header: string;
  field: string;
  sortable?: boolean;
  sorting?: SortingResult;
  onSort?: (field: string) => void;
}

const ColumnHeader = memo<ColumnHeaderProps>(({
  header,
  field,
  sortable,
  sorting,
  onSort
}) => {
  const handleClick = useCallback(() => {
    if (sortable && onSort) {
      onSort(field);
    }
  }, [sortable, onSort, field]);

  const direction = sorting?.getSortDirection(field) ?? null;
  const index = sorting?.getSortIndex(field) ?? -1;

  return (
    <div
      className={classNames(
        'flex items-center',
        { 'cursor-pointer select-none hover:text-primary-600': sortable }
      )}
      onClick={handleClick}
      role={sortable ? 'button' : undefined}
      tabIndex={sortable ? 0 : undefined}
      onKeyDown={sortable ? (e) => e.key === 'Enter' && handleClick() : undefined}
    >
      <span>{header}</span>
      {sortable && <SortIcon direction={direction} index={index} showIndex={false} />}
    </div>
  );
});

ColumnHeader.displayName = 'ColumnHeader';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * DataTable component with external pagination and DRF sorting
 * 
 * Features:
 * - Server-side pagination support
 * - Django DRF ordering format support
 * - Accepts both `columns` prop and JSX children
 * - Memoized rendering for performance
 * - TypeScript strict typing
 * 
 * @example
 * ```tsx
 * // Using columns prop
 * <DataTable
 *   data={users}
 *   columns={[
 *     { field: 'name', header: 'Nome', sortable: true },
 *     { field: 'email', header: 'Email' },
 *     { field: 'status', header: 'Status', body: (row) => <Badge value={row.status} /> }
 *   ]}
 *   pagination={pagination}
 *   sorting={sorting}
 * />
 * 
 * // Using children
 * <DataTable data={users} pagination={pagination} sorting={sorting}>
 *   <Column field="name" header="Nome" sortable />
 *   <Column field="email" header="Email" />
 *   <Column field="status" header="Status" body={(row) => <Badge value={row.status} />} />
 * </DataTable>
 * ```
 */

const PrimeDataTableAny = PrimeDataTable as unknown as React.ComponentType<any>;

function DataTableComponent<
  TData extends Record<string, any> = Record<string, any>
>({
  data,
  columns,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  pagination,
  pageSizeOptions = [10, 25, 50, 100],
  sorting,
  selection,
  onSelectionChange,
  selectionMode,
  dataKey = 'id',
  striped = true,
  gridLines = false,
  showHeader = true,
  className,
  size = 'normal',
  children,
  ...restProps
}: DataTableProps<TData>) {


  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSort = useCallback((field: string) => {
    sorting?.toggleSort(field);
  }, [sorting]);

  const handleSelectionChange = useCallback((e: { value: TData | TData[] }) => {
    onSelectionChange?.(e.value);
  }, [onSelectionChange]);

  // ============================================================================
  // PAGINATOR HANDLER
  // ============================================================================

  const handlePageChange = useCallback((e: PaginatorPageChangeEvent) => {
    if (!pagination) return;

    const newPage = Math.floor(e.first / e.rows) + 1;

    // Mudou o tamanho da página
    if (e.rows !== pagination.pageSize) {
      pagination.setPageSize(e.rows);
    }
    // Mudou a página
    else if (newPage !== pagination.page) {
      pagination.setPage(newPage);
    }
  }, [pagination]);

  // ============================================================================
  // RENDER COLUMNS
  // ============================================================================

  const renderColumns = useMemo(() => {
    // Se tem children, usa children
    if (children) {
      return Children.map(children, (child) => {
        if (!isValidElement(child)) return null;

        // Se é um Column do PrimeReact, intercepta para adicionar sort customizado
        const childProps = child.props as ColumnProps & { sortable?: boolean };
        const field = childProps.field;

        if (childProps.sortable && field && sorting) {
          return React.cloneElement(child as ReactElement<ColumnProps>, {
            ...childProps,
            sortable: false, // Desabilita sort nativo
            header: (
              <ColumnHeader
                header={typeof childProps.header === 'string' ? childProps.header : String(childProps.header)}
                field={field}
                sortable={true}
                sorting={sorting}
                onSort={handleSort}
              />
            )
          });
        }

        return child;
      });
    }

    // Se tem columns prop, renderiza baseado nelas
    if (columns) {
      return columns
        .filter(col => !col.hidden)
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
            body={col.body as ColumnProps['body']}
            style={{
              ...col.bodyStyle,
              width: col.width,
              textAlign: col.align
            }}
            headerStyle={{
              ...col.headerStyle,
              width: col.width,
              textAlign: col.align
            }}
            headerClassName={col.headerClassName}
            bodyClassName={col.bodyClassName}
            sortable={false} // Sort é controlado manualmente
          />
        ));
    }

    return null;
  }, [children, columns, sorting, handleSort]);

  // ============================================================================
  // SIZE CLASSES
  // ============================================================================

  const sizeClass = useMemo(() => {
    switch (size) {
      case 'small': return 'p-datatable-sm';
      case 'large': return 'p-datatable-lg';
      default: return '';
    }
  }, [size]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={classNames('datatable-container', className)}>
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
        className={classNames(
          'rounded-lg overflow-hidden',
          sizeClass
        )}
        {...restProps}
      >
        {renderColumns}
      </PrimeDataTableAny>

      {pagination && (
        <Paginator
          first={pagination.first}
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

// Memoize the component
export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;

// ============================================================================
// RE-EXPORTS
// ============================================================================

// export { Column } from 'primereact/column';
// export type { ColumnProps } from 'primereact/column';
