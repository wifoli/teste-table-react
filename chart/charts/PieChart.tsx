import React, { memo, useMemo } from "react";
import { BaseChart } from "./BaseChart";
import { useSliceChartData } from "./hooks/useChartData";
import { useChartOptions } from "./hooks/useChartOptions";
import type { PieChartProps, DoughnutChartProps } from "./types";
import type { ChartOptions, Plugin } from "chart.js";

// ============================================================================
// PIE CHART
// ============================================================================

function PieChartComponent({
    labels,
    data,
    showValues = false,
    valueFormat = "value",
    borderWidth = 2,
    borderColor = "#ffffff",
    hoverOffset = 8,
    rotation = 0,
    circumference = 360,
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
    plugins: userPlugins,
}: PieChartProps) {
    // Dados do gráfico
    const chartData = useSliceChartData(labels, data, colorPalette, colors);

    // Aplica configurações extras aos datasets
    const processedData = useMemo(() => {
        return {
            ...chartData,
            datasets: chartData.datasets.map((ds) => ({
                ...ds,
                borderWidth,
                borderColor,
                hoverOffset,
            })),
        };
    }, [chartData, borderWidth, borderColor, hoverOffset]);

    // Plugin para mostrar valores
    const dataLabelsPlugin = useMemo<Plugin<"pie"> | null>(() => {
        if (!showValues) return null;

        return {
            id: "pieDataLabels",
            afterDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.hidden) {
                        meta.data.forEach((element, index) => {
                            const value = dataset.data[index] as number;
                            const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);

                            let text = "";
                            if (valueFormat === "value") text = String(value);
                            else if (valueFormat === "percent") text = `${percentage}%`;
                            else text = `${value} (${percentage}%)`;

                            const position = element.tooltipPosition(false);

                            ctx.fillStyle = "#ffffff";
                            ctx.font = "bold 12px sans-serif";
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillText(text, position.x, position.y);
                        });
                    }
                });
            },
        };
    }, [showValues, valueFormat]);

    // Opções do gráfico
    const options = useChartOptions({
        type: "pie",
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
        extraOptions: {
            rotation,
            circumference,
            ...chartOptions,
        },
    });

    // Combina plugins
    const allPlugins = useMemo(() => {
        const plugins: any[] = [];
        if (dataLabelsPlugin) plugins.push(dataLabelsPlugin);
        if (userPlugins) plugins.push(...userPlugins);
        return plugins;
    }, [dataLabelsPlugin, userPlugins]);

    return (
        <BaseChart
            type="pie"
            data={processedData as any}
            options={options}
            width={width}
            height={height}
            className={className}
            style={style}
            loading={loading}
            error={error}
            id={id}
            plugins={allPlugins}
        />
    );
}

export const PieChart = memo(PieChartComponent);
PieChart.displayName = "PieChart";

// ============================================================================
// DOUGHNUT CHART
// ============================================================================

function DoughnutChartComponent({
    labels,
    data,
    cutout = "60%",
    centerText,
    centerSubtext,
    showValues = false,
    valueFormat = "value",
    borderWidth = 2,
    borderColor = "#ffffff",
    hoverOffset = 8,
    rotation = 0,
    circumference = 360,
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
    plugins: userPlugins,
}: DoughnutChartProps) {
    // Dados do gráfico
    const chartData = useSliceChartData(labels, data, colorPalette, colors);

    // Aplica configurações extras aos datasets
    const processedData = useMemo(() => {
        return {
            ...chartData,
            datasets: chartData.datasets.map((ds) => ({
                ...ds,
                borderWidth,
                borderColor,
                hoverOffset,
                cutout,
            })),
        };
    }, [chartData, borderWidth, borderColor, hoverOffset, cutout]);

    // Plugin para texto central
    const centerTextPlugin = useMemo<Plugin<"doughnut"> | null>(() => {
        if (!centerText) return null;

        return {
            id: "doughnutCenterText",
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const { width, height } = chart;

                ctx.restore();

                // Texto principal
                ctx.font = "bold 24px sans-serif";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillStyle = "#1F2937";
                ctx.fillText(centerText, width / 2, centerSubtext ? height / 2 - 10 : height / 2);

                // Subtexto
                if (centerSubtext) {
                    ctx.font = "14px sans-serif";
                    ctx.fillStyle = "#6B7280";
                    ctx.fillText(centerSubtext, width / 2, height / 2 + 15);
                }

                ctx.save();
            },
        };
    }, [centerText, centerSubtext]);

    // Plugin para mostrar valores nas fatias
    const dataLabelsPlugin = useMemo<Plugin<"doughnut"> | null>(() => {
        if (!showValues) return null;

        return {
            id: "doughnutDataLabels",
            afterDatasetsDraw: (chart) => {
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.hidden) {
                        meta.data.forEach((element, index) => {
                            const value = dataset.data[index] as number;
                            const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);

                            let text = "";
                            if (valueFormat === "value") text = String(value);
                            else if (valueFormat === "percent") text = `${percentage}%`;
                            else text = `${value} (${percentage}%)`;

                            const position = element.tooltipPosition(false);

                            ctx.fillStyle = "#ffffff";
                            ctx.font = "bold 11px sans-serif";
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillText(text, position.x, position.y);
                        });
                    }
                });
            },
        };
    }, [showValues, valueFormat]);

    // Opções do gráfico
    const options = useChartOptions({
        type: "doughnut",
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
        extraOptions: {
            rotation,
            circumference,
            cutout,
            ...chartOptions,
        },
    });

    // Combina plugins
    const allPlugins = useMemo(() => {
        const plugins: any[] = [];
        if (centerTextPlugin) plugins.push(centerTextPlugin);
        if (dataLabelsPlugin) plugins.push(dataLabelsPlugin);
        if (userPlugins) plugins.push(...userPlugins);
        return plugins;
    }, [centerTextPlugin, dataLabelsPlugin, userPlugins]);

    return (
        <BaseChart
            type="doughnut"
            data={processedData as any}
            options={options}
            width={width}
            height={height}
            className={className}
            style={style}
            loading={loading}
            error={error}
            id={id}
            plugins={allPlugins}
        />
    );
}

export const DoughnutChart = memo(DoughnutChartComponent);
DoughnutChart.displayName = "DoughnutChart";
