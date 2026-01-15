import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FilterMap, FiltersResult } from '../../types/table.types';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Verifica se dois objetos de filtro são iguais
 */
function areFiltersEqual<T extends FilterMap>(a: T, b: T): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => {
    const valA = a[key];
    const valB = b[key];
    
    if (Array.isArray(valA) && Array.isArray(valB)) {
      return valA.length === valB.length && valA.every((v, i) => v === valB[i]);
    }
    
    return valA === valB;
  });
}

/**
 * Remove valores vazios de um objeto de filtros
 */
function cleanFilters<T extends FilterMap>(filters: T): Partial<T> {
  const cleaned: Partial<T> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (Array.isArray(value) && value.length === 0) return;
    
    (cleaned as FilterMap)[key] = value;
  });
  
  return cleaned;
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseFiltersOptions<TFilters extends FilterMap> {
  /** Filtros iniciais */
  initialFilters?: TFilters;
  /** Callback quando filtros são aplicados */
  onApply?: (filters: TFilters) => void;
  /** Callback quando filtros são limpos */
  onClear?: () => void;
}

/**
 * Hook para gerenciar filtros com separação draft/applied
 * 
 * PONTO CRÍTICO DE PERFORMANCE:
 * - Digitar nos inputs atualiza apenas o estado "draft"
 * - Nenhuma requisição ou atualização de URL acontece durante digitação
 * - Somente ao chamar `applyFilters()` os filtros são efetivamente aplicados
 * 
 * Isso garante:
 * - Zero delay ao digitar
 * - Zero re-renders desnecessários
 * - Comportamento previsível
 * 
 * @example
 * ```tsx
 * const filters = useFilters<UserFilters>({
 *   initialFilters: { status: 'active' },
 *   onApply: (applied) => refetch()
 * });
 * 
 * // Input controlado (sem delay)
 * <InputText 
 *   value={filters.draft.name ?? ''} 
 *   onChange={e => filters.setDraftValue('name', e.target.value)} 
 * />
 * 
 * // Botão de aplicar
 * <Button onClick={filters.applyFilters} disabled={!filters.isDirty}>
 *   Filtrar
 * </Button>
 * ```
 */
export function useFilters<TFilters extends FilterMap = FilterMap>(
  options: UseFiltersOptions<TFilters> = {}
): FiltersResult<TFilters> {
  const { 
    initialFilters = {} as TFilters, 
    onApply, 
    onClear 
  } = options;

  // Estado dos valores em draft (durante digitação)
  const [draft, setDraft] = useState<TFilters>(initialFilters);
  
  // Estado dos valores aplicados (após clicar em Filtrar)
  const [applied, setApplied] = useState<TFilters>(initialFilters);

  // Ref para evitar chamadas desnecessárias de callback
  const appliedRef = useRef(applied);
  appliedRef.current = applied;

  /**
   * Verifica se há mudanças não aplicadas
   */
  const isDirty = useMemo(() => {
    return !areFiltersEqual(draft, applied);
  }, [draft, applied]);

  /**
   * Atualiza um valor no draft
   * NÃO dispara requisição, NÃO atualiza URL
   */
  const setDraftValue = useCallback(<K extends keyof TFilters>(
    key: K, 
    value: TFilters[K]
  ) => {
    setDraft(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Atualiza múltiplos valores no draft
   * NÃO dispara requisição, NÃO atualiza URL
   */
  const setDraftValues = useCallback((values: Partial<TFilters>) => {
    setDraft(prev => ({
      ...prev,
      ...values
    }));
  }, []);

  /**
   * Aplica os filtros do draft
   * DISPARA requisição e atualiza URL
   */
  const applyFilters = useCallback(() => {
    const cleanedDraft = cleanFilters(draft) as TFilters;
    
    // Evita aplicar se não houver mudanças
    if (areFiltersEqual(cleanedDraft, appliedRef.current)) {
      return;
    }

    setApplied(cleanedDraft);
    onApply?.(cleanedDraft);
  }, [draft, onApply]);

  /**
   * Limpa um filtro específico (do draft e aplicado)
   */
  const clearFilter = useCallback(<K extends keyof TFilters>(key: K) => {
    setDraft(prev => {
      const newDraft = { ...prev };
      delete newDraft[key];
      return newDraft;
    });
    
    setApplied(prev => {
      const newApplied = { ...prev };
      delete newApplied[key];
      onApply?.(newApplied);
      return newApplied;
    });
  }, [onApply]);

  /**
   * Limpa todos os filtros
   */
  const clearAllFilters = useCallback(() => {
    const empty = {} as TFilters;
    setDraft(empty);
    setApplied(empty);
    onClear?.();
    onApply?.(empty);
  }, [onApply, onClear]);

  /**
   * Reseta draft para os valores aplicados
   * (descarta alterações não aplicadas)
   */
  const resetDraft = useCallback(() => {
    setDraft(applied);
  }, [applied]);

  return {
    draft,
    applied,
    isDirty,
    setDraftValue,
    setDraftValues,
    applyFilters,
    clearFilter,
    clearAllFilters,
    resetDraft
  };
}

// ============================================================================
// VERSÃO CONTROLADA
// ============================================================================

export interface UseControlledFiltersOptions<TFilters extends FilterMap> {
  /** Filtros aplicados (controlados externamente) */
  applied: TFilters;
  /** Callback quando filtros são aplicados */
  onApply: (filters: TFilters) => void;
}

/**
 * Versão controlada do hook de filtros
 * O estado "applied" vem de fora (ex: URL), mas "draft" é gerenciado internamente
 * 
 * IMPORTANTE: No refresh da página, o draft é automaticamente sincronizado
 * com os valores da URL através do applied.
 */
export function useControlledFilters<TFilters extends FilterMap = FilterMap>(
  options: UseControlledFiltersOptions<TFilters>
): FiltersResult<TFilters> {
  const { applied, onApply } = options;

  // Draft é gerenciado internamente, inicializado com applied
  // Isso garante que no primeiro render (refresh), o draft já tenha os valores da URL
  const [draft, setDraft] = useState<TFilters>(() => ({ ...applied }));
  
  // Flag para controlar se é o primeiro render
  const isFirstRender = useRef(true);
  
  // Ref para comparar mudanças no applied
  const prevAppliedRef = useRef<TFilters>(applied);

  // Sincroniza draft quando applied muda externamente (ex: navegação, reset)
  // Mas NÃO no primeiro render (já inicializamos com applied)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Só sincroniza se applied realmente mudou
    if (!areFiltersEqual(prevAppliedRef.current, applied)) {
      prevAppliedRef.current = applied;
      setDraft({ ...applied });
    }
  }, [applied]);

  const isDirty = useMemo(() => {
    return !areFiltersEqual(draft, applied);
  }, [draft, applied]);

  const setDraftValue = useCallback(<K extends keyof TFilters>(
    key: K, 
    value: TFilters[K]
  ) => {
    setDraft(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const setDraftValues = useCallback((values: Partial<TFilters>) => {
    setDraft(prev => ({
      ...prev,
      ...values
    }));
  }, []);

  const applyFilters = useCallback(() => {
    const cleanedDraft = cleanFilters(draft) as TFilters;
    onApply(cleanedDraft);
  }, [draft, onApply]);

  const clearFilter = useCallback(<K extends keyof TFilters>(key: K) => {
    const newDraft = { ...draft };
    delete newDraft[key];
    setDraft(newDraft);
    
    const newApplied = { ...applied };
    delete newApplied[key];
    onApply(newApplied);
  }, [draft, applied, onApply]);

  const clearAllFilters = useCallback(() => {
    const empty = {} as TFilters;
    setDraft(empty);
    onApply(empty);
  }, [onApply]);

  const resetDraft = useCallback(() => {
    setDraft({ ...applied });
  }, [applied]);

  return {
    draft,
    applied,
    isDirty,
    setDraftValue,
    setDraftValues,
    applyFilters,
    clearFilter,
    clearAllFilters,
    resetDraft
  };
}
