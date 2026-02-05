# 🪝 Documentação de Hooks

Guia completo dos hooks disponíveis para gráficos e DataTable com Tree State Selection.

---

## 📑 Índice

1. [Hooks de Gráficos](#hooks-de-gráficos)
   - [useChartData](#usechartdata)
   - [useSliceChartData](#useslicechartdata)
   - [useSeriesChartData](#useserieschartdata)
   - [useChartOptions](#usechartoptions)
   - [useLineChartOptions](#uselinechartoptions)
   - [useBarChartOptions](#usebarchartoptions)
2. [Hook de Seleção](#hook-de-seleção)
   - [useTreeSelection](#usetreeselection)
3. [Padrões de Performance](#padrões-de-performance)
4. [Exemplos Avançados](#exemplos-avançados)

---

# Hooks de Gráficos

Os hooks de gráficos são responsáveis por **memoizar** dados e opções, evitando re-renders desnecessários e recálculos custosos.

## useChartData

Hook principal para criar e memoizar dados do gráfico. Processa datasets, aplica cores da paleta e evita recriação desnecessária do objeto `ChartData`.

### Importação

```tsx
import { useChartData } from "./components/Charts";
```

### Assinatura

```tsx
function useChartData<T extends ChartType>(
    options: UseChartDataOptions<T>
): ChartData<T>
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `type` | `ChartType` | ✅ | Tipo do gráfico (`"line"`, `"bar"`, `"pie"`, `"doughnut"`, `"radar"`, `"polarArea"`, `"bubble"`, `"scatter"`) |
| `labels` | `string[]` | ❌ | Labels do eixo X (obrigatório para line, bar, etc.) |
| `datasets` | `any[]` | ✅ | Array de datasets com dados |
| `colorPalette` | `ColorPalette` | ❌ | Paleta de cores (`"default"`, `"pastel"`, `"vibrant"`, etc.) |
| `colors` | `string[]` | ❌ | Array de cores customizadas (sobrescreve paleta) |

### Retorno

Retorna um objeto `ChartData<T>` do Chart.js com:
- `labels`: Labels processados
- `datasets`: Datasets com cores aplicadas

### Como Funciona Internamente

1. **Comparação de mudanças**: Usa refs para comparar se labels, datasets, cores ou paleta mudaram
2. **Cache**: Se nada mudou, retorna o objeto cacheado (mesma referência)
3. **Processamento de cores**: Aplica cores da paleta ou customizadas aos datasets
4. **Diferenciação por tipo**: Gráficos de "fatia" (pie, doughnut, polarArea) têm cada valor com cor diferente

### Exemplos de Uso

```tsx
// Uso básico para gráfico de linha
const chartData = useChartData({
    type: "line",
    labels: ["Jan", "Fev", "Mar", "Abr"],
    datasets: [
        { label: "Vendas", data: [100, 150, 120, 180] },
        { label: "Meta", data: [110, 140, 130, 170] }
    ],
    colorPalette: "vibrant"
});

// <Chart type="line" data={chartData} options={...} />
```

```tsx
// Com cores customizadas
const chartData = useChartData({
    type: "bar",
    labels: ["A", "B", "C"],
    datasets: [
        { label: "Valores", data: [30, 50, 20] }
    ],
    colors: ["#FF6384", "#36A2EB", "#FFCE56"]
});
```

```tsx
// Para gráfico de pizza (cores por fatia)
const chartData = useChartData({
    type: "pie",
    labels: ["Desktop", "Mobile", "Tablet"],
    datasets: [
        { data: [55, 35, 10] }  // Sem label, dados diretos
    ],
    colorPalette: "pastel"
});

// Resultado: cada fatia terá uma cor diferente da paleta
```

### Quando Usar

✅ **Use quando:**
- Precisa de controle total sobre a criação dos dados
- Está construindo um componente de gráfico customizado
- Quer reutilizar a lógica de cores em múltiplos gráficos

❌ **Não precisa usar quando:**
- Está usando os componentes prontos (LineChart, BarChart, etc.) - eles já usam internamente

---

## useSliceChartData

Hook simplificado para gráficos de "fatia" (pie, doughnut, polarArea). Wrapper do `useChartData` com interface mais simples.

### Importação

```tsx
import { useSliceChartData } from "./components/Charts";
```

### Assinatura

```tsx
function useSliceChartData(
    labels: string[],
    data: number[],
    colorPalette?: ColorPalette,
    colors?: string[]
): ChartData<"pie" | "doughnut" | "polarArea">
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `labels` | `string[]` | ✅ | - | Labels das fatias |
| `data` | `number[]` | ✅ | - | Valores das fatias |
| `colorPalette` | `ColorPalette` | ❌ | `"default"` | Paleta de cores |
| `colors` | `string[]` | ❌ | - | Cores customizadas |

### Retorno

`ChartData` pronto para pie, doughnut ou polarArea.

### Exemplos de Uso

```tsx
// Simples e direto
const pieData = useSliceChartData(
    ["Sim", "Não", "Talvez"],
    [60, 25, 15]
);

// Com paleta
const doughnutData = useSliceChartData(
    ["Online", "Offline"],
    [847, 153],
    "cool"
);

// Com cores específicas
const polarData = useSliceChartData(
    ["Q1", "Q2", "Q3", "Q4"],
    [120, 150, 180, 90],
    undefined,
    ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444"]
);
```

### Quando Usar

✅ **Use quando:**
- Precisa criar dados para pie/doughnut/polarArea manualmente
- Quer interface mais simples que `useChartData`

---

## useSeriesChartData

Hook simplificado para gráficos de série (line, bar). Wrapper do `useChartData` com interface mais simples.

### Importação

```tsx
import { useSeriesChartData } from "./components/Charts";
```

### Assinatura

```tsx
function useSeriesChartData(
    type: "line" | "bar",
    labels: string[],
    datasets: Array<{
        label: string;
        data: number[];
        fill?: boolean;
        type?: "line" | "bar";
    }>,
    colorPalette?: ColorPalette,
    colors?: string[]
): ChartData<"line" | "bar">
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `type` | `"line" \| "bar"` | ✅ | - | Tipo do gráfico |
| `labels` | `string[]` | ✅ | - | Labels do eixo X |
| `datasets` | `Dataset[]` | ✅ | - | Datasets simplificados |
| `colorPalette` | `ColorPalette` | ❌ | `"default"` | Paleta de cores |
| `colors` | `string[]` | ❌ | - | Cores customizadas |

### Exemplos de Uso

```tsx
// Gráfico de linha
const lineData = useSeriesChartData(
    "line",
    ["Jan", "Fev", "Mar"],
    [
        { label: "2024", data: [100, 150, 200] },
        { label: "2023", data: [80, 120, 160] }
    ],
    "vibrant"
);

// Gráfico de barra
const barData = useSeriesChartData(
    "bar",
    ["A", "B", "C", "D"],
    [
        { label: "Vendas", data: [300, 450, 200, 350] }
    ]
);

// Linha com área preenchida
const areaData = useSeriesChartData(
    "line",
    ["Seg", "Ter", "Qua", "Qui", "Sex"],
    [
        { label: "Usuários", data: [500, 600, 550, 700, 650], fill: true }
    ],
    "cool"
);
```

---

## useChartOptions

Hook para criar e memoizar opções do gráfico. Gerencia callbacks de forma estável para evitar re-renders.

### Importação

```tsx
import { useChartOptions } from "./components/Charts";
```

### Assinatura

```tsx
function useChartOptions(options: UseChartOptionsOptions): ChartOptions
```

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `type` | `SupportedChartType` | ✅ | - | Tipo do gráfico |
| `legendPosition` | `LegendPosition` | ❌ | `"top"` | Posição da legenda |
| `showLegend` | `boolean` | ❌ | `true` | Exibe legenda |
| `title` | `string` | ❌ | - | Título do gráfico |
| `subtitle` | `string` | ❌ | - | Subtítulo |
| `tooltipFormat` | `TooltipFormat` | ❌ | `"default"` | Formato do tooltip |
| `tooltipFormatter` | `(value, label, datasetLabel?) => string` | ❌ | - | Formatador customizado |
| `animated` | `boolean` | ❌ | `true` | Habilita animações |
| `animationDuration` | `number` | ❌ | `400` | Duração em ms |
| `responsive` | `boolean` | ❌ | `true` | Responsivo |
| `maintainAspectRatio` | `boolean` | ❌ | `true` | Mantém proporção |
| `aspectRatio` | `number` | ❌ | `2` | Proporção largura/altura |
| `onClick` | `(element) => void` | ❌ | - | Callback ao clicar |
| `onHover` | `(element \| null) => void` | ❌ | - | Callback ao hover |
| `extraOptions` | `Partial<ChartOptions>` | ❌ | - | Opções extras do Chart.js |

### Retorno

Objeto `ChartOptions` do Chart.js pronto para uso.

### Como Funciona Internamente

1. **Refs para callbacks**: `onClick` e `onHover` são armazenados em refs para manter estabilidade
2. **Handlers estáveis**: `handleClick` e `handleHover` são criados com `useCallback` e deps vazias
3. **Opções por tipo**: Aplica configurações específicas (escalas, tooltips) baseado no tipo
4. **Deep merge**: Combina opções base + tipo + extras

### Exemplos de Uso

```tsx
// Opções básicas
const options = useChartOptions({
    type: "line",
    title: "Vendas Mensais",
    legendPosition: "bottom",
    tooltipFormat: "currency"
});
```

```tsx
// Com interatividade
const options = useChartOptions({
    type: "bar",
    title: "Cliques por Categoria",
    onClick: ({ datasetIndex, index, value }) => {
        console.log(`Clicou no item ${index} com valor ${value}`);
        navigate(`/details/${labels[index]}`);
    },
    onHover: (element) => {
        setHighlighted(element?.index ?? null);
    }
});
```

```tsx
// Com formatador customizado
const options = useChartOptions({
    type: "pie",
    tooltipFormatter: (value, label) => {
        const percent = ((value / total) * 100).toFixed(1);
        return `${label}: ${value.toLocaleString()} (${percent}%)`;
    }
});
```

```tsx
// Com opções extras do Chart.js
const options = useChartOptions({
    type: "line",
    extraOptions: {
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    targetLine: {
                        type: 'line',
                        yMin: 75,
                        yMax: 75,
                        borderColor: 'red',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            content: 'Meta',
                            enabled: true
                        }
                    }
                }
            }
        }
    }
});
```

---

## useLineChartOptions

Hook especializado para opções de gráfico de linha. Estende `useChartOptions` com props específicas.

### Importação

```tsx
import { useLineChartOptions } from "./components/Charts";
```

### Assinatura

```tsx
function useLineChartOptions(
    options: Omit<UseChartOptionsOptions, "type"> & {
        showGrid?: boolean;
        beginAtZero?: boolean;
        yAxisLabel?: string;
        xAxisLabel?: string;
    }
): ChartOptions
```

### Parâmetros Adicionais

| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `showGrid` | `boolean` | `true` | Exibe grade de fundo |
| `beginAtZero` | `boolean` | `true` | Eixo Y começa em zero |
| `yAxisLabel` | `string` | - | Label do eixo Y |
| `xAxisLabel` | `string` | - | Label do eixo X |

### Exemplos de Uso

```tsx
const options = useLineChartOptions({
    title: "Temperatura ao Longo do Dia",
    showGrid: true,
    beginAtZero: false,  // Temperatura pode ser negativa
    yAxisLabel: "°C",
    xAxisLabel: "Hora",
    tooltipFormatter: (value) => `${value}°C`
});
```

```tsx
// Sem grade, minimalista
const options = useLineChartOptions({
    showGrid: false,
    showLegend: false,
    animated: false
});
```

---

## useBarChartOptions

Hook especializado para opções de gráfico de barra. Estende `useChartOptions` com props específicas.

### Importação

```tsx
import { useBarChartOptions } from "./components/Charts";
```

### Assinatura

```tsx
function useBarChartOptions(
    options: Omit<UseChartOptionsOptions, "type"> & {
        horizontal?: boolean;
        stacked?: boolean;
        showGrid?: boolean;
        beginAtZero?: boolean;
        yAxisLabel?: string;
        xAxisLabel?: string;
    }
): ChartOptions
```

### Parâmetros Adicionais

| Parâmetro | Tipo | Default | Descrição |
|-----------|------|---------|-----------|
| `horizontal` | `boolean` | `false` | Barras horizontais |
| `stacked` | `boolean` | `false` | Barras empilhadas |
| `showGrid` | `boolean` | `true` | Exibe grade |
| `beginAtZero` | `boolean` | `true` | Começa em zero |
| `yAxisLabel` | `string` | - | Label do eixo Y |
| `xAxisLabel` | `string` | - | Label do eixo X |

### Exemplos de Uso

```tsx
// Barras horizontais empilhadas
const options = useBarChartOptions({
    title: "Vendas por Região",
    horizontal: true,
    stacked: true,
    tooltipFormat: "currency"
});
```

```tsx
// Barras verticais com labels
const options = useBarChartOptions({
    title: "Comparativo Trimestral",
    yAxisLabel: "Receita (R$)",
    xAxisLabel: "Trimestre",
    beginAtZero: true
});
```

---

# Hook de Seleção

## useTreeSelection

Hook para gerenciar estado de seleção com três estados possíveis: nenhum, parcial e todos.

### Importação

```tsx
import { useTreeSelection } from "./components/DataTable";
```

### Conceito

O Tree State Selection implementa três estados:

| Estado | Tipo | Descrição | Uso no Backend |
|--------|------|-----------|----------------|
| `none` | `{ type: "none" }` | Nada selecionado | - |
| `partial` | `{ type: "partial", rows: TData[] }` | Alguns itens | `ids: rows.map(r => r.id)` |
| `all` | `{ type: "all", filters: TFilters }` | Todos (incluindo outras páginas) | `filters: {...}` |

### Assinatura

```tsx
function useTreeSelection<TData, TFilters = Record<string, unknown>>(
    options: UseTreeSelectionOptions<TData, TFilters>
): UseTreeSelectionResult<TData, TFilters>
```

### Parâmetros (Options)

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|-----------|------|-------------|---------|-----------|
| `selectedRows` | `TData[]` | ❌ | `[]` | Rows atualmente selecionadas |
| `onSelectedRowsChange` | `(rows: TData[]) => void` | ❌ | - | Callback quando rows mudam |
| `onSelectAll` | `(filters: TFilters) => void` | ❌ | - | Callback quando "selecionar todos" é acionado |
| `onSelectionClear` | `() => void` | ❌ | - | Callback quando seleção é limpa |
| `currentFilters` | `TFilters` | ❌ | - | Filtros atuais (enviados ao onSelectAll) |
| `forcedState` | `SelectionCheckboxState` | ❌ | - | Força um estado específico |
| `totalRecords` | `number` | ❌ | `0` | Total de registros (para calcular se todos estão selecionados) |
| `pageData` | `TData[]` | ❌ | `[]` | Dados da página atual |
| `idKey` | `keyof TData` | ❌ | `"id"` | Chave para identificar cada row |

### Retorno (Result)

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `state` | `TreeSelectionState<TData, TFilters>` | Estado tipado discriminado |
| `checkboxState` | `"none" \| "partial" \| "all"` | Estado visual do checkbox |
| `selectedRows` | `TData[]` | Rows selecionadas (vazio se all) |
| `isSelected` | `(row: TData, idKey?: keyof TData) => boolean` | Verifica se row está selecionada |
| `toggleRow` | `(row: TData, idKey?: keyof TData) => void` | Alterna seleção de uma row |
| `selectPageRows` | `(rows: TData[]) => void` | Seleciona todas as rows da página |
| `selectAll` | `() => void` | Aciona onSelectAll com filtros |
| `clearSelection` | `() => void` | Limpa toda a seleção |
| `selectedCount` | `number` | Quantidade selecionada (-1 se todos) |
| `isAllSelected` | `boolean` | Se está no modo "todos" |

### Exemplos de Uso

#### Uso Básico

```tsx
import { useTreeSelection } from "./components/DataTable";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Filters {
    search?: string;
    status?: string;
}

function MyComponent() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [filters, setFilters] = useState<Filters>({ status: "active" });

    const {
        checkboxState,
        isSelected,
        toggleRow,
        selectPageRows,
        selectAll,
        clearSelection,
        selectedCount,
        isAllSelected
    } = useTreeSelection<User, Filters>({
        selectedRows,
        onSelectedRowsChange: setSelectedRows,
        onSelectAll: (filters) => {
            console.log("Selecionar todos com filtros:", filters);
            // Marcar estado como "todos selecionados"
        },
        onSelectionClear: () => {
            setSelectedRows([]);
        },
        currentFilters: filters,
        totalRecords: 1000,
        idKey: "id"
    });

    return (
        <div>
            {/* Header checkbox */}
            <input
                type="checkbox"
                checked={checkboxState === "all"}
                indeterminate={checkboxState === "partial"}
                onChange={() => {
                    if (checkboxState === "none") {
                        selectPageRows(pageData);
                    } else {
                        clearSelection();
                    }
                }}
            />

            {/* Rows */}
            {pageData.map(user => (
                <div key={user.id}>
                    <input
                        type="checkbox"
                        checked={isSelected(user)}
                        onChange={() => toggleRow(user)}
                    />
                    {user.name}
                </div>
            ))}

            {/* Info */}
            <p>
                {isAllSelected 
                    ? "Todos os registros selecionados" 
                    : `${selectedCount} selecionados`
                }
            </p>
        </div>
    );
}
```

#### Integração com Backend

```tsx
function handleBulkAction() {
    if (isAllSelected) {
        // Backend processa TODOS os registros que atendem aos filtros
        api.post("/bulk-action", {
            selectAll: true,
            filters: currentFilters
        });
    } else {
        // Backend processa apenas os IDs selecionados
        api.post("/bulk-action", {
            selectAll: false,
            ids: selectedRows.map(r => r.id)
        });
    }
}
```

#### Com DataTable

```tsx
<DataTable<User, Filters>
    data={users}
    dataKey="id"
    // Tree Selection
    treeSelection
    selectedRows={selectedRows}
    onSelectedRowsChange={setSelectedRows}
    onSelectAll={(filters) => {
        setIsAllSelected(true);
        setActiveFilters(filters);
    }}
    onSelectionClear={() => {
        setSelectedRows([]);
        setIsAllSelected(false);
    }}
    currentFilters={filters}
    // Customização
    selectAllLabel={(total) => `Todos os ${total} registros selecionados`}
    clearSelectionLabel="Limpar seleção"
    // Resto das props
    columns={columns}
    pagination={pagination}
/>
```

#### Estado Controlado Externamente

```tsx
// Quando você controla o estado "all" externamente
const [isAllMode, setIsAllMode] = useState(false);

const selection = useTreeSelection({
    selectedRows,
    onSelectedRowsChange: (rows) => {
        setSelectedRows(rows);
        setIsAllMode(false);  // Sai do modo "all" ao selecionar individualmente
    },
    onSelectAll: () => {
        setIsAllMode(true);
        setSelectedRows([]);  // Limpa seleção individual
    },
    forcedState: isAllMode ? "all" : undefined,  // Força estado "all"
    currentFilters: filters
});
```

#### Excluindo Itens no Modo "All"

```tsx
// Permite desmarcar itens específicos mesmo com "todos" selecionados
const [excludedIds, setExcludedIds] = useState<number[]>([]);

function handleToggleInAllMode(user: User) {
    if (excludedIds.includes(user.id)) {
        setExcludedIds(ids => ids.filter(id => id !== user.id));
    } else {
        setExcludedIds(ids => [...ids, user.id]);
    }
}

// No backend
api.post("/bulk-action", {
    selectAll: true,
    filters: currentFilters,
    excludeIds: excludedIds
});
```

---

# Padrões de Performance

## Por que usar esses hooks?

### Problema: Re-renders em cascata

```tsx
// ❌ RUIM: Recria objetos a cada render
function BadChart({ data }) {
    const chartData = {
        labels: data.labels,
        datasets: data.datasets.map(ds => ({
            ...ds,
            backgroundColor: getColor(ds.index)
        }))
    };

    const options = {
        onClick: (e) => handleClick(e),  // Nova função a cada render!
        // ...
    };

    return <Chart data={chartData} options={options} />;
}
```

### Solução: Hooks memoizados

```tsx
// ✅ BOM: Memoização com hooks
function GoodChart({ data }) {
    const chartData = useChartData({
        type: "line",
        labels: data.labels,
        datasets: data.datasets,
        colorPalette: "default"
    });

    const options = useChartOptions({
        type: "line",
        onClick: handleClick,  // Armazenado em ref internamente
    });

    return <Chart data={chartData} options={options} />;
}
```

## Técnicas Usadas

### 1. Refs para Callbacks

```tsx
// Dentro do hook
const callbacksRef = useRef({ onClick, onHover });
callbacksRef.current = { onClick, onHover };

const handleClick = useCallback(() => {
    callbacksRef.current.onClick?.();
}, []);  // Deps vazias = nunca recria
```

### 2. Comparação Antes de Atualizar

```tsx
// Dentro do useChartData
const prevLabelsRef = useRef<string[]>([]);

// Só recalcula se realmente mudou
if (!arraysEqual(labels, prevLabelsRef.current)) {
    prevLabelsRef.current = labels;
    // Recalcula...
}
```

### 3. Cache de Resultado

```tsx
const cachedDataRef = useRef<ChartData | null>(null);

// Se nada mudou, retorna cache
if (!labelsChanged && !datasetsChanged && cachedDataRef.current) {
    return cachedDataRef.current;
}
```

---

# Exemplos Avançados

## Dashboard com Múltiplos Gráficos

```tsx
function Dashboard() {
    const { data: salesData, isLoading } = useSalesQuery();
    const { data: usersData } = useUsersQuery();

    // Reutiliza paleta e opções base
    const palette = "corporate";
    
    const baseOptions = useChartOptions({
        type: "line",
        animated: !isLoading,
        tooltipFormat: "currency"
    });

    const salesChartData = useSeriesChartData(
        "line",
        salesData?.labels ?? [],
        salesData?.datasets ?? [],
        palette
    );

    const usersChartData = useSeriesChartData(
        "bar",
        usersData?.labels ?? [],
        usersData?.datasets ?? [],
        palette
    );

    return (
        <div className="grid grid-cols-2 gap-4">
            <LineChart
                {...salesChartData}
                title="Vendas"
                loading={isLoading}
            />
            <BarChart
                {...usersChartData}
                title="Usuários"
            />
        </div>
    );
}
```

## Gráfico com Atualização em Tempo Real

```tsx
function RealtimeChart() {
    const [data, setData] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    // WebSocket ou polling
    useEffect(() => {
        const ws = new WebSocket("ws://...");
        ws.onmessage = (event) => {
            const value = JSON.parse(event.data);
            setData(prev => [...prev.slice(-19), value]);
            setLabels(prev => [...prev.slice(-19), new Date().toLocaleTimeString()]);
        };
        return () => ws.close();
    }, []);

    // Hook memoiza, evitando re-render do Chart.js desnecessário
    const chartData = useChartData({
        type: "line",
        labels,
        datasets: [{ label: "Valor", data }]
    });

    const options = useLineChartOptions({
        animated: false,  // Desabilita animação para tempo real
        showGrid: true
    });

    return <Chart type="line" data={chartData} options={options} />;
}
```

## Tabela com Ações em Lote

```tsx
function UsersTable() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [filters, setFilters] = useState({ status: "all", role: "all" });
    const { data, pagination, isLoading } = useUsersQuery(filters);

    const selection = useTreeSelection({
        selectedRows,
        onSelectedRowsChange: setSelectedRows,
        onSelectAll: async (filters) => {
            // Marca como "todos selecionados" no estado local
            // O backend receberá os filtros ao executar a ação
        },
        currentFilters: filters,
        totalRecords: pagination.total
    });

    const handleBulkDelete = async () => {
        if (selection.isAllSelected) {
            await api.delete("/users/bulk", {
                data: { selectAll: true, filters }
            });
        } else {
            await api.delete("/users/bulk", {
                data: { ids: selectedRows.map(u => u.id) }
            });
        }
    };

    const handleBulkExport = async () => {
        const response = await api.post("/users/export", {
            selectAll: selection.isAllSelected,
            filters: selection.isAllSelected ? filters : undefined,
            ids: selection.isAllSelected ? undefined : selectedRows.map(u => u.id)
        });
        
        downloadFile(response.data);
    };

    return (
        <>
            <div className="flex gap-2 mb-4">
                <Button
                    label={`Excluir ${selection.isAllSelected ? 'Todos' : selection.selectedCount}`}
                    onClick={handleBulkDelete}
                    disabled={selection.checkboxState === "none"}
                />
                <Button
                    label="Exportar"
                    onClick={handleBulkExport}
                    disabled={selection.checkboxState === "none"}
                />
            </div>

            <DataTable
                data={data}
                loading={isLoading}
                treeSelection
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                onSelectAll={selection.selectAll}
                onSelectionClear={selection.clearSelection}
                currentFilters={filters}
                pagination={pagination}
                columns={[
                    { field: "name", header: "Nome" },
                    { field: "email", header: "Email" },
                    { field: "role", header: "Função" }
                ]}
            />
        </>
    );
}
```

---

## Resumo dos Hooks

| Hook | Propósito | Retorno |
|------|-----------|---------|
| `useChartData` | Memoiza dados do gráfico | `ChartData` |
| `useSliceChartData` | Dados para pie/doughnut/polar | `ChartData` |
| `useSeriesChartData` | Dados para line/bar | `ChartData` |
| `useChartOptions` | Memoiza opções gerais | `ChartOptions` |
| `useLineChartOptions` | Opções para linha | `ChartOptions` |
| `useBarChartOptions` | Opções para barra | `ChartOptions` |
| `useTreeSelection` | Gerencia seleção 3-estados | `UseTreeSelectionResult` |
