# Sistema de Tabelas - Documentação

## Visão Geral

Este sistema fornece uma arquitetura sólida, tipada e previsível para gerenciamento de tabelas com:

- **Paginação server-side**
- **Ordenação no padrão Django DRF**
- **Filtros com separação draft/applied**
- **Sincronização com URL**
- **Performance otimizada**

## Arquitetura

```
packages/
├── shared/
│   └── src/
│       ├── hooks/
│       │   └── table/
│       │       ├── index.ts           # Exportações
│       │       ├── useTableQuery.ts   # Hook principal (orquestrador)
│       │       ├── usePagination.ts   # Controle de paginação
│       │       ├── useSorting.ts      # Controle de ordenação (DRF)
│       │       ├── useFilters.ts      # Controle de filtros
│       │       └── useUrlState.ts     # Sincronização com URL
│       └── types/
│           └── table.types.ts         # Tipagens centralizadas
└── ui/
    └── src/
        └── components/
            └── tables/
                ├── index.ts           # Exportações
                ├── DataTable.tsx      # Componente principal
                └── TableFilters.tsx   # Container de filtros
```

## Padrão de Páginas

As páginas seguem a separação:

```
pages/
└── users/
    ├── page.tsx    # Orquestração (conecta hook com view)
    ├── view.tsx    # Camada visual
    ├── hook.ts     # Regras de negócio e estado
    └── types.ts    # Tipagens da página
```

## Uso Básico

### 1. Definir Tipos

```typescript
// types.ts
import type { FilterMap } from '@prime-repo/shared';

export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface UserFilters extends FilterMap {
  search?: string;
  status?: string[];
}
```

### 2. Criar Hook da Página

```typescript
// hook.ts
import { useTableQuery } from '@prime-repo/shared';
import { userService } from '@/services/user.service';

export function useUsersPage() {
  const table = useTableQuery<User, UserFilters>({
    fetchFn: (params) => userService.list(params),
    initialPageSize: 10,
    initialOrdering: '-createdAt',
    syncWithUrl: true,
    // IMPORTANTE: declare campos array para funcionarem no refresh!
    arrayFields: ['status']
  });

  return {
    ...table,
    // Ações adicionais da página
  };
}
```

### 3. Criar View

```tsx
// view.tsx
import { DataTable, TableFilters, FilterField } from '@prime-repo/ui';

export function UsersView({ data, pagination, sorting, filters, isLoading }) {
  return (
    <div>
      <TableFilters filters={filters} layout="grid" columns={3}>
        <FilterField label="Buscar">
          <InputText
            value={filters.draft.search ?? ''}
            onChange={e => filters.setDraftValue('search', e.target.value)}
          />
        </FilterField>
      </TableFilters>

      <DataTable
        data={data}
        columns={[
          { field: 'name', header: 'Nome', sortable: true },
          { field: 'email', header: 'Email' }
        ]}
        pagination={{ ...pagination, totalRecords }}
        sorting={sorting}
        loading={isLoading}
      />
    </div>
  );
}
```

### 4. Criar Page

```tsx
// page.tsx
export function UsersPage() {
  const pageState = useUsersPage();
  return <UsersView {...pageState} />;
}
```

## Comportamentos

### Paginação

- **Atualização imediata**: Mudar página/tamanho atualiza URL e dispara requisição
- **Reset automático**: Filtrar ou ordenar reseta para página 1

### Ordenação (Padrão DRF)

```
?ordering=name          # Ascendente
?ordering=-name         # Descendente
?ordering=name,-created # Múltiplas colunas (se multiSort=true)
```

- **Ciclo**: null → asc → desc → null
- **Atualização imediata**: Mudar ordenação atualiza URL e dispara requisição

### Filtros

```
?search=john           # Filtro simples
?status=active,pending # Array (separado por vírgula)
```

- **Draft vs Applied**: Digitar atualiza `draft`, não dispara requisição
- **Aplicar**: Somente ao clicar "Filtrar" os valores são aplicados
- **Zero lag**: Nenhuma operação pesada durante digitação

## API dos Hooks

### useTableQuery

```typescript
const {
  // Dados
  data,           // TData[] - Dados da página atual
  totalRecords,   // number - Total de registros
  isLoading,      // boolean - Estado de carregamento
  error,          // Error | null - Erro da última requisição

  // Sub-hooks
  pagination,     // PaginationResult
  sorting,        // SortingResult
  filters,        // FiltersResult<TFilters>

  // Ações
  refetch,        // () => void - Recarrega dados
  reset,          // () => void - Reseta para estado inicial

  // Debug
  queryParams     // TableQueryParams - Params enviados à API
} = useTableQuery<TData, TFilters>(config);
```

### Pagination

```typescript
const {
  page,           // number - Página atual (1-indexed)
  pageSize,       // number - Itens por página
  first,          // number - Primeiro índice (0-indexed, para PrimeReact)
  totalPages,     // number - Total de páginas

  setPage,        // (page: number) => void
  setPageSize,    // (size: number) => void
  resetPage       // () => void
} = pagination;
```

### Sorting

```typescript
const {
  sortItems,      // SortItem[] - Lista de ordenações
  ordering,       // string - String DRF (ex: "name,-created")

  toggleSort,     // (field: string) => void - Cicla ordenação
  setSort,        // (field: string, dir: 'asc'|'desc'|null) => void
  clearSort,      // () => void
  getSortDirection, // (field: string) => 'asc'|'desc'|null
  getSortIndex    // (field: string) => number
} = sorting;
```

### Filters

```typescript
const {
  draft,          // TFilters - Valores durante digitação
  applied,        // TFilters - Valores aplicados
  isDirty,        // boolean - Há mudanças não aplicadas

  setDraftValue,  // (key, value) => void - Atualiza draft
  setDraftValues, // (values) => void - Atualiza múltiplos
  applyFilters,   // () => void - Aplica filtros
  clearFilter,    // (key) => void - Limpa um filtro
  clearAllFilters,// () => void - Limpa todos
  resetDraft      // () => void - Descarta mudanças
} = filters;
```

## Componentes

### DataTable

```tsx
<DataTable
  data={data}
  columns={columns}           // ou use children com <Column>
  pagination={pagination}
  sorting={sorting}
  loading={isLoading}
  emptyMessage="Nenhum registro"
  striped
  pageSizeOptions={[10, 25, 50]}
>
  {/* Ou use children */}
  <Column field="name" header="Nome" sortable />
</DataTable>
```

### TableFilters

```tsx
<TableFilters
  filters={filters}
  layout="grid"               // 'horizontal' | 'vertical' | 'grid'
  columns={4}                 // Para layout="grid"
  loading={isLoading}
  filterLabel="Buscar"
  clearLabel="Limpar"
  showClear
>
  <FilterField label="Nome">
    <InputText
      value={filters.draft.name ?? ''}
      onChange={e => filters.setDraftValue('name', e.target.value)}
    />
  </FilterField>
</TableFilters>
```

## Performance

### O que evitar

❌ Sincronizar URL durante digitação  
❌ Disparar requisições a cada tecla  
❌ Re-renders da tabela por mudanças no input  
❌ Lógica pesada em onChange  

### O que fazer

✅ Separar estado draft/applied  
✅ Usar useCallback para handlers  
✅ Memoizar componentes com React.memo  
✅ Aplicar filtros somente no click  

## Formato da URL

```
/users?page=2&page_size=25&ordering=-created_at&search=john&status=active,pending
```

- `page`: Página atual
- `page_size`: Itens por página
- `ordering`: Ordenação DRF
- Outros: Filtros aplicados

## Comportamento no Refresh (F5)

**O sistema restaura automaticamente o estado da URL!**

Quando o usuário dá refresh ou acessa uma URL compartilhada:

1. O hook lê os parâmetros da URL
2. Inicializa paginação, ordenação e filtros com esses valores
3. Os inputs de filtro já aparecem preenchidos
4. A requisição é feita com os parâmetros corretos

### Configuração Necessária para Arrays

⚠️ **IMPORTANTE**: Para filtros que são arrays (ex: MultiSelect), você **deve** declarar `arrayFields`:

```typescript
const table = useTableQuery<User, UserFilters>({
  fetchFn: api.getUsers,
  syncWithUrl: true,
  // Necessário para parsear corretamente: ?status=active,inactive
  arrayFields: ['status', 'roles']
});
```

Sem isso, `status=active,inactive` seria interpretado como string em vez de `['active', 'inactive']`.

### Fluxo de Inicialização

```
1. Página carrega com URL: ?page=2&search=john&status=active,pending

2. useTableQuery:
   - Lê URL: { page: 2, search: 'john', status: ['active', 'pending'] }
   - Inicializa estados com esses valores

3. useControlledFilters:
   - Inicializa draft com applied (valores da URL)
   - Inputs já renderizam com valores preenchidos

4. useEffect dispara fetch:
   - Requisição: GET /users?page=2&search=john&status=active,pending
```

### Compartilhamento de URL

O sistema permite compartilhar o estado exato da tabela:

```
// Usuário A aplica filtros e está na página 3
URL: /users?page=3&ordering=-name&status=active&search=silva

// Usuário A compartilha URL com Usuário B
// Usuário B abre o link e vê exatamente o mesmo estado!
```

## Resposta da API

Suporta dois formatos:

```typescript
// Formato DRF
interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
}

// Formato simplificado
interface SimplePaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

## Tipagem

Todo o sistema é fortemente tipado. Use generics para garantir type-safety:

```typescript
// Tipos bem definidos
interface User { id: number; name: string; }
interface UserFilters extends FilterMap { search?: string; }

// Hook tipado
const table = useTableQuery<User, UserFilters>({...});

// Autocompletar funciona
table.filters.setDraftValue('search', 'value'); // ✅
table.filters.setDraftValue('invalid', 'x');    // ❌ TypeScript erro
```
