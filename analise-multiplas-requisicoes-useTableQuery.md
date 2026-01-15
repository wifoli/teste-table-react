# Análise e Correção: Múltiplas Requisições no useTableQuery

## Sumário Executivo

O hook `useTableQuery` está disparando múltiplas requisições ao renderizar devido a **instabilidade de referências** em objetos passados como dependências. O problema principal está na criação inline do objeto `defaults` e na cascata de recriações de callbacks que isso provoca.

---

## Diagnóstico Detalhado

### 1. Causa Raiz Principal: Objeto `defaults` Instável

**Localização:** `useTableQuery.ts`, linhas ~95-103

```typescript
// ❌ PROBLEMA: Objeto criado inline a cada render
const { getUrlState, setUrlState } = useUrlState<TFilters>({
  prefix: urlPrefix,
  arrayFields: resolvedArrayFields,
  defaults: {
    page: 1,
    pageSize: initialPageSize,
    ordering: initialOrdering,
    filters: initialFilters  // ← Pode ter referência instável também
  }
});
```

**Por que isso é problemático:**

A cada render do componente que usa `useTableQuery`:
1. Um **novo objeto** `defaults` é criado (nova referência em memória)
2. `useUrlState` recebe esse novo objeto
3. Dentro de `useUrlState`, os callbacks `getUrlState` e `setUrlState` dependem de `defaults`
4. Como `defaults` mudou de referência, os callbacks são **recriados**
5. Isso dispara uma cascata de recriações em toda a cadeia de dependências

### 2. Cascata de Dependências Instáveis

```
defaults (novo a cada render)
    ↓
getUrlState / setUrlState (recriados)
    ↓
handlePageChange / handleFiltersApply / etc. (recriados)
    ↓
useControlledPagination / useControlledFilters (recebem novas props)
    ↓
Possíveis re-renders e side effects
    ↓
queryParams pode ser recalculado
    ↓
fetchData é recriado
    ↓
useEffect([fetchData]) dispara novamente
    ↓
NOVA REQUISIÇÃO
```

### 3. Problema Secundário: `initialFilters` Potencialmente Instável

Se o componente consumidor passar `initialFilters` como objeto inline:

```typescript
// ❌ No componente consumidor
const tableQuery = useTableQuery({
  fetchFn: fetchUsers,
  initialFilters: { status: 'active' }  // ← Novo objeto a cada render!
});
```

Isso agrava o problema, pois `initialFilters` é usado em várias dependências.

### 4. Análise do Fluxo de Requisições

**Render 1:**
```
1. Componente monta
2. useTableQuery inicializa estados
3. queryParams calculado
4. fetchData criado
5. useEffect dispara → REQUISIÇÃO #1
```

**Render 2 (causado por qualquer mudança no pai):**
```
1. defaults = novo objeto (referência diferente)
2. setUrlState recriado
3. handleFiltersApply recriado
4. Se algum estado dependente mudar... → REQUISIÇÃO #2
```

**Possível Render 3:**
```
1. React pode fazer batching de estados
2. Múltiplos setState podem causar renders intermediários
3. Cada render pode recriar callbacks → REQUISIÇÃO #3, #4...
```

---

## Soluções Detalhadas

### Correção 1: Estabilizar `defaults` no `useTableQuery`

**Arquivo:** `useTableQuery.ts`

```typescript
// ============================================================================
// URL STATE - CORREÇÃO
// ============================================================================

// ✅ ANTES de chamar useUrlState, estabilizar o objeto defaults
const urlStateDefaults = useMemo(() => ({
  page: 1,
  pageSize: initialPageSize,
  ordering: initialOrdering,
  filters: initialFilters
}), [initialPageSize, initialOrdering, initialFilters]);

const { getUrlState, setUrlState } = useUrlState<TFilters>({
  prefix: urlPrefix,
  arrayFields: resolvedArrayFields,
  defaults: urlStateDefaults  // ✅ Referência estável
});
```

### Correção 2: Estabilizar `initialFilters` Recebido

**Arquivo:** `useTableQuery.ts`

```typescript
export function useTableQuery<TData, TFilters extends FilterMap = FilterMap>(
  config: UseTableQueryConfig<TData, TFilters>
): UseTableQueryResult<TData, TFilters> {
  const {
    fetchFn,
    initialPageSize = 10,
    initialOrdering = '',
    initialFilters: initialFiltersInput = {} as TFilters,  // ← Renomear
    // ...
  } = config;

  // ✅ Estabilizar initialFilters com useRef para manter referência inicial
  const initialFiltersRef = useRef(initialFiltersInput);
  const initialFilters = initialFiltersRef.current;
  
  // OU usar useMemo se precisar reagir a mudanças (menos comum)
  // const initialFilters = useMemo(() => initialFiltersInput, []);
```

### Correção 3: Proteger o `useEffect` do Fetch

**Arquivo:** `useTableQuery.ts`

Adicionar uma flag para evitar fetch duplicado durante a inicialização:

```typescript
// ============================================================================
// FETCH DE DADOS - CORREÇÃO
// ============================================================================

// Ref para controle de requisições
const abortControllerRef = useRef<AbortController | null>(null);
const fetchIdRef = useRef(0);
const isInitialMountRef = useRef(true);  // ✅ NOVO

// Ref para armazenar queryParams anterior e comparar
const prevQueryParamsRef = useRef<string>('');

const fetchData = useCallback(async () => {
  // ✅ Serializar queryParams para comparação
  const queryParamsString = JSON.stringify(queryParams);
  
  // ✅ Evitar fetch se queryParams não mudou de verdade
  if (queryParamsString === prevQueryParamsRef.current) {
    return;
  }
  prevQueryParamsRef.current = queryParamsString;

  // Cancela requisição anterior se existir
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  // ... resto do código
}, [fetchFn, queryParams, onError]);

// ✅ useEffect com proteção adicional
useEffect(() => {
  // Opcional: pequeno debounce para evitar requisições em rajada
  const timeoutId = setTimeout(() => {
    fetchData();
  }, 0);  // microtask, agrupa mudanças síncronas
  
  return () => {
    clearTimeout(timeoutId);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, [fetchData]);
```

### Correção 4: Estabilizar Dependências no `useUrlState`

**Arquivo:** `useUrlState.ts`

```typescript
export function useUrlState<TFilters extends FilterMap = FilterMap>(
  options: UseUrlStateOptions<TFilters> = {}
): UseUrlStateReturn<TFilters> {
  const { prefix = '', arrayFields = [], defaults } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Estabilizar defaults internamente também
  const stableDefaults = useRef(defaults);
  
  // Atualizar ref apenas se valores realmente mudaram
  useEffect(() => {
    if (JSON.stringify(stableDefaults.current) !== JSON.stringify(defaults)) {
      stableDefaults.current = defaults;
    }
  }, [defaults]);

  // ✅ Usar a ref estável nas dependências
  const getUrlState = useCallback((): TableUrlParams<TFilters> => {
    const currentDefaults = stableDefaults.current;
    // ... usar currentDefaults em vez de defaults
  }, [searchParams, prefix, reservedKeys, arrayFields]);  // ← Remover defaults

  const setUrlState = useCallback((params: Partial<TableUrlParams<TFilters>>) => {
    const currentDefaults = stableDefaults.current;
    // ... usar currentDefaults em vez de defaults
  }, [setSearchParams, prefix, reservedKeys]);  // ← Remover defaults
```

### Correção 5: Revisar `useControlledFilters`

**Arquivo:** `useFilters.ts`

O `useEffect` de sincronização pode causar renders extras:

```typescript
export function useControlledFilters<TFilters extends FilterMap = FilterMap>(
  options: UseControlledFiltersOptions<TFilters>
): FiltersResult<TFilters> {
  const { applied, onApply } = options;

  // ✅ Usar função inicializadora que compara valores, não referências
  const [draft, setDraft] = useState<TFilters>(() => ({ ...applied }));
  
  const isFirstRender = useRef(true);
  
  // ✅ Usar ref para comparação de valores serializados
  const prevAppliedStringRef = useRef<string>(JSON.stringify(applied));

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // ✅ Comparar string serializada em vez de usar areFiltersEqual
    // Isso é mais robusto para objetos aninhados
    const appliedString = JSON.stringify(applied);
    if (prevAppliedStringRef.current !== appliedString) {
      prevAppliedStringRef.current = appliedString;
      setDraft({ ...applied });
    }
  }, [applied]);

  // ... resto do código
```

---

## Código Corrigido Completo: `useTableQuery.ts`

```typescript
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  FilterMap,
  FilterValue,
  PaginatedResponse,
  SimplePaginatedResponse,
  TableQueryParams,
  UseTableQueryConfig,
  UseTableQueryResult
} from '../../types/table.types';
import { useUrlState } from './useUrlState';
import { useControlledPagination } from './usePagination';
import { useControlledSorting } from './useSorting';
import { useControlledFilters } from './useFilters';

// ============================================================================
// HELPERS
// ============================================================================

function normalizeResponse<TData>(
  response: PaginatedResponse<TData> | SimplePaginatedResponse<TData>
): { data: TData[]; total: number } {
  if ('results' in response) {
    return { data: response.results, total: response.count };
  }
  return { data: response.data, total: response.total };
}

function filtersToQueryParams<TFilters extends FilterMap>(
  filters: Partial<TFilters>
): Record<string, FilterValue> {
  const params: Record<string, FilterValue> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (Array.isArray(value) && value.length === 0) return;
    
    if (Array.isArray(value)) {
      params[key] = value.join(',');
    } else {
      params[key] = value;
    }
  });
  
  return params;
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useTableQuery<TData, TFilters extends FilterMap = FilterMap>(
  config: UseTableQueryConfig<TData, TFilters>
): UseTableQueryResult<TData, TFilters> {
  const {
    fetchFn,
    initialPageSize = 10,
    initialOrdering = '',
    initialFilters: initialFiltersInput = {} as TFilters,
    pageSizeOptions = [10, 25, 50, 100],
    onError,
    syncWithUrl = true,
    urlPrefix = '',
    arrayFields = []
  } = config;

  // ============================================================================
  // ESTABILIZAÇÃO DE VALORES INICIAIS
  // ============================================================================
  
  // ✅ FIX 1: Estabilizar initialFilters com useRef
  // Isso garante que mudanças acidentais de referência não causem re-renders
  const initialFiltersRef = useRef(initialFiltersInput);
  const initialFilters = initialFiltersRef.current;

  // ✅ FIX 2: Estabilizar fetchFn para evitar recriações desnecessárias
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  // ============================================================================
  // URL STATE
  // ============================================================================
  
  const resolvedArrayFields = useMemo(() => {
    if (arrayFields.length > 0) {
      return arrayFields;
    }
    return Object.keys(initialFilters).filter(key => 
      Array.isArray((initialFilters as FilterMap)[key])
    ) as (keyof TFilters)[];
  }, [arrayFields, initialFilters]);

  // ✅ FIX 3: Estabilizar o objeto defaults com useMemo
  const urlStateDefaults = useMemo(() => ({
    page: 1,
    pageSize: initialPageSize,
    ordering: initialOrdering,
    filters: initialFilters
  }), [initialPageSize, initialOrdering, initialFilters]);

  const { getUrlState, setUrlState } = useUrlState<TFilters>({
    prefix: urlPrefix,
    arrayFields: resolvedArrayFields,
    defaults: urlStateDefaults
  });

  // Estado inicial baseado na URL (se syncWithUrl) ou defaults
  const initialState = useMemo(() => {
    if (syncWithUrl) {
      const urlState = getUrlState();
      
      const mergedFilters = {
        ...initialFilters,
        ...(urlState.filters || {})
      } as TFilters;

      return {
        page: urlState.page ?? 1,
        pageSize: urlState.pageSize ?? initialPageSize,
        ordering: urlState.ordering ?? initialOrdering,
        filters: mergedFilters
      };
    }
    return {
      page: 1,
      pageSize: initialPageSize,
      ordering: initialOrdering,
      filters: initialFilters
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================
  
  const [page, setPageState] = useState(initialState.page);
  const [pageSize, setPageSizeState] = useState(initialState.pageSize);
  const [ordering, setOrderingState] = useState(initialState.ordering);
  const [appliedFilters, setAppliedFiltersState] = useState<TFilters>(initialState.filters);
  
  const [data, setData] = useState<TData[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Refs para controle de requisições
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchIdRef = useRef(0);
  
  // ✅ FIX 4: Ref para evitar requisições duplicadas
  const lastQueryParamsStringRef = useRef<string>('');

  // ============================================================================
  // HANDLERS COM URL SYNC
  // ============================================================================
  
  const handlePageChange = useCallback((newPage: number) => {
    setPageState(newPage);
    if (syncWithUrl) {
      setUrlState({ page: newPage });
    }
  }, [syncWithUrl, setUrlState]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize);
    setPageState(1);
    if (syncWithUrl) {
      setUrlState({ page: 1, pageSize: newPageSize });
    }
  }, [syncWithUrl, setUrlState]);

  const handleOrderingChange = useCallback((newOrdering: string) => {
    setOrderingState(newOrdering);
    setPageState(1);
    if (syncWithUrl) {
      setUrlState({ page: 1, ordering: newOrdering });
    }
  }, [syncWithUrl, setUrlState]);

  const handleFiltersApply = useCallback((newFilters: TFilters) => {
    setAppliedFiltersState(newFilters);
    setPageState(1);
    if (syncWithUrl) {
      setUrlState({ page: 1, filters: newFilters });
    }
  }, [syncWithUrl, setUrlState]);

  // ============================================================================
  // SUB-HOOKS CONTROLADOS
  // ============================================================================
  
  const pagination = useControlledPagination({
    page,
    pageSize,
    totalRecords,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange
  });

  const sorting = useControlledSorting({
    ordering,
    multiSort: false,
    onOrderingChange: handleOrderingChange
  });

  const filters = useControlledFilters<TFilters>({
    applied: appliedFilters,
    onApply: handleFiltersApply
  });

  // ============================================================================
  // QUERY PARAMS
  // ============================================================================
  
  const queryParams = useMemo<TableQueryParams<TFilters>>(() => {
    const params: TableQueryParams<TFilters> = {
      page,
      page_size: pageSize
    };

    if (ordering) {
      params.ordering = ordering;
    }

    const filterParams = filtersToQueryParams(appliedFilters);
    Object.assign(params, filterParams);

    return params;
  }, [page, pageSize, ordering, appliedFilters]);

  // ============================================================================
  // FETCH DE DADOS
  // ============================================================================
  
  const fetchData = useCallback(async () => {
    // ✅ FIX 5: Verificar se queryParams realmente mudou
    const queryParamsString = JSON.stringify(queryParams);
    if (queryParamsString === lastQueryParamsStringRef.current) {
      console.debug('[useTableQuery] Fetch ignorado - queryParams não mudou');
      return;
    }
    lastQueryParamsStringRef.current = queryParamsString;

    // Cancela requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const fetchId = ++fetchIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      // ✅ FIX 6: Usar ref para fetchFn para evitar dependência instável
      const response = await fetchFnRef.current(queryParams);
      
      if (fetchId !== fetchIdRef.current) return;

      const normalized = normalizeResponse(response);
      setData(normalized.data);
      setTotalRecords(normalized.total);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      if (fetchId !== fetchIdRef.current) return;

      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      setData([]);
      setTotalRecords(0);
      onError?.(error);
      
      console.error('[useTableQuery] Erro ao buscar dados:', error);
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [queryParams, onError]);  // ✅ Removido fetchFn das dependências

  // ✅ FIX 7: useEffect com cleanup adequado
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // ============================================================================
  // AÇÕES GLOBAIS
  // ============================================================================
  
  const refetch = useCallback(() => {
    // ✅ FIX 8: Forçar refetch limpando o cache
    lastQueryParamsStringRef.current = '';
    fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setPageState(1);
    setPageSizeState(initialPageSize);
    setOrderingState(initialOrdering);
    setAppliedFiltersState(initialFilters);
    
    if (syncWithUrl) {
      setUrlState({
        page: 1,
        pageSize: initialPageSize,
        ordering: initialOrdering,
        filters: initialFilters
      });
    }
  }, [initialPageSize, initialOrdering, initialFilters, syncWithUrl, setUrlState]);

  // ============================================================================
  // RETORNO
  // ============================================================================
  
  return {
    data,
    totalRecords,
    isLoading,
    error,
    pagination,
    sorting,
    filters,
    refetch,
    reset,
    queryParams
  };
}

export type {
  UseTableQueryConfig,
  UseTableQueryResult,
  TableQueryParams,
  FilterMap,
  PaginatedResponse,
  SimplePaginatedResponse
} from '../../types/table.types';
```

---

## Código Corrigido: `useUrlState.ts`

```typescript
import { useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterMap, FilterValue, TableUrlParams } from '../../types/table.types';

// ============================================================================
// HELPERS (mantidos iguais)
// ============================================================================

function serializeValue(value: FilterValue): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : null;
  }
  return String(value);
}

function deserializeValue(value: string | null, isArray = false): FilterValue {
  if (value === null || value === '') {
    return isArray ? [] : undefined;
  }
  if (isArray) {
    return value.split(',').filter(Boolean);
  }
  const num = Number(value);
  if (!isNaN(num) && value === String(num)) {
    return num;
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  return value;
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseUrlStateOptions<TFilters extends FilterMap = FilterMap> {
  prefix?: string;
  arrayFields?: (keyof TFilters)[];
  defaults?: {
    page?: number;
    pageSize?: number;
    ordering?: string;
    filters?: Partial<TFilters>;
  };
}

export interface UseUrlStateReturn<TFilters extends FilterMap = FilterMap> {
  getUrlState: () => TableUrlParams<TFilters>;
  setUrlState: (params: Partial<TableUrlParams<TFilters>>) => void;
  removeUrlParams: (keys: string[]) => void;
  clearUrlState: () => void;
  searchParams: URLSearchParams;
}

export function useUrlState<TFilters extends FilterMap = FilterMap>(
  options: UseUrlStateOptions<TFilters> = {}
): UseUrlStateReturn<TFilters> {
  const { prefix = '', arrayFields = [], defaults } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ FIX: Estabilizar defaults com useRef
  // Isso evita que mudanças de referência em defaults causem recriação de callbacks
  const defaultsRef = useRef(defaults);
  
  // Atualizar ref apenas na primeira vez ou se valores realmente mudarem
  // (Comparação profunda simples via JSON - para casos complexos, usar deep-equal)
  if (JSON.stringify(defaultsRef.current) !== JSON.stringify(defaults)) {
    defaultsRef.current = defaults;
  }

  const reservedKeys = useMemo(() => [
    `${prefix}page`,
    `${prefix}page_size`,
    `${prefix}ordering`
  ], [prefix]);

  // ✅ FIX: Remover defaults das dependências, usar ref
  const getUrlState = useCallback((): TableUrlParams<TFilters> => {
    const currentDefaults = defaultsRef.current;
    
    const pageParam = searchParams.get(`${prefix}page`);
    const pageSizeParam = searchParams.get(`${prefix}page_size`);
    const orderingParam = searchParams.get(`${prefix}ordering`);

    const filters: Partial<TFilters> = {} as Partial<TFilters>;
    
    searchParams.forEach((value, key) => {
      if (prefix && !key.startsWith(prefix)) return;
      
      const realKey = prefix ? key.slice(prefix.length) : key;
      
      if (reservedKeys.includes(key)) return;
      
      const isArray = (arrayFields as string[]).includes(realKey);
      (filters as Record<string, FilterValue>)[realKey] = deserializeValue(value, isArray);
    });

    return {
      page: pageParam ? Number(pageParam) : currentDefaults?.page,
      pageSize: pageSizeParam ? Number(pageSizeParam) : currentDefaults?.pageSize,
      ordering: orderingParam || currentDefaults?.ordering,
      filters: Object.keys(filters).length > 0 ? filters : currentDefaults?.filters
    };
  }, [searchParams, prefix, reservedKeys, arrayFields]);  // ← defaults removido

  // ✅ FIX: Remover defaults das dependências, usar ref
  const setUrlState = useCallback((params: Partial<TableUrlParams<TFilters>>) => {
    const currentDefaults = defaultsRef.current;
    
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (params.page !== undefined) {
        if (params.page === 1 || params.page === currentDefaults?.page) {
          newParams.delete(`${prefix}page`);
        } else {
          newParams.set(`${prefix}page`, String(params.page));
        }
      }

      if (params.pageSize !== undefined) {
        if (params.pageSize === currentDefaults?.pageSize) {
          newParams.delete(`${prefix}page_size`);
        } else {
          newParams.set(`${prefix}page_size`, String(params.pageSize));
        }
      }

      if (params.ordering !== undefined) {
        if (!params.ordering || params.ordering === currentDefaults?.ordering) {
          newParams.delete(`${prefix}ordering`);
        } else {
          newParams.set(`${prefix}ordering`, params.ordering);
        }
      }

      if (params.filters !== undefined) {
        const keysToRemove: string[] = [];
        newParams.forEach((_, key) => {
          if (prefix && !key.startsWith(prefix)) return;
          if (reservedKeys.includes(key)) return;
          keysToRemove.push(key);
        });
        keysToRemove.forEach(key => newParams.delete(key));

        Object.entries(params.filters).forEach(([key, value]) => {
          const serialized = serializeValue(value as FilterValue);
          if (serialized !== null) {
            newParams.set(`${prefix}${key}`, serialized);
          }
        });
      }

      return newParams;
    }, { replace: true });
  }, [setSearchParams, prefix, reservedKeys]);  // ← defaults removido

  const removeUrlParams = useCallback((keys: string[]) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      keys.forEach(key => newParams.delete(`${prefix}${key}`));
      return newParams;
    }, { replace: true });
  }, [setSearchParams, prefix]);

  const clearUrlState = useCallback(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      
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
```

---

## Checklist de Verificação

Após aplicar as correções, verifique:

- [ ] Apenas **1 requisição** ao carregar a página
- [ ] Mudança de página dispara **1 requisição**
- [ ] Mudança de ordenação dispara **1 requisição**
- [ ] Aplicar filtros dispara **1 requisição**
- [ ] Refresh da página mantém estado da URL e dispara **1 requisição**
- [ ] Console não mostra warnings de dependências

---

## Debug: Como Identificar o Problema

Adicione estes logs temporários para identificar a causa:

```typescript
// No useTableQuery, antes do useEffect do fetch:
useEffect(() => {
  console.log('[useTableQuery] fetchData changed, will fetch');
  console.log('[useTableQuery] queryParams:', queryParams);
}, [fetchData]);

// No useUrlState, nos callbacks:
const setUrlState = useCallback((params) => {
  console.log('[useUrlState] setUrlState called with:', params);
  // ...
}, [...]);
```

Se você ver múltiplos logs "fetchData changed" sem interação do usuário, o problema está nas dependências instáveis.

---

## Recomendações Adicionais

1. **No componente consumidor**, sempre estabilize `initialFilters`:
   ```typescript
   const initialFilters = useMemo(() => ({ status: 'active' }), []);
   ```

2. **Considere usar `react-query` ou `swr`** para gerenciamento de cache e deduplicação automática de requisições.

3. **Use React DevTools** para identificar re-renders desnecessários.

4. **Teste com StrictMode desabilitado** temporariamente para confirmar se o problema é de double-render do dev mode.
