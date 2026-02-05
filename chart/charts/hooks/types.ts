import type { ChartData, ChartOptions, ChartType } from "chart.js";

// ============================================================================
// BASE TYPES
// ============================================================================

/** Tipos de gráfico suportados */
export type SupportedChartType =
    | "line"
    | "bar"
    | "pie"
    | "doughnut"
    | "radar"
    | "polarArea"
    | "bubble"
    | "scatter"
    | "combo";

/** Paleta de cores padrão */
export type ColorPalette =
    | "default"
    | "pastel"
    | "vibrant"
    | "monochrome"
    | "warm"
    | "cool"
    | "corporate";

/** Posição da legenda */
export type LegendPosition = "top" | "bottom" | "left" | "right" | "none";

/** Formato de tooltip */
export type TooltipFormat = "default" | "currency" | "percent" | "number" | "custom";

// ============================================================================
// DATA TYPES
// ============================================================================

/** Ponto de dado genérico */
export interface DataPoint {
    label: string;
    value: number;
    color?: string;
    borderColor?: string;
}

/** Dataset para gráficos de linha/barra */
export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
    type?: "line" | "bar";
    yAxisID?: string;
    order?: number;
    hidden?: boolean;
}

/** Dataset para gráficos de bolha */
export interface BubbleDataPoint {
    x: number;
    y: number;
    r: number;
}

export interface BubbleDataset {
    label: string;
    data: BubbleDataPoint[];
    backgroundColor?: string;
    borderColor?: string;
}

/** Dataset para gráficos de dispersão */
export interface ScatterDataPoint {
    x: number;
    y: number;
}

export interface ScatterDataset {
    label: string;
    data: ScatterDataPoint[];
    backgroundColor?: string;
    borderColor?: string;
    pointRadius?: number;
}

// ============================================================================
// PROPS TYPES
// ============================================================================

/** Props base compartilhadas por todos os gráficos */
export interface BaseChartProps {
    /** Largura do gráfico (CSS value) */
    width?: string | number;

    /** Altura do gráfico (CSS value) */
    height?: string | number;

    /** Classes CSS adicionais */
    className?: string;

    /** Estilo inline */
    style?: React.CSSProperties;

    /** Paleta de cores */
    colorPalette?: ColorPalette;

    /** Cores customizadas (sobrescreve paleta) */
    colors?: string[];

    /** Posição da legenda */
    legendPosition?: LegendPosition;

    /** Mostra legenda */
    showLegend?: boolean;

    /** Título do gráfico */
    title?: string;

    /** Subtítulo */
    subtitle?: string;

    /** Formato do tooltip */
    tooltipFormat?: TooltipFormat;

    /** Formatador customizado para tooltip */
    tooltipFormatter?: (value: number, label: string, datasetLabel?: string) => string;

    /** Animações habilitadas */
    animated?: boolean;

    /** Duração da animação em ms */
    animationDuration?: number;

    /** Responsivo (ajusta ao container) */
    responsive?: boolean;

    /** Mantém aspect ratio */
    maintainAspectRatio?: boolean;

    /** Aspect ratio (width/height) */
    aspectRatio?: number;

    /** Estado de loading */
    loading?: boolean;

    /** Mensagem de erro */
    error?: string;

    /** Callback quando clica em um elemento */
    onClick?: (element: { datasetIndex: number; index: number; value: number }) => void;

    /** Callback quando hover em um elemento */
    onHover?: (element: { datasetIndex: number; index: number; value: number } | null) => void;

    /** Opções extras do Chart.js (merge com padrões) */
    chartOptions?: Partial<ChartOptions>;

    /** ID único do gráfico */
    id?: string;

    /** Plugins do Chart.js */
    plugins?: any[];
}

/** Props para gráficos de linha */
export interface LineChartProps extends BaseChartProps {
    /** Labels do eixo X */
    labels: string[];

    /** Datasets */
    datasets: ChartDataset[];

    /** Preenche área abaixo da linha */
    fill?: boolean;

    /** Tensão da curva (0 = reto, 1 = muito curvo) */
    tension?: number;

    /** Mostra pontos */
    showPoints?: boolean;

    /** Tamanho dos pontos */
    pointRadius?: number;

    /** Tipo de linha */
    stepped?: boolean | "before" | "after" | "middle";

    /** Mostra grade */
    showGrid?: boolean;

    /** Escala Y começa em zero */
    beginAtZero?: boolean;

    /** Label do eixo Y */
    yAxisLabel?: string;

    /** Label do eixo X */
    xAxisLabel?: string;

    /** Segundo eixo Y */
    dualAxis?: boolean;

    /** Label do segundo eixo Y */
    y2AxisLabel?: string;
}

/** Props para gráficos de barra */
export interface BarChartProps extends BaseChartProps {
    /** Labels do eixo X */
    labels: string[];

    /** Datasets */
    datasets: ChartDataset[];

    /** Barras horizontais */
    horizontal?: boolean;

    /** Barras empilhadas */
    stacked?: boolean;

    /** Largura das barras (0-1) */
    barThickness?: number | "flex";

    /** Borda arredondada */
    borderRadius?: number;

    /** Mostra grade */
    showGrid?: boolean;

    /** Escala Y começa em zero */
    beginAtZero?: boolean;

    /** Label do eixo Y */
    yAxisLabel?: string;

    /** Label do eixo X */
    xAxisLabel?: string;
}

/** Props para gráficos de pizza/rosca */
export interface PieChartProps extends BaseChartProps {
    /** Labels das fatias */
    labels: string[];

    /** Valores das fatias */
    data: number[];

    /** Mostra valores nas fatias */
    showValues?: boolean;

    /** Formato dos valores */
    valueFormat?: "value" | "percent" | "both";

    /** Borda entre fatias */
    borderWidth?: number;

    /** Cor da borda */
    borderColor?: string;

    /** Offset ao hover */
    hoverOffset?: number;

    /** Rotação inicial (graus) */
    rotation?: number;

    /** Circunferência (graus) */
    circumference?: number;
}

/** Props para gráficos de rosca (donut) */
export interface DoughnutChartProps extends PieChartProps {
    /** Tamanho do corte interno (0-100) */
    cutout?: number | string;

    /** Texto central */
    centerText?: string;

    /** Subtexto central */
    centerSubtext?: string;
}

/** Props para gráficos de radar */
export interface RadarChartProps extends BaseChartProps {
    /** Labels dos eixos */
    labels: string[];

    /** Datasets */
    datasets: ChartDataset[];

    /** Preenche área */
    fill?: boolean;

    /** Mostra escala */
    showScale?: boolean;

    /** Mostra linhas do radar */
    showGridLines?: boolean;

    /** Valor mínimo da escala */
    suggestedMin?: number;

    /** Valor máximo da escala */
    suggestedMax?: number;

    /** Quantidade de níveis na grade */
    stepSize?: number;
}

/** Props para gráficos de área polar */
export interface PolarAreaChartProps extends BaseChartProps {
    /** Labels das fatias */
    labels: string[];

    /** Valores das fatias */
    data: number[];

    /** Começa do topo */
    startFromTop?: boolean;

    /** Mostra escala */
    showScale?: boolean;

    /** Borda entre fatias */
    borderWidth?: number;
}

/** Props para gráficos de bolha */
export interface BubbleChartProps extends BaseChartProps {
    /** Datasets de bolhas */
    datasets: BubbleDataset[];

    /** Label do eixo X */
    xAxisLabel?: string;

    /** Label do eixo Y */
    yAxisLabel?: string;

    /** Mostra grade */
    showGrid?: boolean;
}

/** Props para gráficos de dispersão */
export interface ScatterChartProps extends BaseChartProps {
    /** Datasets de pontos */
    datasets: ScatterDataset[];

    /** Label do eixo X */
    xAxisLabel?: string;

    /** Label do eixo Y */
    yAxisLabel?: string;

    /** Mostra grade */
    showGrid?: boolean;

    /** Mostra linha de tendência */
    showTrendline?: boolean;
}

/** Props para gráficos combo (misto) */
export interface ComboChartProps extends BaseChartProps {
    /** Labels do eixo X */
    labels: string[];

    /** Datasets (com tipo especificado) */
    datasets: (ChartDataset & { type: "line" | "bar" })[];

    /** Mostra grade */
    showGrid?: boolean;

    /** Escala Y começa em zero */
    beginAtZero?: boolean;

    /** Label do eixo Y */
    yAxisLabel?: string;

    /** Label do eixo X */
    xAxisLabel?: string;

    /** Segundo eixo Y */
    dualAxis?: boolean;

    /** Label do segundo eixo Y */
    y2AxisLabel?: string;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

/** Opções para o hook useChartData */
export interface UseChartDataOptions<T extends ChartType = ChartType> {
    type: T;
    labels?: string[];
    datasets: any[];
    colorPalette?: ColorPalette;
    colors?: string[];
}

/** Opções para o hook useChartOptions */
export interface UseChartOptionsOptions {
    type: SupportedChartType;
    legendPosition?: LegendPosition;
    showLegend?: boolean;
    title?: string;
    subtitle?: string;
    tooltipFormat?: TooltipFormat;
    tooltipFormatter?: (value: number, label: string, datasetLabel?: string) => string;
    animated?: boolean;
    animationDuration?: number;
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    aspectRatio?: number;
    onClick?: (element: { datasetIndex: number; index: number; value: number }) => void;
    onHover?: (element: { datasetIndex: number; index: number; value: number } | null) => void;
    extraOptions?: Partial<ChartOptions>;
}

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const COLOR_PALETTES: Record<ColorPalette, string[]> = {
    default: [
        "#3B82F6", // blue-500
        "#10B981", // emerald-500
        "#F59E0B", // amber-500
        "#EF4444", // red-500
        "#8B5CF6", // violet-500
        "#EC4899", // pink-500
        "#06B6D4", // cyan-500
        "#84CC16", // lime-500
    ],
    pastel: [
        "#93C5FD", // blue-300
        "#6EE7B7", // emerald-300
        "#FCD34D", // amber-300
        "#FCA5A5", // red-300
        "#C4B5FD", // violet-300
        "#F9A8D4", // pink-300
        "#67E8F9", // cyan-300
        "#BEF264", // lime-300
    ],
    vibrant: [
        "#2563EB", // blue-600
        "#059669", // emerald-600
        "#D97706", // amber-600
        "#DC2626", // red-600
        "#7C3AED", // violet-600
        "#DB2777", // pink-600
        "#0891B2", // cyan-600
        "#65A30D", // lime-600
    ],
    monochrome: [
        "#1F2937", // gray-800
        "#374151", // gray-700
        "#4B5563", // gray-600
        "#6B7280", // gray-500
        "#9CA3AF", // gray-400
        "#D1D5DB", // gray-300
        "#E5E7EB", // gray-200
        "#F3F4F6", // gray-100
    ],
    warm: [
        "#DC2626", // red-600
        "#EA580C", // orange-600
        "#D97706", // amber-600
        "#CA8A04", // yellow-600
        "#F97316", // orange-500
        "#EF4444", // red-500
        "#F59E0B", // amber-500
        "#FBBF24", // yellow-400
    ],
    cool: [
        "#2563EB", // blue-600
        "#0891B2", // cyan-600
        "#0D9488", // teal-600
        "#059669", // emerald-600
        "#3B82F6", // blue-500
        "#06B6D4", // cyan-500
        "#14B8A6", // teal-500
        "#10B981", // emerald-500
    ],
    corporate: [
        "#1E40AF", // blue-800
        "#166534", // green-800
        "#92400E", // amber-800
        "#991B1B", // red-800
        "#5B21B6", // violet-800
        "#9D174D", // pink-800
        "#155E75", // cyan-800
        "#3F6212", // lime-800
    ],
};
