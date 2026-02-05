import React, { memo, useMemo } from "react";
import { BaseChart } from "./BaseChart";
import { useChartData, useSliceChartData } from "./hooks/useChartData";
import { useChartOptions } from "./hooks/useChartOptions";
import type { RadarChartProps, PolarAreaChartProps, ChartDataset } from "./types";

// ============================================================================
// RADAR CHART
// ============================================================================

function RadarChartComponent({
    labels,
    datasets,
    fill = true,
    showScale = true,
    showGridLines = true,
    suggestedMin,
    suggestedMax,
    stepSize,
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
    aspectRatio = 1,
    loading = false,
    error,
    onClick,
    onHover,
    chartOptions,
    id,
    plugins,
}: RadarChartProps) {
    // Processa datasets com fill
    const processedDatasets = useMemo(() => {
        return datasets.map((dataset): ChartDataset => ({
            ...dataset,
            fill: dataset.fill ?? fill,
        }));
    }, [datasets, fill]);

    // Dados do gráfico
    const chartData = useChartData({
        type: "radar",
        labels,
        datasets: processedDatasets,
        colorPalette,
        colors,
    });

    // Opções extras para radar
    const radarOptions = useMemo(() => ({
        scales: {
            r: {
                display: showScale,
                beginAtZero: true,
                ...(suggestedMin !== undefined && { suggestedMin }),
                ...(suggestedMax !== undefined && { suggestedMax }),
                grid: {
                    display: showGridLines,
                    color: "rgba(0, 0, 0, 0.1)",
                },
                angleLines: {
                    display: showGridLines,
                    color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                    ...(stepSize && { stepSize }),
                    backdropColor: "transparent",
                    font: { size: 10 },
                },
                pointLabels: {
                    font: { size: 12 },
                    color: "#374151",
                },
            },
        },
        ...chartOptions,
    }), [showScale, showGridLines, suggestedMin, suggestedMax, stepSize, chartOptions]);

    // Opções do gráfico
    const options = useChartOptions({
        type: "radar",
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
        extraOptions: radarOptions,
    });

    return (
        <BaseChart
            type="radar"
            data={chartData as any}
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

export const RadarChart = memo(RadarChartComponent);
RadarChart.displayName = "RadarChart";

// ============================================================================
// POLAR AREA CHART
// ============================================================================

function PolarAreaChartComponent({
    labels,
    data,
    startFromTop = true,
    showScale = true,
    borderWidth = 2,
    // Base props
    width,
    height,
    className,
    style,
    colorPalette = "default",
    colors,
    legendPosition = "right",
    showLegend = true,
    title,
    subtitle,
    tooltipFormat = "default",
    tooltipFormatter,
    animated = true,
    animationDuration = 400,
    responsive = true,
    maintainAspectRatio = true,
    aspectRatio = 1,
    loading = false,
    error,
    onClick,
    onHover,
    chartOptions,
    id,
    plugins,
}: PolarAreaChartProps) {
    // Dados do gráfico
    const chartData = useSliceChartData(labels, data, colorPalette, colors);

    // Processa dados com configurações
    const processedData = useMemo(() => ({
        ...chartData,
        datasets: chartData.datasets.map((ds) => ({
            ...ds,
            borderWidth,
            borderColor: "#ffffff",
        })),
    }), [chartData, borderWidth]);

    // Opções extras para polar area
    const polarOptions = useMemo(() => ({
        startAngle: startFromTop ? -90 : 0,
        scales: {
            r: {
                display: showScale,
                beginAtZero: true,
                ticks: {
                    display: false,
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
            },
        },
        ...chartOptions,
    }), [startFromTop, showScale, chartOptions]);

    // Opções do gráfico
    const options = useChartOptions({
        type: "polarArea",
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
        extraOptions: polarOptions,
    });

    return (
        <BaseChart
            type="polarArea"
            data={processedData as any}
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

export const PolarAreaChart = memo(PolarAreaChartComponent);
PolarAreaChart.displayName = "PolarAreaChart";
