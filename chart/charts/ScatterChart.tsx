import React, { memo, useMemo } from "react";
import { BaseChart } from "./BaseChart";
import { useChartOptions } from "./hooks/useChartOptions";
import type { BubbleChartProps, ScatterChartProps } from "./types";
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
// BUBBLE CHART
// ============================================================================

function BubbleChartComponent({
    datasets,
    xAxisLabel,
    yAxisLabel,
    showGrid = true,
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
}: BubbleChartProps) {
    // Processa datasets com cores
    const chartData = useMemo<ChartData<"bubble">>(() => {
        const processedDatasets = datasets.map((dataset, index) => {
            const baseColor = colors?.[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return {
                ...dataset,
                backgroundColor: dataset.backgroundColor || withAlpha(baseColor, 0.6),
                borderColor: dataset.borderColor || baseColor,
                borderWidth: 2,
            };
        });

        return {
            datasets: processedDatasets,
        };
    }, [datasets, colors]);

    // Opções extras para bubble
    const bubbleOptions = useMemo(() => ({
        scales: {
            x: {
                grid: { display: showGrid, color: "rgba(0, 0, 0, 0.05)" },
                title: xAxisLabel ? { display: true, text: xAxisLabel } : { display: false },
            },
            y: {
                grid: { display: showGrid, color: "rgba(0, 0, 0, 0.05)" },
                title: yAxisLabel ? { display: true, text: yAxisLabel } : { display: false },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const point = context.raw;
                        return `${context.dataset.label}: (${point.x}, ${point.y}) r=${point.r}`;
                    },
                },
            },
        },
        ...chartOptions,
    }), [showGrid, xAxisLabel, yAxisLabel, chartOptions]);

    // Opções do gráfico
    const options = useChartOptions({
        type: "bubble",
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
        extraOptions: bubbleOptions,
    });

    return (
        <BaseChart
            type="bubble"
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

export const BubbleChart = memo(BubbleChartComponent);
BubbleChart.displayName = "BubbleChart";

// ============================================================================
// SCATTER CHART
// ============================================================================

function ScatterChartComponent({
    datasets,
    xAxisLabel,
    yAxisLabel,
    showGrid = true,
    showTrendline = false,
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
    plugins: userPlugins,
}: ScatterChartProps) {
    // Calcula linha de tendência
    const trendlineData = useMemo(() => {
        if (!showTrendline || datasets.length === 0) return null;

        // Usa primeiro dataset para trendline
        const data = datasets[0].data;
        if (data.length < 2) return null;

        // Regressão linear simples
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        data.forEach((point) => {
            sumX += point.x;
            sumY += point.y;
            sumXY += point.x * point.y;
            sumX2 += point.x * point.x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const minX = Math.min(...data.map((p) => p.x));
        const maxX = Math.max(...data.map((p) => p.x));

        return {
            label: "Tendência",
            data: [
                { x: minX, y: slope * minX + intercept },
                { x: maxX, y: slope * maxX + intercept },
            ],
            type: "line" as const,
            borderColor: "#9CA3AF",
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
        };
    }, [showTrendline, datasets]);

    // Processa datasets com cores
    const chartData = useMemo<ChartData<"scatter">>(() => {
        const processedDatasets = datasets.map((dataset, index) => {
            const baseColor = colors?.[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return {
                ...dataset,
                backgroundColor: dataset.backgroundColor || baseColor,
                borderColor: dataset.borderColor || baseColor,
                pointRadius: dataset.pointRadius ?? 6,
                pointHoverRadius: (dataset.pointRadius ?? 6) + 2,
            };
        });

        // Adiciona trendline se existir
        if (trendlineData) {
            processedDatasets.push(trendlineData as any);
        }

        return {
            datasets: processedDatasets,
        };
    }, [datasets, colors, trendlineData]);

    // Opções extras para scatter
    const scatterOptions = useMemo(() => ({
        scales: {
            x: {
                type: "linear" as const,
                position: "bottom" as const,
                grid: { display: showGrid, color: "rgba(0, 0, 0, 0.05)" },
                title: xAxisLabel ? { display: true, text: xAxisLabel } : { display: false },
            },
            y: {
                grid: { display: showGrid, color: "rgba(0, 0, 0, 0.05)" },
                title: yAxisLabel ? { display: true, text: yAxisLabel } : { display: false },
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const point = context.raw;
                        return `${context.dataset.label}: (${point.x}, ${point.y})`;
                    },
                },
            },
        },
        ...chartOptions,
    }), [showGrid, xAxisLabel, yAxisLabel, chartOptions]);

    // Opções do gráfico
    const options = useChartOptions({
        type: "scatter",
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
        extraOptions: scatterOptions,
    });

    return (
        <BaseChart
            type="scatter"
            data={chartData}
            options={options}
            width={width}
            height={height}
            className={className}
            style={style}
            loading={loading}
            error={error}
            id={id}
            plugins={userPlugins}
        />
    );
}

export const ScatterChart = memo(ScatterChartComponent);
ScatterChart.displayName = "ScatterChart";
