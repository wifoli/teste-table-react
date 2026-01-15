import React, { memo, useCallback, FormEvent, ReactNode } from 'react';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import type { FiltersResult, FilterMap } from '@prime-repo/shared';

// ============================================================================
// TYPES
// ============================================================================

export interface TableFiltersProps<TFilters extends FilterMap = FilterMap> {
  /** Resultado do hook useFilters/useControlledFilters */
  filters: FiltersResult<TFilters>;
  
  /** Conteúdo dos filtros (inputs) */
  children: ReactNode;
  
  /** Texto do botão de filtrar */
  filterLabel?: string;
  
  /** Texto do botão de limpar */
  clearLabel?: string;
  
  /** Mostrar botão de limpar */
  showClear?: boolean;
  
  /** Estado de carregamento */
  loading?: boolean;
  
  /** Classe CSS adicional */
  className?: string;
  
  /** Layout dos filtros */
  layout?: 'horizontal' | 'vertical' | 'grid';
  
  /** Colunas do grid (quando layout='grid') */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  
  /** Callback após aplicar filtros */
  onFilter?: () => void;
  
  /** Callback após limpar filtros */
  onClear?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Container para filtros de tabela
 * 
 * Features:
 * - Integração com useFilters hook
 * - Previne submit durante digitação
 * - Botões de Filtrar e Limpar
 * - Layouts flexíveis
 * 
 * @example
 * ```tsx
 * <TableFilters filters={filters} layout="grid" columns={3}>
 *   <div>
 *     <label>Nome</label>
 *     <InputText
 *       value={filters.draft.name ?? ''}
 *       onChange={e => filters.setDraftValue('name', e.target.value)}
 *     />
 *   </div>
 *   <div>
 *     <label>Status</label>
 *     <Dropdown
 *       value={filters.draft.status}
 *       options={statusOptions}
 *       onChange={e => filters.setDraftValue('status', e.value)}
 *     />
 *   </div>
 * </TableFilters>
 * ```
 */
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
  onClear
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
    // Enter aplica os filtros
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      filters.applyFilters();
      onFilter?.();
    }
  }, [filters, onFilter]);

  // ============================================================================
  // LAYOUT CLASSES
  // ============================================================================
  
  const contentClasses = classNames({
    'flex flex-wrap gap-4 items-end': layout === 'horizontal',
    'flex flex-col gap-4': layout === 'vertical',
    [`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`]: layout === 'grid'
  });

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
      <div className={contentClasses}>
        {children}
      </div>

      {/* Botões */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          label={filterLabel}
          icon="pi pi-search"
          loading={loading}
          disabled={!filters.isDirty && !hasAppliedFilters(filters.applied)}
          className="p-button-primary"
        />
        
        {showClear && (
          <Button
            type="button"
            label={clearLabel}
            icon="pi pi-times"
            onClick={handleClear}
            disabled={!hasAppliedFilters(filters.applied) && !filters.isDirty}
            className="p-button-secondary p-button-outlined"
          />
        )}

        {/* Indicador de filtros ativos */}
        {hasAppliedFilters(filters.applied) && (
          <span className="flex items-center text-sm text-gray-600 ml-2">
            <i className="pi pi-filter-fill text-primary-500 mr-1" />
            Filtros ativos
          </span>
        )}

        {/* Indicador de mudanças não salvas */}
        {filters.isDirty && (
          <span className="flex items-center text-sm text-amber-600 ml-2">
            <i className="pi pi-exclamation-circle mr-1" />
            Mudanças não aplicadas
          </span>
        )}
      </div>
    </form>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function hasAppliedFilters(applied: FilterMap): boolean {
  return Object.keys(applied).some(key => {
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

// ============================================================================
// FILTER FIELD COMPONENT
// ============================================================================

export interface FilterFieldProps {
  /** Label do campo */
  label: string;
  /** Conteúdo do campo (input) */
  children: ReactNode;
  /** Campo é obrigatório */
  required?: boolean;
  /** Texto de ajuda */
  helpText?: string;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Wrapper para campos de filtro individuais
 * 
 * @example
 * ```tsx
 * <FilterField label="Nome" helpText="Digite para buscar">
 *   <InputText
 *     value={filters.draft.name ?? ''}
 *     onChange={e => filters.setDraftValue('name', e.target.value)}
 *   />
 * </FilterField>
 * ```
 */
export const FilterField = memo<FilterFieldProps>(({
  label,
  children,
  required = false,
  helpText,
  className
}) => (
  <div className={classNames('filter-field flex flex-col gap-1', className)}>
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {helpText && (
      <small className="text-gray-500 text-xs">{helpText}</small>
    )}
  </div>
));

FilterField.displayName = 'FilterField';
