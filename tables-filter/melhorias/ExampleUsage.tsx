// ============================================================================
// EXEMPLO DE USO - Integração useTableQuery + DataTable + TableFilters
// ============================================================================

import { useTableQuery } from "./useTableQuery";
import { DataTable } from "./DataTable";
import { TableFilters } from "./TableFilters";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

// ============================================================================
// TYPES
// ============================================================================

interface User {
    id: number;
    name: string;
    email: string;
    status: "active" | "inactive";
    createdAt: string;
}

interface UserFilters {
    search?: string;
    status?: string;
}

// ============================================================================
// API MOCK
// ============================================================================

async function fetchUsers(params: any) {
    // Simula chamada API
    console.log("Fetching with params:", params);
    
    return {
        results: [] as User[],
        count: 0,
    };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function UsersPage() {
    // Hook único para toda a lógica da tabela
    const {
        data,
        isLoading,
        pagination,  // Já inclui totalRecords!
        sorting,
        filters,
        refetch,
    } = useTableQuery<User, UserFilters>({
        fetchFn: fetchUsers,
        initialPageSize: 10,
        initialOrdering: "-createdAt",
        initialFilters: {
            search: "",
            status: "",
        },
        syncWithUrl: true,
        urlPrefix: "users_",
    });

    // Status options
    const statusOptions = [
        { label: "Todos", value: "" },
        { label: "Ativo", value: "active" },
        { label: "Inativo", value: "inactive" },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Usuários</h1>

            {/* 
                TableFilters recebe filters diretamente
                - Digitação NÃO causa re-render da tabela
                - Só ao clicar "Pesquisar" a tabela atualiza
            */}
            <TableFilters filters={filters} loading={isLoading}>
                <div className="field">
                    <label htmlFor="search">Buscar</label>
                    <InputText
                        id="search"
                        value={filters.draft.search ?? ""}
                        onChange={(e) => filters.setDraftValue("search", e.target.value)}
                        placeholder="Nome ou email..."
                        className="w-full"
                    />
                </div>

                <div className="field">
                    <label htmlFor="status">Status</label>
                    <Dropdown
                        id="status"
                        value={filters.draft.status ?? ""}
                        options={statusOptions}
                        onChange={(e) => filters.setDraftValue("status", e.value)}
                        placeholder="Selecione..."
                        className="w-full"
                    />
                </div>
            </TableFilters>

            {/* 
                DataTable recebe pagination e sorting diretamente
                - pagination já inclui totalRecords
                - sorting.toggleSort é chamado automaticamente nos headers
            */}
            <DataTable
                data={data}
                loading={isLoading}
                pagination={pagination}
                sorting={sorting}
                dataKey="id"
                striped
            >
                <Column field="id" header="ID" sortable style={{ width: "80px" }} />
                <Column field="name" header="Nome" sortable />
                <Column field="email" header="Email" sortable />
                <Column 
                    field="status" 
                    header="Status" 
                    sortable
                    body={(row) => (
                        <span className={row.status === "active" ? "text-green-600" : "text-red-600"}>
                            {row.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                    )}
                />
                <Column 
                    field="createdAt" 
                    header="Criado em" 
                    sortable
                    body={(row) => new Date(row.createdAt).toLocaleDateString("pt-BR")}
                />
            </DataTable>

            {/* Botão de refresh manual */}
            <button 
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Atualizar
            </button>
        </div>
    );
}

// ============================================================================
// EXEMPLO COM columns prop (alternativa ao children)
// ============================================================================

export function UsersPageWithColumns() {
    const { data, isLoading, pagination, sorting, filters } = useTableQuery<User, UserFilters>({
        fetchFn: fetchUsers,
        initialPageSize: 10,
    });

    const columns = [
        { field: "id" as const, header: "ID", sortable: true, width: "80px" },
        { field: "name" as const, header: "Nome", sortable: true },
        { field: "email" as const, header: "Email", sortable: true },
        { 
            field: "status" as const, 
            header: "Status", 
            sortable: true,
            body: (row: User) => (
                <span className={row.status === "active" ? "text-green-600" : "text-red-600"}>
                    {row.status === "active" ? "Ativo" : "Inativo"}
                </span>
            ),
        },
    ];

    return (
        <div className="p-4">
            <TableFilters filters={filters} loading={isLoading}>
                <InputText
                    value={filters.draft.search ?? ""}
                    onChange={(e) => filters.setDraftValue("search", e.target.value)}
                    placeholder="Buscar..."
                />
            </TableFilters>

            <DataTable
                data={data}
                columns={columns}
                loading={isLoading}
                pagination={pagination}
                sorting={sorting}
            />
        </div>
    );
}

// ============================================================================
// PONTOS IMPORTANTES DA INTEGRAÇÃO
// ============================================================================

/*
1. useTableQuery retorna tudo que os componentes precisam:
   - data, isLoading, error → para o DataTable
   - pagination (com totalRecords) → para o DataTable
   - sorting → para o DataTable
   - filters → para o TableFilters

2. Nenhuma prop adicional necessária:
   - pagination já tem totalRecords
   - sorting já tem toggleSort, getSortDirection, etc.
   - filters já tem draft, applied, setDraftValue, applyFilters

3. Performance otimizada:
   - Digitar em filtros NÃO re-renderiza DataTable
   - Mudar página NÃO re-renderiza TableFilters
   - Ordenar NÃO re-renderiza TableFilters
   
4. URL sync automático:
   - Página, ordenação e filtros sincronizam com URL
   - Refresh da página restaura estado
   - Funciona com browser back/forward

5. Compatibilidade total:
   - DataTable aceita tanto setPage quanto onPageChange
   - Funciona com columns prop ou children
   - Sorting funciona automaticamente com sortable nas colunas
*/
