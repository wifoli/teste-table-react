import React, { memo, useMemo } from "react";
import { BaseChart } from "./BaseChart";
import { useChartData } from "./hooks/useChartData";
import { useBarChartOptions } from "./hooks/useChartOptions";
import type { BarChartProps, ChartDataset } from "./types";

// ============================================================================
// COMPONENT
// ============================================================================

function BarChartComponent({
    labels,
    datasets,
    horizontal = false,
    stacked = false,
    barThickness,
    borderRadius = 4,
    showGrid = true,
    beginAtZero = true,
    yAxisLabel,
    xAxisLabel,
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
}: BarChartProps) {
    // Processa datasets com configurações de barra
    const processedDatasets = useMemo(() => {
        return datasets.map((dataset): ChartDataset => ({
            ...dataset,
            borderRadius,
            ...(barThickness && { barThickness }),
        }));
    }, [datasets, borderRadius, barThickness]);

    // Dados do gráfico
    const chartData = useChartData({
        type: "bar",
        labels,
        datasets: processedDatasets,
        colorPalette,
        colors,
    });

    // Opções do gráfico
    const options = useBarChartOptions({
        horizontal,
        stacked,
        showGrid,
        beginAtZero,
        yAxisLabel,
        xAxisLabel,
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
        extraOptions: chartOptions,
    });

    return (
        <BaseChart
            type="bar"
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

export const BarChart = memo(BarChartComponent);
BarChart.displayName = "BarChart";
