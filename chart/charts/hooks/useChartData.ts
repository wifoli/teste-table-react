import { useMemo, useRef } from "react";
import type { ChartData, ChartType } from "chart.js";
import type { ColorPalette, UseChartDataOptions, COLOR_PALETTES } from "../types";

// Import color palettes
const PALETTES: Record<ColorPalette, string[]> = {
    default: [
        "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
        "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
    ],
    pastel: [
        "#93C5FD", "#6EE7B7", "#FCD34D", "#FCA5A5",
        "#C4B5FD", "#F9A8D4", "#67E8F9", "#BEF264",
    ],
    vibrant: [
        "#2563EB", "#059669", "#D97706", "#DC2626",
        "#7C3AED", "#DB2777", "#0891B2", "#65A30D",
    ],
    monochrome: [
        "#1F2937", "#374151", "#4B5563", "#6B7280",
        "#9CA3AF", "#D1D5DB", "#E5E7EB", "#F3F4F6",
    ],
    warm: [
        "#DC2626", "#EA580C", "#D97706", "#CA8A04",
        "#F97316", "#EF4444", "#F59E0B", "#FBBF24",
    ],
    cool: [
        "#2563EB", "#0891B2", "#0D9488", "#059669",
        "#3B82F6", "#06B6D4", "#14B8A6", "#10B981",
    ],
    corporate: [
        "#1E40AF", "#166534", "#92400E", "#991B1B",
        "#5B21B6", "#9D174D", "#155E75", "#3F6212",
    ],
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Gera cor com transparência
 */
function withAlpha(color: string, alpha: number): string {
    // Se já é rgba, substitui o alpha
    if (color.startsWith("rgba")) {
        return color.replace(/[\d.]+\)$/g, `${alpha})`);
    }

    // Se é hex, converte
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Se é rgb, converte para rgba
    if (color.startsWith("rgb(")) {
        return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    }

    return color;
}

/**
 * Obtém cor da paleta ou cores customizadas
 */
function getColor(
    index: number,
    colors?: string[],
    palette: ColorPalette = "default"
): string {
    if (colors && colors[index]) {
        return colors[index];
    }
    const paletteColors = PALETTES[palette];
    return paletteColors[index % paletteColors.length];
}

/**
 * Verifica se dois arrays são iguais (shallow)
 */
function arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => val === b[idx]);
}

/**
 * Compara datasets para memoização
 */
function datasetsEqual(a: any[], b: any[]): boolean {
    if (a.length !== b.length) return false;

    return a.every((dataset, idx) => {
        const other = b[idx];
        if (!other) return false;

        // Compara propriedades principais
        if (dataset.label !== other.label) return false;

        // Compara dados
        if (Array.isArray(dataset.data) && Array.isArray(other.data)) {
            if (!arraysEqual(dataset.data, other.data)) return false;
        }

        return true;
    });
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook para criar e memoizar dados do gráfico
 * Evita recriação desnecessária do objeto ChartData
 */
export function useChartData<T extends ChartType = ChartType>(
    options: UseChartDataOptions<T>
): ChartData<T> {
    const { type, labels = [], datasets, colorPalette = "default", colors } = options;

    // Refs para comparação de mudanças
    const prevLabelsRef = useRef<string[]>([]);
    const prevDatasetsRef = useRef<any[]>([]);
    const prevColorsRef = useRef<string[] | undefined>();
    const prevPaletteRef = useRef<ColorPalette>("default");
    const cachedDataRef = useRef<ChartData<T> | null>(null);

    return useMemo(() => {
        // Verifica se algo mudou
        const labelsChanged = !arraysEqual(labels, prevLabelsRef.current);
        const datasetsChanged = !datasetsEqual(datasets, prevDatasetsRef.current);
        const colorsChanged = colors !== prevColorsRef.current;
        const paletteChanged = colorPalette !== prevPaletteRef.current;

        // Se nada mudou e temos cache, retorna cache
        if (
            !labelsChanged &&
            !datasetsChanged &&
            !colorsChanged &&
            !paletteChanged &&
            cachedDataRef.current
        ) {
            return cachedDataRef.current;
        }

        // Atualiza refs
        prevLabelsRef.current = labels;
        prevDatasetsRef.current = datasets;
        prevColorsRef.current = colors;
        prevPaletteRef.current = colorPalette;

        // Determina se é gráfico de fatias (pie, doughnut, polarArea)
        const isSliceChart = ["pie", "doughnut", "polarArea"].includes(type);

        // Processa datasets
        const processedDatasets = datasets.map((dataset, datasetIndex) => {
            const baseColor = getColor(datasetIndex, colors, colorPalette);

            if (isSliceChart) {
                // Para gráficos de fatias, cada valor tem sua cor
                const data = dataset.data || [];
                return {
                    ...dataset,
                    backgroundColor:
                        dataset.backgroundColor ||
                        data.map((_: any, i: number) => getColor(i, colors, colorPalette)),
                    borderColor: dataset.borderColor || "#ffffff",
                    borderWidth: dataset.borderWidth ?? 2,
                };
            }

            // Para outros gráficos
            return {
                ...dataset,
                backgroundColor:
                    dataset.backgroundColor ||
                    (dataset.fill ? withAlpha(baseColor, 0.2) : baseColor),
                borderColor: dataset.borderColor || baseColor,
                borderWidth: dataset.borderWidth ?? 2,
            };
        });

        const chartData: ChartData<T> = {
            labels,
            datasets: processedDatasets,
        } as ChartData<T>;

        // Salva no cache
        cachedDataRef.current = chartData;

        return chartData;
    }, [type, labels, datasets, colorPalette, colors]);
}

/**
 * Hook simplificado para gráficos de fatias (pie, doughnut, polarArea)
 */
export function useSliceChartData(
    labels: string[],
    data: number[],
    colorPalette: ColorPalette = "default",
    colors?: string[]
): ChartData<"pie" | "doughnut" | "polarArea"> {
    return useChartData({
        type: "pie",
        labels,
        datasets: [{ data }],
        colorPalette,
        colors,
    }) as ChartData<"pie" | "doughnut" | "polarArea">;
}

/**
 * Hook simplificado para gráficos de linha/barra
 */
export function useSeriesChartData(
    type: "line" | "bar",
    labels: string[],
    datasets: Array<{
        label: string;
        data: number[];
        fill?: boolean;
        type?: "line" | "bar";
    }>,
    colorPalette: ColorPalette = "default",
    colors?: string[]
): ChartData<"line" | "bar"> {
    return useChartData({
        type,
        labels,
        datasets,
        colorPalette,
        colors,
    }) as ChartData<"line" | "bar">;
}
