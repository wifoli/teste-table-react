# Otimização de Performance - useTableQuery

## Problema Original

O `useTableQuery` original causava re-renders excessivos porque:

1. **Estado centralizado em `useState`**: Qualquer mudança no estado (page, filters, data, loading) causava re-render de TODOS os componentes que usavam o hook
2. **Handlers recriados a cada render**: `handlePageChange`, `handleOrderingChange`, etc. eram recriados, invalidando memoizações
3. **Sub-hooks recriados**: `pagination`, `sorting`, `filters` eram novos objetos a cada render
4. **Comparação de queryParams superficial**: Mesmo sem mudanças reais, poderia disparar fetches

## Solução Implementada

Seguindo o padrão do `useForm` que já funciona bem, implementamos:

### 1. TableStore - Classe de Estado Centralizado

```typescript
class TableStore<TData, TFilters> {
    private state: TableState<TData, TFilters>;
    
    // Listeners SEPARADOS por "slice" do estado
    private paginationListeners = new Set<Listener>();
    private sortingListeners = new Set<Listener>();
    private filtersListeners = new Set<Listener>();
    private dataListeners = new Set<Listener>();
    
    // Cache para evitar criação de novos objetos
    private paginationCache: PaginationResult | null = null;
    // ...
}
```

**Benefícios:**
- Estado mutável dentro da classe (sem criar novos objetos)
- Cache de estados derivados (retorna MESMA referência se nada mudou)
- Notificações granulares (só notifica listeners relevantes)

### 2. Subscriptions Granulares com useSyncExternalStore

```typescript
// Cada "slice" do estado tem sua própria subscription
const paginationState = useSyncExternalStore(
    useCallback((cb) => store.subscribePagination(cb), [store]),
    useCallback(() => store.getPaginationState(), [store]),
    useCallback(() => store.getPaginationState(), [store]),
);
```

**Benefícios:**
- Componente só re-renderiza se SEU slice mudou
- React garante consistência entre server/client
- Integração nativa com Concurrent Mode

### 3. Handlers Estáveis com useRef

```typescript
const handlersRef = useRef<{
    pagination: { setPage: ..., setPageSize: ..., resetPage: ... };
    sorting: { toggleSort: ..., setSort: ..., clearSort: ... };
    filters: { setDraftValue: ..., applyFilters: ..., ... };
} | null>(null);

// Criado UMA vez, nunca recriado
if (!handlersRef.current) {
    handlersRef.current = {
        pagination: {
            setPage: (page) => store.setPage(page),
            // ...
        },
        // ...
    };
}
```

**Benefícios:**
- Handlers NUNCA mudam de referência
- Componentes filhos não re-renderizam por mudança de callback
- `useCallback` desnecessário para cada handler

### 4. Notificações Granulares

```typescript
// Quando muda apenas o draft do filtro
setDraftFilter(key, value) {
    this.state = { ...this.state, draftFilters: newDraft };
    this.notifyFilters(); // SÓ listeners de filters
    // NÃO notifica global - não afeta query
}

// Quando aplica filtros
applyFilters() {
    this.state = { ...this.state, appliedFilters: cleaned, page: 1 };
    this.notifyFilters();
    this.notifyPagination(); // Página resetou
    this.notifyGlobal();     // Query params mudou
}
```

**Benefícios:**
- Digitar em input de filtro NÃO dispara fetch
- Digitar em input de filtro NÃO re-renderiza tabela
- Só "applyFilters" dispara a cadeia completa

## Comparação de Re-renders

### Antes (Original)

```
Usuário digita no filtro de busca:
├── useTableQuery re-renderiza
├── Componente pai re-renderiza
├── TableFilters re-renderiza
├── Todos os inputs re-renderizam
├── DataTable re-renderiza (mesmo sem dados novos)
└── Pagination re-renderiza (mesmo sem mudança)
```

### Depois (Otimizado)

```
Usuário digita no filtro de busca:
├── store.setDraftFilter() chamado
├── FiltersStore notifica listeners
└── APENAS componente do input re-renderiza (via useSyncExternalStore)

Usuário clica em "Pesquisar":
├── store.applyFilters() chamado
├── Notifica filters, pagination, global
├── URL é atualizada
├── Fetch é disparado
├── APENAS componentes afetados re-renderizam
```

## Migração

A API externa permanece **100% compatível**. Não é necessário mudar código que usa o hook:

```typescript
// Continua funcionando igual
const { data, pagination, filters } = useTableQuery({
    fetchFn: api.getUsers,
    initialPageSize: 10,
});

// pagination.setPage, filters.setDraftValue, etc. funcionam igual
```

## Melhorias no TableFilters

O `TableFilters` foi otimizado com:

1. **Sub-componentes memoizados**: `FilterStatus` e `FilterActions` são `memo()`
2. **Handlers estáveis via useRef**: Não recria callbacks a cada render
3. **useMemo para derivados**: `hasFilters` e `layoutConfig` são memoizados

## Dicas de Uso

### 1. Para inputs de filtro, use o draft diretamente:

```tsx
<InputText
    value={filters.draft.search ?? ''}
    onChange={(e) => filters.setDraftValue('search', e.target.value)}
/>
```

Isso NUNCA causa re-render da tabela durante digitação.

### 2. Para componentes que só precisam de parte do estado:

Se você tem um componente que só mostra loading:

```tsx
function LoadingIndicator() {
    // Crie uma subscription específica se necessário
    // ou use o data.loading do hook pai
}
```

### 3. Evite desestruturar tudo no componente raiz:

```tsx
// ❌ Ruim - qualquer mudança re-renderiza tudo
function Page() {
    const { data, isLoading, pagination, sorting, filters } = useTableQuery(...);
    // ...
}

// ✅ Melhor - passe apenas o necessário para filhos
function Page() {
    const table = useTableQuery(...);
    
    return (
        <>
            <Filters filters={table.filters} />
            <Table data={table.data} pagination={table.pagination} />
        </>
    );
}
```

## Métricas Esperadas

Com as otimizações:

- **Digitação em filtros**: 0 re-renders na tabela (antes: N por keystroke)
- **Mudança de página**: 1-2 re-renders (antes: componente inteiro)
- **Ordenação**: 1-2 re-renders (antes: componente inteiro)
- **Fetch de dados**: apenas DataTable re-renderiza
