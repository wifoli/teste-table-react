# Componentes UI - React + PrimeReact

Biblioteca de componentes React otimizados para performance, evitando re-renders desnecessários através de memoização estratégica, refs estáveis e hooks customizados.

## 📦 Instalação

```bash
npm install primereact primeicons chart.js
```

## 🗂️ Estrutura

```
components/
├── DataTable/           # Tabela com Tree State Selection
│   ├── DataTable.tsx
│   ├── useTreeSelection.ts
│   ├── types.ts
│   └── index.ts
├── Buttons/             # DialButton e SplitButton
│   ├── DialButton.tsx
│   ├── SplitButton.tsx
│   └── index.ts
├── Charts/              # Todos os gráficos
│   ├── hooks/
│   │   ├── useChartData.ts
│   │   └── useChartOptions.ts
│   ├── BaseChart.tsx
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── PieChart.tsx     # PieChart + DoughnutChart
│   ├── RadarChart.tsx   # RadarChart + PolarAreaChart
│   ├── ScatterChart.tsx # ScatterChart + BubbleChart
│   ├── ComboChart.tsx
│   ├── GaugeChart.tsx
│   ├── FunnelChart.tsx
│   ├── TreemapChart.tsx
│   └── index.ts
└── index.ts
```

---

## 📊 DataTable com Tree State Selection

### Conceito

O Tree State Selection implementa três estados de seleção:

| Estado | Descrição | Callback |
|--------|-----------|----------|
| `none` | Nenhum item selecionado | - |
| `partial` | Alguns itens selecionados | `onSelectedRowsChange(rows)` |
| `all` | Todos os registros (incluindo outras páginas) | `onSelectAll(filters)` |

### Uso Básico

```tsx
import { DataTable } from "./components";

function MyTable() {
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const handleSelectAll = (filters: Filters) => {
        // Backend processa TODOS os registros com esses filtros
        console.log("Selecionar todos com filtros:", filters);
        setIsAllSelected(true);
    };

    return (
        <DataTable<User, Filters>
            data={users}
            dataKey="id"
            // Tree Selection
            treeSelection
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            onSelectAll={handleSelectAll}
            onSelectionClear={() => {
                setSelectedRows([]);
                setIsAllSelected(false);
            }}
            currentFilters={{ status: "active" }}
            // Outras props
            columns={[
                { field: "name", header: "Nome", sortable: true },
                { field: "email", header: "Email" },
            ]}
            pagination={pagination}
        />
    );
}
```

### Props do Tree Selection

| Prop | Tipo | Descrição |
|------|------|-----------|
| `treeSelection` | `boolean` | Habilita o modo de três estados |
| `selectedRows` | `TData[]` | Itens selecionados individualmente |
| `onSelectedRowsChange` | `(rows: TData[]) => void` | Callback ao selecionar/deselecionar |
| `onSelectAll` | `(filters: TFilters) => void` | Callback ao selecionar TODOS |
| `onSelectionClear` | `() => void` | Callback ao limpar seleção |
| `currentFilters` | `TFilters` | Filtros atuais (enviados ao onSelectAll) |
| `selectAllLabel` | `string \| ((total) => string)` | Texto quando todos selecionados |
| `clearSelectionLabel` | `string` | Texto do botão limpar |

### Hook useTreeSelection

Para controle mais granular:

```tsx
import { useTreeSelection } from "./components";

const {
    state,           // { type: 'none' | 'partial' | 'all', ... }
    checkboxState,   // 'none' | 'partial' | 'all'
    selectedRows,    // TData[]
    isSelected,      // (row) => boolean
    toggleRow,       // (row) => void
    selectPageRows,  // (rows) => void
    selectAll,       // () => void
    clearSelection,  // () => void
    selectedCount,   // number (-1 se todos)
    isAllSelected,   // boolean
} = useTreeSelection({
    selectedRows,
    onSelectedRowsChange,
    onSelectAll,
    currentFilters,
    totalRecords: 1000,
});
```

---

## 🔘 Buttons

### DialButton (SpeedDial)

```tsx
import { DialButton } from "./components";

<DialButton
    items={[
        { label: "Editar", icon: "pi pi-pencil", onClick: handleEdit },
        { label: "Duplicar", icon: "pi pi-copy", onClick: handleDuplicate },
        { label: "Excluir", icon: "pi pi-trash", danger: true, onClick: handleDelete },
    ]}
    direction="up"
    variant="primary"
    showTooltip
    tooltipPosition="left"
/>
```

### SplitButton

```tsx
import { SplitButton } from "./components";

<SplitButton
    label="Salvar"
    icon="pi pi-save"
    onClick={handleSave}
    variant="primary"
    items={[
        { label: "Salvar como rascunho", icon: "pi pi-file", onClick: handleDraft },
        { label: "Salvar e publicar", icon: "pi pi-send", onClick: handlePublish },
        { separator: true, label: "Descartar", danger: true, onClick: handleDiscard },
    ]}
/>
```

---

## 📈 Charts

### Tipos Disponíveis

| Componente | Tipo | Descrição |
|------------|------|-----------|
| `LineChart` | Série | Gráfico de linhas |
| `BarChart` | Série | Gráfico de barras (vertical/horizontal) |
| `PieChart` | Fatia | Gráfico de pizza |
| `DoughnutChart` | Fatia | Gráfico de rosca |
| `RadarChart` | Série | Gráfico de radar |
| `PolarAreaChart` | Fatia | Área polar |
| `BubbleChart` | XY | Gráfico de bolhas |
| `ScatterChart` | XY | Gráfico de dispersão |
| `ComboChart` | Misto | Combinação linha + barra |
| `GaugeChart` | Especial | Medidor/velocímetro |
| `FunnelChart` | Especial | Funil de conversão |
| `TreemapChart` | Especial | Mapa de árvore |

### Paletas de Cores

```tsx
colorPalette="default"   // Azul, verde, amarelo, vermelho...
colorPalette="pastel"    // Tons suaves
colorPalette="vibrant"   // Cores intensas
colorPalette="monochrome" // Escala de cinza
colorPalette="warm"      // Vermelho, laranja, amarelo
colorPalette="cool"      // Azul, verde, ciano
colorPalette="corporate" // Tons escuros profissionais
```

### LineChart

```tsx
<LineChart
    labels={["Jan", "Fev", "Mar", "Abr"]}
    datasets={[
        { label: "Vendas 2024", data: [65, 59, 80, 81] },
        { label: "Vendas 2023", data: [28, 48, 40, 19] },
    ]}
    title="Comparativo de Vendas"
    colorPalette="vibrant"
    fill={false}
    tension={0.4}
    showPoints
    yAxisLabel="Valor (R$)"
    onClick={(e) => console.log(e)}
/>
```

### BarChart

```tsx
<BarChart
    labels={["Q1", "Q2", "Q3", "Q4"]}
    datasets={[
        { label: "Receita", data: [120, 150, 180, 200] },
        { label: "Despesas", data: [80, 90, 100, 110] },
    ]}
    title="Resultado Trimestral"
    stacked={false}
    horizontal={false}
    borderRadius={8}
    tooltipFormat="currency"
/>
```

### DoughnutChart

```tsx
<DoughnutChart
    labels={["Concluído", "Em Progresso", "Pendente"]}
    data={[60, 25, 15]}
    title="Status do Projeto"
    cutout="70%"
    centerText="60%"
    centerSubtext="Concluído"
/>
```

### ComboChart (Linha + Barra)

```tsx
<ComboChart
    labels={["Jan", "Fev", "Mar"]}
    datasets={[
        { type: "bar", label: "Vendas", data: [65, 59, 80] },
        { type: "line", label: "Meta", data: [60, 60, 70], fill: false },
    ]}
    title="Vendas vs Meta"
    dualAxis // Habilita segundo eixo Y
    yAxisLabel="Vendas (R$)"
    y2AxisLabel="Meta"
/>
```

### GaugeChart

```tsx
<GaugeChart
    value={75}
    min={0}
    max={100}
    label="Performance"
    suffix="%"
    color={(value) => value < 50 ? "#EF4444" : value < 80 ? "#F59E0B" : "#10B981"}
    arcThickness={20}
/>
```

### FunnelChart

```tsx
<FunnelChart
    data={[
        { label: "Visitantes", value: 1000 },
        { label: "Leads", value: 500 },
        { label: "Oportunidades", value: 200 },
        { label: "Vendas", value: 50 },
    ]}
    showValues
    showPercentages
    showConversionRate
    valueFormat="compact"
/>
```

### TreemapChart

```tsx
<TreemapChart
    data={[
        { id: 1, label: "Marketing", value: 300 },
        { id: 2, label: "Vendas", value: 250 },
        { id: 3, label: "TI", value: 200 },
        { id: 4, label: "RH", value: 150 },
    ]}
    showLabels
    showValues
    valueFormat="currency"
    onItemClick={(item) => console.log(item)}
/>
```

---

## ⚡ Otimizações de Performance

### Padrões Utilizados

1. **Refs para handlers estáveis**
   ```tsx
   const callbacksRef = useRef({ onClick, onHover });
   callbacksRef.current = { onClick, onHover };
   
   const handleClick = useCallback(() => {
       callbacksRef.current.onClick?.();
   }, []); // Deps vazias = nunca recria
   ```

2. **Memoização de dados e opções**
   ```tsx
   const chartData = useChartData({
       type: "line",
       labels,
       datasets,
       colorPalette,
   });
   ```

3. **Comparação profunda antes de atualizar**
   ```tsx
   const prevDatasetsRef = useRef(datasets);
   if (!datasetsEqual(datasets, prevDatasetsRef.current)) {
       // Só recalcula se realmente mudou
   }
   ```

4. **Componentes memo com displayName**
   ```tsx
   const MyComponent = memo(function MyComponent() { ... });
   MyComponent.displayName = "MyComponent";
   ```

### Hooks de Performance

```tsx
// Dados do gráfico - só recalcula quando necessário
const data = useChartData({ type, labels, datasets, colorPalette });

// Opções do gráfico - memoizadas
const options = useChartOptions({
    type: "line",
    legendPosition: "top",
    animated: true,
});

// Opções específicas para linha
const lineOptions = useLineChartOptions({
    showGrid: true,
    beginAtZero: true,
    yAxisLabel: "Valor",
});

// Opções específicas para barra
const barOptions = useBarChartOptions({
    horizontal: false,
    stacked: true,
});
```

---

## 🎨 Props Comuns (BaseChartProps)

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `width` | `string \| number` | `"100%"` | Largura |
| `height` | `string \| number` | - | Altura |
| `colorPalette` | `ColorPalette` | `"default"` | Paleta de cores |
| `colors` | `string[]` | - | Cores customizadas |
| `legendPosition` | `"top" \| "bottom" \| "left" \| "right" \| "none"` | `"top"` | Posição da legenda |
| `showLegend` | `boolean` | `true` | Mostra legenda |
| `title` | `string` | - | Título do gráfico |
| `subtitle` | `string` | - | Subtítulo |
| `tooltipFormat` | `"default" \| "currency" \| "percent" \| "number"` | `"default"` | Formato do tooltip |
| `animated` | `boolean` | `true` | Habilita animações |
| `animationDuration` | `number` | `400` | Duração da animação (ms) |
| `responsive` | `boolean` | `true` | Responsivo |
| `maintainAspectRatio` | `boolean` | `true` | Mantém proporção |
| `aspectRatio` | `number` | `2` | Proporção largura/altura |
| `loading` | `boolean` | `false` | Estado de loading |
| `error` | `string` | - | Mensagem de erro |
| `onClick` | `(element) => void` | - | Callback ao clicar |
| `onHover` | `(element) => void` | - | Callback ao hover |
| `chartOptions` | `Partial<ChartOptions>` | - | Opções extras do Chart.js |

---

## 📝 Exemplos Completos

Veja o arquivo `examples.tsx` para exemplos de todos os componentes.
