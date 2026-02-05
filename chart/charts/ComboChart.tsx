import React, { memo, useMemo } from "react";
import { BaseChart } from "./BaseChart";
import { useChartOptions } from "./hooks/useChartOptions";
import type { ComboChartProps, ChartDataset } from "./types";
import type { ChartData } from "chart.js";

// ============================================================================
// HELPERS
// ============================================================================

const DEFAULT_COLORS = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
];

function withAlpha(color: string, alpha: number): string {
    if (color.startsWith("#")) {
        const hex = color.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
}

// ============================================================================
// COMBO CHART
// ============================================================================

function ComboChartComponent({
    labels,
    datasets,
    showGrid = true,
    beginAtZero = true,
    yAxisLabel,
    xAxisLabel,
    dualAxis = false,
    y2AxisLabel,
    // Base props
    width,
    height,
    className,
    style,
    colorPalette = "default",
    colors,
    legendPosition = "top",
    showLegend = true,
    title,
    subtitle,
    tooltipFormat = "default",
    tooltipFormatter,
    animated = true,
    animationDuration = 400,
    responsive = true,
    maintainAspectRatio = true,
    aspectRatio = 2,
    loading = false,
    error,
    onClick,
    onHover,
    chartOptions,
    id,
    plugins,
}: ComboChartProps) {
    // Processa datasets com cores e configurações por tipo
    const chartData = useMemo<ChartData<"bar">>(() => {
        const processedDatasets = datasets.map((dataset, index) => {
            const baseColor = colors?.[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            const isLine = dataset.type === "line";

            return {
                ...dataset,
                type: dataset.type,
                backgroundColor: dataset.backgroundColor || 
                    (isLine && dataset.fill ? withAlpha(baseColor, 0.2) : baseColor),
                borderColor: dataset.borderColor || baseColor,
                borderWidth: dataset.borderWidth ?? 2,
                // Configurações específicas de linha
                ...(isLine && {
                    tension: dataset.tension ?? 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: dataset.fill ?? false,
                }),
                // Configurações específicas de barra
                ...(!isLine && {
                    borderRadius: 4,
                }),
                // Ordem (linhas na frente)
                order: dataset.order ?? (isLine ? 0 : 1),
                // Axis ID para dual axis
                ...(dualAxis && dataset.yAxisID && { yAxisID: dataset.yAxisID }),
            };
        });

        return {
            labels,
            datasets: processedDatasets,
        };
    }, [labels, datasets, colors, dualAxis]);

    // Opções extras para combo
    const comboOptions = useMemo(() => {
        const scales: any = {
            x: {
                grid: { display: showGrid, color: "rgba(0, 0, 0, 0.05)" },
                title: xAxisLabel ? { display: true, text: xAxisLabel } : { display: false },
            },
            y: {
                type: "linear" as const,
                position: "left" as const,
                grid: { display: showGrid, color: "rgba(0, 0, 0, 0.05)" },
                beginAtZero,
                title: yAxisLabel ? { display: true, text: yAxisLabel } : { display: false },
            },
        };

        // Adiciona segundo eixo Y se necessário
        if (dualAxis) {
            scales.y2 = {
                type: "linear" as const,
                position: "right" as const,
                grid: { drawOnChartArea: false },
                beginAtZero,
                title: y2AxisLabel ? { display: true, text: y2AxisLabel } : { display: false },
            };
        }

        return {
            scales,
            ...chartOptions,
        };
    }, [showGrid, beginAtZero, yAxisLabel, xAxisLabel, dualAxis, y2AxisLabel, chartOptions]);

    // Opções do gráfico
    const options = useChartOptions({
        type: "combo",
        legendPosition,
        showLegend,
        title,
        subtitle,
        tooltipFormat,
        tooltipFormatter,
        animated,
        animationDuration,
        responsive,
        maintainAspectRatio,
        aspectRatio,
        onClick,
        onHover,
        extraOptions: comboOptions,
    });

    return (
        <BaseChart
            type="bar" // Chart.js usa 'bar' como base para mixed charts
            data={chartData}
            options={options}
            width={width}
            height={height}
            className={className}
            style={style}
            loading={loading}
            error={error}
            id={id}
            plugins={plugins}
        />
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const ComboChart = memo(ComboChartComponent);
ComboChart.displayName = "ComboChart";
