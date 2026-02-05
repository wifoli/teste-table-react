// ============================================================================
// CHART COMPONENTS
// ============================================================================

export { BaseChart } from "./BaseChart";
export type { BaseChartProps } from "./BaseChart";

export { LineChart } from "./LineChart";
export { BarChart } from "./BarChart";
export { PieChart, DoughnutChart } from "./PieChart";
export { RadarChart, PolarAreaChart } from "./RadarChart";
export { BubbleChart, ScatterChart } from "./ScatterChart";
export { ComboChart } from "./ComboChart";

// Special Charts (não nativos do Chart.js)
export { GaugeChart } from "./GaugeChart";
export type { GaugeChartProps } from "./GaugeChart";

export { FunnelChart } from "./FunnelChart";
export type { FunnelChartProps, FunnelChartItem } from "./FunnelChart";

export { TreemapChart } from "./TreemapChart";
export type { TreemapChartProps, TreemapItem } from "./TreemapChart";

// ============================================================================
// HOOKS
// ============================================================================

export {
    useChartData,
    useSliceChartData,
    useSeriesChartData,
} from "./hooks/useChartData";

export {
    useChartOptions,
    useLineChartOptions,
    useBarChartOptions,
} from "./hooks/useChartOptions";

// ============================================================================
// TYPES
// ============================================================================

export type {
    // Base types
    SupportedChartType,
    ColorPalette,
    LegendPosition,
    TooltipFormat,
    BaseChartProps as ChartBaseProps,
    
    // Data types
    DataPoint,
    ChartDataset,
    BubbleDataPoint,
    BubbleDataset,
    ScatterDataPoint,
    ScatterDataset,
    
    // Chart props
    LineChartProps,
    BarChartProps,
    PieChartProps,
    DoughnutChartProps,
    RadarChartProps,
    PolarAreaChartProps,
    BubbleChartProps,
    ScatterChartProps,
    ComboChartProps,
    
    // Hook types
    UseChartDataOptions,
    UseChartOptionsOptions,
    
    // Color palettes
    COLOR_PALETTES,
} from "./types";
