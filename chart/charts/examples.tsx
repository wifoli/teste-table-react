import React, { useState, useCallback } from "react";
import {
    // DataTable
    DataTable,
    useTreeSelection,
    // Buttons
    DialButton,
    SplitButton,
    // Charts
    LineChart,
    BarChart,
    PieChart,
    DoughnutChart,
    RadarChart,
    PolarAreaChart,
    BubbleChart,
    ScatterChart,
    ComboChart,
    // Special Charts
    GaugeChart,
    FunnelChart,
    TreemapChart,
} from "./components";

// ============================================================================
// TYPES FOR EXAMPLES
// ============================================================================

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
}

interface Filters {
    search?: string;
    status?: string;
    role?: string;
}

// ============================================================================
// DATATABLE WITH TREE SELECTION EXAMPLE
// ============================================================================

export function DataTableTreeSelectionExample() {
    // Estado de seleção
    const [selectedRows, setSelectedRows] = useState<User[]>([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<Filters>({
        search: "",
        status: "active",
    });

    // Dados mockados
    const data: User[] = [
        { id: 1, name: "João Silva", email: "joao@email.com", role: "Admin", status: "active" },
        { id: 2, name: "Maria Santos", email: "maria@email.com", role: "User", status: "active" },
        { id: 3, name: "Pedro Oliveira", email: "pedro@email.com", role: "User", status: "inactive" },
    ];

    // Handlers
    const handleSelectedRowsChange = useCallback((rows: User[]) => {
        setSelectedRows(rows);
        setIsAllSelected(false);
    }, []);

    const handleSelectAll = useCallback((filters: Filters) => {
        console.log("Selecionar todos com filtros:", filters);
        // No backend, você usaria esses filtros para processar todos os registros
        setIsAllSelected(true);
        setSelectedRows([]);
    }, []);

    const handleSelectionClear = useCallback(() => {
        setSelectedRows([]);
        setIsAllSelected(false);
    }, []);

    // Ação em massa
    const handleBulkAction = useCallback(() => {
        if (isAllSelected) {
            console.log("Processar TODOS os registros com filtros:", currentFilters);
            // POST /api/bulk-action { selectAll: true, filters: currentFilters }
        } else {
            console.log("Processar registros selecionados:", selectedRows.map(r => r.id));
            // POST /api/bulk-action { ids: selectedRows.map(r => r.id) }
        }
    }, [isAllSelected, currentFilters, selectedRows]);

    return (
        <div>
            <DataTable<User, Filters>
                data={data}
                dataKey="id"
                // Tree Selection Props
                treeSelection
                selectedRows={selectedRows}
                onSelectedRowsChange={handleSelectedRowsChange}
                onSelectAll={handleSelectAll}
                onSelectionClear={handleSelectionClear}
                currentFilters={currentFilters}
                selectAllLabel={(total) => `Todos os ${total} registros selecionados`}
                clearSelectionLabel="Limpar seleção"
                // Outras props
                columns={[
                    { field: "name", header: "Nome", sortable: true },
                    { field: "email", header: "Email" },
                    { field: "role", header: "Função" },
                    { field: "status", header: "Status" },
                ]}
                pagination={{
                    page: 1,
                    pageSize: 10,
                    totalRecords: 100,
                    setPage: () => {},
                    setPageSize: () => {},
                }}
            />

            <button onClick={handleBulkAction}>
                {isAllSelected 
                    ? "Ação em todos os registros" 
                    : `Ação em ${selectedRows.length} registros`
                }
            </button>
        </div>
    );
}

// ============================================================================
// DIAL BUTTON EXAMPLE
// ============================================================================

export function DialButtonExample() {
    return (
        <DialButton
            items={[
                {
                    id: "edit",
                    label: "Editar",
                    icon: "pi pi-pencil",
                    onClick: () => console.log("Editar"),
                },
                {
                    id: "duplicate",
                    label: "Duplicar",
                    icon: "pi pi-copy",
                    onClick: () => console.log("Duplicar"),
                },
                {
                    id: "delete",
                    label: "Excluir",
                    icon: "pi pi-trash",
                    danger: true,
                    onClick: () => console.log("Excluir"),
                },
            ]}
            direction="up"
            variant="primary"
            showTooltip
            tooltipPosition="left"
            onOpen={() => console.log("Abriu")}
            onClose={() => console.log("Fechou")}
        />
    );
}

// ============================================================================
// SPLIT BUTTON EXAMPLE
// ============================================================================

export function SplitButtonExample() {
    return (
        <SplitButton
            label="Salvar"
            icon="pi pi-save"
            onClick={() => console.log("Salvar")}
            variant="primary"
            items={[
                {
                    label: "Salvar como rascunho",
                    icon: "pi pi-file",
                    onClick: () => console.log("Salvar rascunho"),
                },
                {
                    label: "Salvar e publicar",
                    icon: "pi pi-send",
                    onClick: () => console.log("Salvar e publicar"),
                },
                {
                    label: "Descartar",
                    icon: "pi pi-times",
                    danger: true,
                    separator: true,
                    onClick: () => console.log("Descartar"),
                },
            ]}
        />
    );
}

// ============================================================================
// LINE CHART EXAMPLE
// ============================================================================

export function LineChartExample() {
    return (
        <LineChart
            labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
            datasets={[
                {
                    label: "Vendas 2024",
                    data: [65, 59, 80, 81, 56, 55],
                },
                {
                    label: "Vendas 2023",
                    data: [28, 48, 40, 19, 86, 27],
                },
            ]}
            title="Comparativo de Vendas"
            subtitle="Valores em milhares"
            colorPalette="vibrant"
            fill={false}
            tension={0.4}
            showPoints
            showGrid
            yAxisLabel="Vendas (R$)"
            xAxisLabel="Mês"
            onClick={(e) => console.log("Clicou:", e)}
        />
    );
}

// ============================================================================
// BAR CHART EXAMPLE
// ============================================================================

export function BarChartExample() {
    return (
        <BarChart
            labels={["Q1", "Q2", "Q3", "Q4"]}
            datasets={[
                {
                    label: "Receita",
                    data: [120, 150, 180, 200],
                },
                {
                    label: "Despesas",
                    data: [80, 90, 100, 110],
                },
            ]}
            title="Resultado Trimestral"
            colorPalette="corporate"
            stacked={false}
            borderRadius={8}
            tooltipFormat="currency"
        />
    );
}

// ============================================================================
// HORIZONTAL BAR CHART EXAMPLE
// ============================================================================

export function HorizontalBarChartExample() {
    return (
        <BarChart
            labels={["Produto A", "Produto B", "Produto C", "Produto D"]}
            datasets={[
                {
                    label: "Vendas",
                    data: [300, 250, 200, 150],
                },
            ]}
            title="Top Produtos"
            horizontal
            colorPalette="cool"
        />
    );
}

// ============================================================================
// PIE CHART EXAMPLE
// ============================================================================

export function PieChartExample() {
    return (
        <PieChart
            labels={["Desktop", "Mobile", "Tablet"]}
            data={[55, 35, 10]}
            title="Tráfego por Dispositivo"
            showValues
            valueFormat="percent"
            colorPalette="pastel"
            legendPosition="right"
        />
    );
}

// ============================================================================
// DOUGHNUT CHART EXAMPLE
// ============================================================================

export function DoughnutChartExample() {
    return (
        <DoughnutChart
            labels={["Concluído", "Em Progresso", "Pendente"]}
            data={[60, 25, 15]}
            title="Status do Projeto"
            cutout="70%"
            centerText="60%"
            centerSubtext="Concluído"
            colorPalette="vibrant"
        />
    );
}

// ============================================================================
// RADAR CHART EXAMPLE
// ============================================================================

export function RadarChartExample() {
    return (
        <RadarChart
            labels={["Velocidade", "Força", "Resistência", "Flexibilidade", "Técnica"]}
            datasets={[
                {
                    label: "Atleta A",
                    data: [85, 75, 90, 60, 80],
                },
                {
                    label: "Atleta B",
                    data: [70, 90, 65, 85, 75],
                },
            ]}
            title="Comparativo de Atletas"
            fill
            suggestedMax={100}
            colorPalette="cool"
        />
    );
}

// ============================================================================
// POLAR AREA CHART EXAMPLE
// ============================================================================

export function PolarAreaChartExample() {
    return (
        <PolarAreaChart
            labels={["Marketing", "Vendas", "TI", "RH", "Financeiro"]}
            data={[300, 250, 200, 150, 180]}
            title="Orçamento por Departamento"
            colorPalette="warm"
            startFromTop
        />
    );
}

// ============================================================================
// BUBBLE CHART EXAMPLE
// ============================================================================

export function BubbleChartExample() {
    return (
        <BubbleChart
            datasets={[
                {
                    label: "Região Sul",
                    data: [
                        { x: 20, y: 30, r: 15 },
                        { x: 40, y: 10, r: 10 },
                    ],
                },
                {
                    label: "Região Sudeste",
                    data: [
                        { x: 30, y: 20, r: 25 },
                        { x: 50, y: 40, r: 20 },
                    ],
                },
            ]}
            title="Análise de Mercado"
            xAxisLabel="Participação (%)"
            yAxisLabel="Crescimento (%)"
            colorPalette="vibrant"
        />
    );
}

// ============================================================================
// SCATTER CHART EXAMPLE
// ============================================================================

export function ScatterChartExample() {
    return (
        <ScatterChart
            datasets={[
                {
                    label: "Correlação",
                    data: [
                        { x: 10, y: 20 },
                        { x: 15, y: 25 },
                        { x: 20, y: 35 },
                        { x: 25, y: 40 },
                        { x: 30, y: 45 },
                        { x: 35, y: 55 },
                    ],
                },
            ]}
            title="Análise de Correlação"
            xAxisLabel="Variável X"
            yAxisLabel="Variável Y"
            showTrendline
            colorPalette="corporate"
        />
    );
}

// ============================================================================
// COMBO CHART EXAMPLE
// ============================================================================

export function ComboChartExample() {
    return (
        <ComboChart
            labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
            datasets={[
                {
                    type: "bar",
                    label: "Vendas",
                    data: [65, 59, 80, 81, 56, 55],
                },
                {
                    type: "line",
                    label: "Meta",
                    data: [60, 60, 70, 75, 70, 65],
                    fill: false,
                },
            ]}
            title="Vendas vs Meta"
            subtitle="Desempenho mensal"
            colorPalette="vibrant"
            yAxisLabel="Valor (R$)"
        />
    );
}

// ============================================================================
// DUAL AXIS COMBO CHART EXAMPLE
// ============================================================================

export function DualAxisComboChartExample() {
    return (
        <ComboChart
            labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
            datasets={[
                {
                    type: "bar",
                    label: "Receita (R$)",
                    data: [12000, 15000, 18000, 22000, 25000, 28000],
                    yAxisID: "y",
                },
                {
                    type: "line",
                    label: "Clientes",
                    data: [150, 180, 210, 250, 280, 310],
                    yAxisID: "y2",
                },
            ]}
            title="Receita vs Clientes"
            dualAxis
            yAxisLabel="Receita (R$)"
            y2AxisLabel="Nº de Clientes"
            colorPalette="corporate"
        />
    );
}

// ============================================================================
// LOADING STATE EXAMPLE
// ============================================================================

export function LoadingChartExample() {
    return (
        <LineChart
            labels={[]}
            datasets={[]}
            title="Carregando dados..."
            loading={true}
            height={300}
        />
    );
}

// ============================================================================
// ERROR STATE EXAMPLE
// ============================================================================

export function ErrorChartExample() {
    return (
        <BarChart
            labels={[]}
            datasets={[]}
            title="Erro ao carregar"
            error="Não foi possível carregar os dados do gráfico"
            height={300}
        />
    );
}

// ============================================================================
// GAUGE CHART EXAMPLE
// ============================================================================

export function GaugeChartExample() {
    return (
        <GaugeChart
            value={75}
            min={0}
            max={100}
            label="Performance"
            suffix="%"
            arcThickness={20}
            height={200}
        />
    );
}

export function GaugeChartWithSegmentsExample() {
    return (
        <GaugeChart
            value={68}
            min={0}
            max={100}
            label="CPU Usage"
            suffix="%"
            segments={[
                { from: 0, to: 50, color: "#10B981" },
                { from: 50, to: 80, color: "#F59E0B" },
                { from: 80, to: 100, color: "#EF4444" },
            ]}
            height={200}
        />
    );
}

export function GaugeChartDynamicColorExample() {
    const [value, setValue] = useState(45);

    return (
        <div>
            <GaugeChart
                value={value}
                min={0}
                max={100}
                label="Score"
                color={(val) => {
                    if (val < 33) return "#EF4444"; // Vermelho
                    if (val < 66) return "#F59E0B"; // Amarelo
                    return "#10B981"; // Verde
                }}
                height={200}
            />
            <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full mt-4"
            />
        </div>
    );
}

// ============================================================================
// FUNNEL CHART EXAMPLE
// ============================================================================

export function FunnelChartExample() {
    return (
        <FunnelChart
            data={[
                { label: "Visitantes", value: 10000 },
                { label: "Leads", value: 5000 },
                { label: "Oportunidades", value: 2000 },
                { label: "Propostas", value: 800 },
                { label: "Vendas", value: 300 },
            ]}
            title="Funil de Vendas"
            showValues
            showPercentages
            showConversionRate
            valueFormat="compact"
            colorPalette="vibrant"
            height={400}
        />
    );
}

export function FunnelChartHorizontalExample() {
    return (
        <FunnelChart
            data={[
                { label: "Awareness", value: 1000 },
                { label: "Interest", value: 800 },
                { label: "Decision", value: 400 },
                { label: "Action", value: 200 },
            ]}
            title="Marketing Funnel"
            direction="horizontal"
            variant="bars"
            showValues
            colorPalette="cool"
            height={300}
        />
    );
}

// ============================================================================
// TREEMAP CHART EXAMPLE
// ============================================================================

export function TreemapChartExample() {
    return (
        <TreemapChart
            data={[
                { id: 1, label: "Tecnologia", value: 450 },
                { id: 2, label: "Saúde", value: 320 },
                { id: 3, label: "Financeiro", value: 280 },
                { id: 4, label: "Consumo", value: 220 },
                { id: 5, label: "Industrial", value: 180 },
                { id: 6, label: "Energia", value: 150 },
                { id: 7, label: "Utilidades", value: 100 },
                { id: 8, label: "Materiais", value: 80 },
            ]}
            title="Alocação por Setor"
            subtitle="Valores em milhões"
            showLabels
            showValues
            valueFormat="currency"
            colorPalette="corporate"
            height={400}
            onItemClick={(item) => console.log("Clicou em:", item)}
        />
    );
}

export function TreemapChartInteractiveExample() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <div>
            <TreemapChart
                data={[
                    { id: "us", label: "Estados Unidos", value: 450 },
                    { id: "cn", label: "China", value: 380 },
                    { id: "jp", label: "Japão", value: 220 },
                    { id: "de", label: "Alemanha", value: 180 },
                    { id: "br", label: "Brasil", value: 150 },
                    { id: "uk", label: "Reino Unido", value: 140 },
                    { id: "fr", label: "França", value: 130 },
                    { id: "in", label: "Índia", value: 120 },
                ]}
                title="Receita por País"
                colorPalette="vibrant"
                height={350}
                onItemHover={(item) => setHoveredItem(item?.label || null)}
                renderTooltip={(item) => (
                    <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-sm text-gray-300">
                            Receita: R$ {item.value}M
                        </div>
                    </div>
                )}
            />
            {hoveredItem && (
                <p className="mt-4 text-center text-gray-600">
                    Hovering: <strong>{hoveredItem}</strong>
                </p>
            )}
        </div>
    );
}
