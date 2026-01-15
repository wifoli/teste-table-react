/**
 * Sistema de hooks para tabelas com paginação server-side
 * 
 * @module hooks/table
 * 
 * Arquitetura:
 * - useTableQuery: Hook principal (orquestrador)
 * - usePagination: Controle de paginação
 * - useSorting: Controle de ordenação (padrão DRF)
 * - useFilters: Controle de filtros (draft/applied)
 * - useUrlState: Sincronização com URL
 * 
 * @example
 * ```tsx
 * // Uso básico
 * const { data, pagination, sorting, filters } = useTableQuery({
 *   fetchFn: fetchUsers,
 *   initialPageSize: 10
 * });
 * 
 * // Na view
 * <DataTable 
 *   data={data} 
 *   pagination={pagination}
 *   sorting={sorting}
 * />
 * ```
 */

// Hook principal
export { useTableQuery } from './useTableQuery';
export type {
  UseTableQueryConfig,
  UseTableQueryResult,
  TableQueryParams,
  FilterMap,
  PaginatedResponse,
  SimplePaginatedResponse
} from './useTableQuery';

// Sub-hooks (para uso avançado)
export { usePagination, useControlledPagination } from './usePagination';
export type { UsePaginationOptions, UseControlledPaginationOptions } from './usePagination';

export { useSorting, useControlledSorting, parseOrdering, formatOrdering } from './useSorting';
export type { UseSortingOptions, UseControlledSortingOptions } from './useSorting';

export { useFilters, useControlledFilters } from './useFilters';
export type { UseFiltersOptions, UseControlledFiltersOptions } from './useFilters';

export { useUrlState } from './useUrlState';
export type { UseUrlStateOptions, UseUrlStateReturn } from './useUrlState';

// Types
export type {
  PaginationState,
  PaginationActions,
  PaginationResult,
  SortDirection,
  SortItem,
  SortingState,
  SortingActions,
  SortingResult,
  FilterValue,
  FiltersState,
  FiltersActions,
  FiltersResult,
  TableUrlParams,
  UrlStateActions,
  TableColumn,
  DataTableProps
} from '../../types/table.types';
