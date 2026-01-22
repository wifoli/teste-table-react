import { TreeTable as PrimeTreeTable, TreeTableProps as PrimeTreeTableProps } from 'primereact/treetable';
import { Column, ColumnProps } from 'primereact/column';
import { TreeNode } from 'primereact/treenode';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { classNames } from 'primereact/utils';
import { ReactNode, useState } from 'react';

export interface TreeTableColumn extends Omit<ColumnProps, 'sortable'> {
  field: string;
  header: string;
  sortable?: boolean;
  body?: (node: TreeNode) => ReactNode;
  expander?: boolean;
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

export interface TreeTablePagination {
  page: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  rowsPerPageOptions?: number[];
}

export interface TreeTableSorting {
  ordering?: string;
  onSort: (field: string) => void;
  getSortOrder: (field: string) => 'asc' | 'desc' | null;
}

export interface TreeTableProps extends Omit<PrimeTreeTableProps, 'value'> {
  data: TreeNode[];
  columns: TreeTableColumn[];
  
  // Pagination (external)
  pagination?: TreeTablePagination;
  
  // Sorting
  sorting?: TreeTableSorting;
  
  // Loading state
  loading?: boolean;
  
  // Empty state
  emptyMessage?: string | ReactNode;
  
  // Selection
  selectionMode?: 'single' | 'multiple' | 'checkbox';
  selectionKeys?: any;
  onSelectionChange?: (e: { value: any }) => void;
  
  // Expansion
  expandedKeys?: any;
  onToggle?: (e: { value: any }) => void;
  
  // Style
  striped?: boolean;
  gridlines?: boolean;
  showHeader?: boolean;
  
  className?: string;
}

/**
 * TreeTable para dados hierárquicos
 */
export function TreeTable({
  data,
  columns,
  pagination,
  sorting,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado',
  selectionMode,
  selectionKeys,
  onSelectionChange,
  expandedKeys: controlledExpandedKeys,
  onToggle,
  striped = true,
  gridlines = false,
  showHeader = true,
  className,
  ...props
}: TreeTableProps) {
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<any>({});
  
  const expandedKeys = controlledExpandedKeys ?? internalExpandedKeys;
  const handleToggle = onToggle ?? ((e: { value: any }) => setInternalExpandedKeys(e.value));

  // Handle sort
  const handleSort = (field: string) => {
    if (sorting) {
      sorting.onSort(field);
    }
  };

  // Get sort icon
  const getSortIcon = (field: string): ReactNode => {
    if (!sorting) return null;
    
    const order = sorting.getSortOrder(field);
    
    if (order === 'asc') {
      return <i className="pi pi-sort-up ml-2 text-blue-600" />;
    } else if (order === 'desc') {
      return <i className="pi pi-sort-down ml-2 text-blue-600" />;
    }
    return <i className="pi pi-sort-alt ml-2 text-gray-400" />;
  };

  // Custom header template with sort
  const headerTemplate = (column: TreeTableColumn) => {
    return (
      <div 
        className={classNames(
          'flex items-center',
          { 'cursor-pointer select-none': column.sortable }
        )}
        onClick={() => column.sortable && handleSort(column.field)}
      >
        <span>{column.header}</span>
        {column.sortable && getSortIcon(column.field)}
      </div>
    );
  };

  return (
    <div className={classNames('treetable-wrapper', className)}>
      <PrimeTreeTable
        value={data}
        loading={loading}
        emptyMessage={emptyMessage}
        stripedRows={striped}
        showGridlines={gridlines}
        selectionMode={selectionMode}
        selectionKeys={selectionKeys}
        onSelectionChange={onSelectionChange}
        expandedKeys={expandedKeys}
        onToggle={handleToggle}
        className="border rounded-lg overflow-hidden"
        {...props}
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={headerTemplate(col)}
            body={col.body}
            expander={col.expander}
            sortable={false}
            style={col.bodyStyle}
            headerStyle={col.headerStyle}
          />
        ))}
      </PrimeTreeTable>

      {pagination && (
        <Paginator
          first={(pagination.page - 1) * pagination.pageSize}
          rows={pagination.pageSize}
          totalRecords={pagination.totalRecords}
          rowsPerPageOptions={pagination.rowsPerPageOptions || [10, 25, 50, 100]}
          onPageChange={(e: PaginatorPageChangeEvent) => {
            const newPage = Math.floor(e.first / e.rows) + 1;
            if (newPage !== pagination.page) {
              pagination.onPageChange(newPage);
            }
            if (e.rows !== pagination.pageSize) {
              pagination.onPageSizeChange(e.rows);
            }
          }}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          currentPageReportTemplate="{first} a {last} de {totalRecords} registros"
          className="mt-4"
        />
      )}
    </div>
  );
}