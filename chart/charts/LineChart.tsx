import React, { memo, useMemo } from "react";
import { BaseChart } from "./BaseChart";
import { useChartData } from "./hooks/useChartData";
import { useLineChartOptions } from "./hooks/useChartOptions";
import type { LineChartProps, ChartDataset } from "./types";

// ============================================================================
// COMPONENT
// ============================================================================

function LineChartComponent({
    labels,
    datasets,
    fill = false,
    tension = 0.4,
    showPoints = true,
    pointRadius = 4,
    stepped = false,
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
}: LineChartProps) {
    // Processa datasets com configurações de linha
    const processedDatasets = useMemo(() => {
        return datasets.map((dataset, index): ChartDataset => ({
            ...dataset,
            fill: dataset.fill ?? fill,
            tension: dataset.tension ?? tension,
            pointRadius: showPoints ? pointRadius : 0,
            pointHoverRadius: showPoints ? pointRadius + 2 : 0,
            ...(stepped && { stepped }),
            ...(dualAxis && dataset.yAxisID && { yAxisID: dataset.yAxisID }),
        }));
    }, [datasets, fill, tension, showPoints, pointRadius, stepped, dualAxis]);

    // Dados do gráfico
    const chartData = useChartData({
        type: "line",
        labels,
        datasets: processedDatasets,
        colorPalette,
        colors,
    });

    // Opções extras para dual axis
    const dualAxisOptions = useMemo(() => {
        if (!dualAxis) return {};

        return {
            scales: {
                y: {
                    type: "linear" as const,
                    position: "left" as const,
                    title: yAxisLabel ? { display: true, text: yAxisLabel } : { display: false },
                },
                y2: {
                    type: "linear" as const,
                    position: "right" as const,
                    grid: { drawOnChartArea: false },
                    title: y2AxisLabel ? { display: true, text: y2AxisLabel } : { display: false },
                },
            },
        };
    }, [dualAxis, yAxisLabel, y2AxisLabel]);

    // Opções do gráfico
    const options = useLineChartOptions({
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
        showGrid,
        beginAtZero,
        yAxisLabel: dualAxis ? undefined : yAxisLabel,
        xAxisLabel,
        extraOptions: {
            ...dualAxisOptions,
            ...chartOptions,
        },
    });

    return (
        <BaseChart
            type="line"
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

export const LineChart = memo(LineChartComponent);
LineChart.displayName = "LineChart";
