import { useCallback, useMemo, useState } from 'react';
import type { SortDirection, SortItem, SortingResult } from '../../types/table.types';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Converte uma string de ordenação DRF para array de SortItem
 * Ex: "name,-created_at" => [{ field: 'name', direction: 'asc' }, { field: 'created_at', direction: 'desc' }]
 */
export function parseOrdering(ordering: string | undefined | null): SortItem[] {
  if (!ordering) return [];
  
  return ordering
    .split(',')
    .filter(Boolean)
    .map(item => {
      const trimmed = item.trim();
      if (trimmed.startsWith('-')) {
        return { field: trimmed.slice(1), direction: 'desc' as SortDirection };
      }
      return { field: trimmed, direction: 'asc' as SortDirection };
    });
}

/**
 * Converte um array de SortItem para string de ordenação DRF
 * Ex: [{ field: 'name', direction: 'asc' }, { field: 'created_at', direction: 'desc' }] => "name,-created_at"
 */
export function formatOrdering(items: SortItem[]): string {
  return items
    .map(item => item.direction === 'desc' ? `-${item.field}` : item.field)
    .join(',');
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseSortingOptions {
  /** Ordenação inicial no formato DRF */
  initialOrdering?: string;
  /** Permite múltiplas colunas de ordenação */
  multiSort?: boolean;
  /** Callback quando a ordenação muda */
  onSortChange?: (ordering: string) => void;
}

/**
 * Hook para gerenciar estado de ordenação no padrão Django DRF
 * 
 * Responsabilidades:
 * - Controlar ordenação com suporte a múltiplas colunas
 * - Serializar/deserializar no formato DRF (ex: "name,-created_at")
 * - Ciclar entre asc -> desc -> null
 * 
 * @example
 * ```tsx
 * const sorting = useSorting({
 *   initialOrdering: 'name',
 *   multiSort: true,
 *   onSortChange: (ordering) => refetch()
 * });
 * 
 * // Na coluna
 * <Column header="Nome" sortable onClick={() => sorting.toggleSort('name')} />
 * ```
 */
export function useSorting(options: UseSortingOptions = {}): SortingResult {
  const { initialOrdering = '', multiSort = false, onSortChange } = options;

  const [sortItems, setSortItems] = useState<SortItem[]>(() => 
    parseOrdering(initialOrdering)
  );

  /**
   * String de ordenação no formato DRF
   */
  const ordering = useMemo(() => formatOrdering(sortItems), [sortItems]);

  /**
   * Obtém a direção de ordenação de um campo
   */
  const getSortDirection = useCallback((field: string): SortDirection | null => {
    const item = sortItems.find(s => s.field === field);
    return item?.direction ?? null;
  }, [sortItems]);

  /**
   * Obtém o índice de ordenação de um campo (para indicar ordem em multi-sort)
   */
  const getSortIndex = useCallback((field: string): number => {
    return sortItems.findIndex(s => s.field === field);
  }, [sortItems]);

  /**
   * Toggle de ordenação: asc -> desc -> null -> asc
   */
  const toggleSort = useCallback((field: string) => {
    setSortItems(prev => {
      const existingIndex = prev.findIndex(s => s.field === field);
      let newItems: SortItem[];

      if (existingIndex === -1) {
        // Campo não está ordenado - adiciona como asc
        if (multiSort) {
          newItems = [...prev, { field, direction: 'asc' }];
        } else {
          newItems = [{ field, direction: 'asc' }];
        }
      } else {
        const existing = prev[existingIndex];
        
        if (existing.direction === 'asc') {
          // asc -> desc
          newItems = [...prev];
          newItems[existingIndex] = { field, direction: 'desc' };
        } else {
          // desc -> remove
          newItems = prev.filter((_, i) => i !== existingIndex);
        }
      }

      const newOrdering = formatOrdering(newItems);
      onSortChange?.(newOrdering);
      
      return newItems;
    });
  }, [multiSort, onSortChange]);

  /**
   * Define ordenação específica para um campo
   */
  const setSort = useCallback((field: string, direction: SortDirection | null) => {
    setSortItems(prev => {
      let newItems: SortItem[];

      if (direction === null) {
        // Remove ordenação do campo
        newItems = prev.filter(s => s.field !== field);
      } else {
        const existingIndex = prev.findIndex(s => s.field === field);
        
        if (existingIndex === -1) {
          // Adiciona nova ordenação
          if (multiSort) {
            newItems = [...prev, { field, direction }];
          } else {
            newItems = [{ field, direction }];
          }
        } else {
          // Atualiza ordenação existente
          newItems = [...prev];
          newItems[existingIndex] = { field, direction };
        }
      }

      const newOrdering = formatOrdering(newItems);
      onSortChange?.(newOrdering);
      
      return newItems;
    });
  }, [multiSort, onSortChange]);

  /**
   * Limpa todas as ordenações
   */
  const clearSort = useCallback(() => {
    setSortItems([]);
    onSortChange?.('');
  }, [onSortChange]);

  return {
    sortItems,
    ordering,
    toggleSort,
    setSort,
    clearSort,
    getSortDirection,
    getSortIndex
  };
}

// ============================================================================
// VERSÃO CONTROLADA
// ============================================================================

export interface UseControlledSortingOptions {
  /** Ordenação atual no formato DRF (controlada externamente) */
  ordering: string;
  /** Permite múltiplas colunas */
  multiSort?: boolean;
  /** Callback quando a ordenação muda */
  onOrderingChange: (ordering: string) => void;
}

/**
 * Versão controlada do hook de ordenação
 * Útil quando o estado vem de fora (ex: URL)
 */
export function useControlledSorting(
  options: UseControlledSortingOptions
): SortingResult {
  const { ordering, multiSort = false, onOrderingChange } = options;

  const sortItems = useMemo(() => parseOrdering(ordering), [ordering]);

  const getSortDirection = useCallback((field: string): SortDirection | null => {
    const item = sortItems.find(s => s.field === field);
    return item?.direction ?? null;
  }, [sortItems]);

  const getSortIndex = useCallback((field: string): number => {
    return sortItems.findIndex(s => s.field === field);
  }, [sortItems]);

  const toggleSort = useCallback((field: string) => {
    const existingIndex = sortItems.findIndex(s => s.field === field);
    let newItems: SortItem[];

    if (existingIndex === -1) {
      if (multiSort) {
        newItems = [...sortItems, { field, direction: 'asc' }];
      } else {
        newItems = [{ field, direction: 'asc' }];
      }
    } else {
      const existing = sortItems[existingIndex];
      
      if (existing.direction === 'asc') {
        newItems = [...sortItems];
        newItems[existingIndex] = { field, direction: 'desc' };
      } else {
        newItems = sortItems.filter((_, i) => i !== existingIndex);
      }
    }

    onOrderingChange(formatOrdering(newItems));
  }, [sortItems, multiSort, onOrderingChange]);

  const setSort = useCallback((field: string, direction: SortDirection | null) => {
    let newItems: SortItem[];

    if (direction === null) {
      newItems = sortItems.filter(s => s.field !== field);
    } else {
      const existingIndex = sortItems.findIndex(s => s.field === field);
      
      if (existingIndex === -1) {
        if (multiSort) {
          newItems = [...sortItems, { field, direction }];
        } else {
          newItems = [{ field, direction }];
        }
      } else {
        newItems = [...sortItems];
        newItems[existingIndex] = { field, direction };
      }
    }

    onOrderingChange(formatOrdering(newItems));
  }, [sortItems, multiSort, onOrderingChange]);

  const clearSort = useCallback(() => {
    onOrderingChange('');
  }, [onOrderingChange]);

  return {
    sortItems,
    ordering,
    toggleSort,
    setSort,
    clearSort,
    getSortDirection,
    getSortIndex
  };
}
