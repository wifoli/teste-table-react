import { useCallback, useMemo, useState } from 'react';
import type { PaginationResult } from '@front-engine/ui';

// ============================================================================
// HOOK
// ============================================================================

export interface UsePaginationOptions {
  /** Página inicial */
  initialPage?: number;
  /** Tamanho inicial da página */
  initialPageSize?: number;
  /** Total de registros (para calcular total de páginas) */
  totalRecords?: number;
  /** Callback quando a página muda */
  onPageChange?: (page: number) => void;
  /** Callback quando o tamanho da página muda */
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Hook para gerenciar estado de paginação
 * 
 * Responsabilidades:
 * - Controlar página atual
 * - Controlar tamanho da página
 * - Calcular valores derivados (first, totalPages)
 * 
 * Este hook é agnóstico à URL - a sincronização com URL
 * deve ser feita pelo hook orquestrador.
 * 
 * @example
 * ```tsx
 * const pagination = usePagination({
 *   initialPage: 1,
 *   initialPageSize: 10,
 *   totalRecords: 100,
 *   onPageChange: (page) => refetch()
 * });
 * ```
 */
export function usePagination(options: UsePaginationOptions = {}): PaginationResult {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalRecords = 0,
    onPageChange,
    onPageSizeChange
  } = options;

  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  /**
   * Primeiro índice (0-indexed, compatível com PrimeReact)
   */
  const first = useMemo(() => (page - 1) * pageSize, [page, pageSize]);

  /**
   * Total de páginas
   */
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(totalRecords / pageSize)), 
    [totalRecords, pageSize]
  );

  /**
   * Define a página atual
   */
  const setPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPageState(validPage);
    onPageChange?.(validPage);
  }, [totalPages, onPageChange]);

  /**
   * Define o tamanho da página
   */
  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize);
    // Reset para página 1 quando muda o tamanho
    setPageState(1);
    onPageSizeChange?.(newSize);
    onPageChange?.(1);
  }, [onPageChange, onPageSizeChange]);

  /**
   * Reseta para a primeira página
   */
  const resetPage = useCallback(() => {
    setPageState(1);
    onPageChange?.(1);
  }, [onPageChange]);

  return {
    // Estado
    page,
    pageSize,
    first,
    totalPages,
    // Ações
    setPage,
    setPageSize,
    resetPage
  };
}

// ============================================================================
// VERSÃO CONTROLADA (para uso com URL state externo)
// ============================================================================

export interface UseControlledPaginationOptions {
  /** Página atual (controlada externamente) */
  page: number;
  /** Tamanho da página (controlado externamente) */
  pageSize: number;
  /** Total de registros */
  totalRecords: number;
  /** Callback quando a página muda */
  onPageChange: (page: number) => void;
  /** Callback quando o tamanho da página muda */
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Versão controlada do hook de paginação
 * Útil quando o estado vem de fora (ex: URL)
 */
export function useControlledPagination(
  options: UseControlledPaginationOptions
): PaginationResult {
  const { page, pageSize, totalRecords, onPageChange, onPageSizeChange } = options;

  const first = useMemo(() => (page - 1) * pageSize, [page, pageSize]);
  const totalPages = useMemo(() => 
    Math.max(1, Math.ceil(totalRecords / pageSize)), 
    [totalRecords, pageSize]
  );

  const setPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    onPageChange(validPage);
  }, [totalPages, onPageChange]);

  const setPageSize = useCallback((newSize: number) => {
    onPageSizeChange(newSize);
    // Também reseta para página 1
    onPageChange(1);
  }, [onPageChange, onPageSizeChange]);

  const resetPage = useCallback(() => {
    onPageChange(1);
  }, [onPageChange]);

  return {
    page,
    pageSize,
    first,
    totalPages,
    setPage,
    setPageSize,
    resetPage
  };
}
