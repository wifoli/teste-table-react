import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterMap, FilterValue, TableUrlParams } from '../../types/table.types';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Serializa um valor de filtro para string (para URL)
 */
function serializeValue(value: FilterValue): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : null;
  }
  return String(value);
}

/**
 * Deserializa um valor da URL para o tipo correto
 */
function deserializeValue(value: string | null, isArray = false): FilterValue {
  if (value === null || value === '') {
    return isArray ? [] : undefined;
  }
  if (isArray) {
    return value.split(',').filter(Boolean);
  }
  // Tenta converter para número se for numérico
  const num = Number(value);
  if (!isNaN(num) && value === String(num)) {
    return num;
  }
  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  return value;
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseUrlStateOptions<TFilters extends FilterMap = FilterMap> {
  /** Prefixo para parâmetros na URL */
  prefix?: string;
  /** Campos que são arrays */
  arrayFields?: (keyof TFilters)[];
  /** Valores padrão */
  defaults?: {
    page?: number;
    pageSize?: number;
    ordering?: string;
    filters?: Partial<TFilters>;
  };
}

export interface UseUrlStateReturn<TFilters extends FilterMap = FilterMap> {
  /** Obtém o estado atual da URL */
  getUrlState: () => TableUrlParams<TFilters>;
  /** Atualiza parâmetros na URL */
  setUrlState: (params: Partial<TableUrlParams<TFilters>>) => void;
  /** Remove parâmetros específicos */
  removeUrlParams: (keys: string[]) => void;
  /** Limpa todos os parâmetros de tabela */
  clearUrlState: () => void;
  /** SearchParams atual (para uso externo se necessário) */
  searchParams: URLSearchParams;
}

/**
 * Hook para gerenciar estado da tabela na URL
 * 
 * Responsabilidades:
 * - Sincronizar paginação, ordenação e filtros com query params
 * - Serializar/deserializar valores corretamente
 * - Suportar prefixo para evitar conflitos
 * 
 * @example
 * ```tsx
 * const { getUrlState, setUrlState } = useUrlState<UserFilters>({
 *   prefix: 'users_',
 *   arrayFields: ['status', 'roles']
 * });
 * ```
 */
export function useUrlState<TFilters extends FilterMap = FilterMap>(
  options: UseUrlStateOptions<TFilters> = {}
): UseUrlStateReturn<TFilters> {
  const { prefix = '', arrayFields = [], defaults } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Chaves reservadas (não são filtros)
  const reservedKeys = useMemo(() => [
    `${prefix}page`,
    `${prefix}page_size`,
    `${prefix}ordering`
  ], [prefix]);

  /**
   * Obtém o estado atual da URL
   */
  const getUrlState = useCallback((): TableUrlParams<TFilters> => {
    const pageParam = searchParams.get(`${prefix}page`);
    const pageSizeParam = searchParams.get(`${prefix}page_size`);
    const orderingParam = searchParams.get(`${prefix}ordering`);

    // Extrai filtros (todos os params que não são reservados e têm o prefixo)
    const filters: Partial<TFilters> = {} as Partial<TFilters>;
    
    searchParams.forEach((value, key) => {
      // Verifica se tem o prefixo correto
      if (prefix && !key.startsWith(prefix)) return;
      
      // Remove o prefixo para obter a chave real
      const realKey = prefix ? key.slice(prefix.length) : key;
      
      // Ignora chaves reservadas
      if (reservedKeys.includes(key)) return;
      
      // Deserializa o valor
      const isArray = (arrayFields as string[]).includes(realKey);
      (filters as Record<string, FilterValue>)[realKey] = deserializeValue(value, isArray);
    });

    return {
      page: pageParam ? Number(pageParam) : defaults?.page,
      pageSize: pageSizeParam ? Number(pageSizeParam) : defaults?.pageSize,
      ordering: orderingParam || defaults?.ordering,
      filters: Object.keys(filters).length > 0 ? filters : defaults?.filters
    };
  }, [searchParams, prefix, reservedKeys, arrayFields, defaults]);

  /**
   * Atualiza parâmetros na URL
   */
  const setUrlState = useCallback((params: Partial<TableUrlParams<TFilters>>) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      // Paginação
      if (params.page !== undefined) {
        if (params.page === 1 || params.page === defaults?.page) {
          newParams.delete(`${prefix}page`);
        } else {
          newParams.set(`${prefix}page`, String(params.page));
        }
      }

      if (params.pageSize !== undefined) {
        if (params.pageSize === defaults?.pageSize) {
          newParams.delete(`${prefix}page_size`);
        } else {
          newParams.set(`${prefix}page_size`, String(params.pageSize));
        }
      }

      // Ordenação
      if (params.ordering !== undefined) {
        if (!params.ordering || params.ordering === defaults?.ordering) {
          newParams.delete(`${prefix}ordering`);
        } else {
          newParams.set(`${prefix}ordering`, params.ordering);
        }
      }

      // Filtros
      if (params.filters !== undefined) {
        // Remove filtros antigos primeiro
        const keysToRemove: string[] = [];
        newParams.forEach((_, key) => {
          if (prefix && !key.startsWith(prefix)) return;
          if (reservedKeys.includes(key)) return;
          keysToRemove.push(key);
        });
        keysToRemove.forEach(key => newParams.delete(key));

        // Adiciona novos filtros
        Object.entries(params.filters).forEach(([key, value]) => {
          const serialized = serializeValue(value as FilterValue);
          if (serialized !== null) {
            newParams.set(`${prefix}${key}`, serialized);
          }
        });
      }

      return newParams;
    }, { replace: true });
  }, [setSearchParams, prefix, reservedKeys, defaults]);

  /**
   * Remove parâmetros específicos
   */
  const removeUrlParams = useCallback((keys: string[]) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      keys.forEach(key => newParams.delete(`${prefix}${key}`));
      return newParams;
    }, { replace: true });
  }, [setSearchParams, prefix]);

  /**
   * Limpa todos os parâmetros de tabela
   */
  const clearUrlState = useCallback(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      
      // Remove todos os params com o prefixo
      const keysToRemove: string[] = [];
      newParams.forEach((_, key) => {
        if (!prefix || key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      });
      keysToRemove.forEach(key => newParams.delete(key));
      
      return newParams;
    }, { replace: true });
  }, [setSearchParams, prefix]);

  return {
    getUrlState,
    setUrlState,
    removeUrlParams,
    clearUrlState,
    searchParams
  };
}
