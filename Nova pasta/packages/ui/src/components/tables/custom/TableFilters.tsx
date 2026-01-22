import React, { memo, useCallback, FormEvent, ReactNode } from 'react';
import { classNames } from 'primereact/utils';
import type { FiltersResult, FilterMap } from './types';

import {
  FormLayout,
  FormActions,
} from '../../layouts/FormLayout';
import { ButtonGradient, GhostButton } from '../../buttons';
import { BroomIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

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
  layout?: 'horizontal' | 'vertical' | 'grid';
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
  filterLabel = 'Filtrar',
  clearLabel = 'Limpar',
  showClear = true,
  loading = false,
  className,
  layout = 'horizontal',
  columns = 4,
  onFilter,
  onClear,
}: TableFiltersProps<TFilters>) {

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    filters.applyFilters();
    onFilter?.();
  }, [filters, onFilter]);

  const handleClear = useCallback(() => {
    filters.clearAllFilters();
    onClear?.();
  }, [filters, onClear]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      filters.applyFilters();
      onFilter?.();
    }
  }, [filters, onFilter]);

  // ============================================================================
  // LAYOUT MAPPING
  // ============================================================================

  type FormLayoutColumns = 1 | 2 | 3 | 4 | 6 | 12;

  const layoutConfig: { columns: FormLayoutColumns } = (() => {
    if (layout === 'vertical') {
      return { columns: 12 };
    }

    if (layout === 'horizontal') {
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
        'table-filters bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4',
        className
      )}
    >
      {/* Conteúdo dos filtros */}
      <FormLayout
        columns={layoutConfig.columns}
        gap={4}
        responsive
      >
        {children}
      </FormLayout>

      {/* Ações */}
      <FormActions align="right">
        {filters.isDirty && (
          <span className="flex items-center text-sm text-amber-600 ml-2">
            <i className="pi pi-exclamation-circle mr-1" />
            Mudanças não aplicadas
          </span>
        )}

        {hasAppliedFilters(filters.applied) && (
          <span className="flex items-center text-sm text-gray-600 ml-2">
            <i className="pi pi-filter-fill text-primary-500 mr-1" />
            Filtros ativos
          </span>
        )}

        {showClear && (
          <GhostButton
            type="button"
            label={clearLabel}
            icon={<BroomIcon size={24} />}
            onClick={handleClear}
            disabled={!hasAppliedFilters(filters.applied) && !filters.isDirty}
            intent='danger'
            size='small'
            className='px-6 py-2'
          />
        )}

        <ButtonGradient
          type="submit"
          label={filterLabel}
          icon={<MagnifyingGlassIcon size={24} />}
          loading={loading}
          disabled={!filters.isDirty && !hasAppliedFilters(filters.applied)}
          intent='primary'
          size='small'
          className='px-6 py-2'
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
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    return true;
  });
}

// ============================================================================
// EXPORT
// ============================================================================

export const TableFilters = memo(TableFiltersComponent) as typeof TableFiltersComponent;
