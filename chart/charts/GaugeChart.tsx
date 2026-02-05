import React, { memo, useMemo } from "react";
import { BaseChart } from "./BaseChart";
import { useChartOptions } from "./hooks/useChartOptions";
import type { BaseChartProps } from "./types";
import type { ChartData, Plugin } from "chart.js";

// ============================================================================
// TYPES
// ============================================================================

export interface GaugeChartProps extends Omit<BaseChartProps, "type" | "data" | "options"> {
    /** Valor atual (0-100 por padrão) */
    value: number;

    /** Valor mínimo */
    min?: number;

    /** Valor máximo */
    max?: number;

    /** Label do valor */
    label?: string;

    /** Sufixo do valor (ex: "%", "km/h") */
    suffix?: string;

    /** Cor do valor (ou função para cor dinâmica) */
    color?: string | ((value: number, min: number, max: number) => string);

    /** Cor de fundo */
    backgroundColor?: string;

    /** Espessura do arco (0-100) */
    arcThickness?: number;

    /** Ângulo de início (graus) */
    startAngle?: number;

    /** Ângulo total (graus) */
    sweepAngle?: number;

    /** Mostra valor no centro */
    showValue?: boolean;

    /** Mostra label abaixo do valor */
    showLabel?: boolean;

    /** Formatador do valor */
    valueFormatter?: (value: number) => string;

    /** Segmentos coloridos (para gauge com zonas) */
    segments?: Array<{
        from: number;
        to: number;
        color: string;
    }>;
}

// ============================================================================
// HELPERS
// ============================================================================

function getDefaultColor(value: number, min: number, max: number): string {
    const percentage = ((value - min) / (max - min)) * 100;

    if (percentage < 33) return "#10B981"; // Verde
    if (percentage < 66) return "#F59E0B"; // Amarelo
    return "#EF4444"; // Vermelho
}

// ============================================================================
// COMPONENT
// ============================================================================

function GaugeChartComponent({
    value,
    min = 0,
    max = 100,
    label,
    suffix = "",
    color,
    backgroundColor = "#E5E7EB",
    arcThickness = 20,
    startAngle = -90,
    sweepAngle = 180,
    showValue = true,
    showLabel = true,
    valueFormatter,
    segments,
    // Base props
    width,
    height,
    className,
    style,
    animated = true,
    animationDuration = 400,
    responsive = true,
    maintainAspectRatio = true,
    aspectRatio = 2,
    loading = false,
    error,
    id,
    plugins: userPlugins,
}: GaugeChartProps) {
    // Calcula porcentagem
    const percentage = useMemo(() => {
        const clamped = Math.max(min, Math.min(max, value));
        return ((clamped - min) / (max - min)) * 100;
    }, [value, min, max]);

    // Determina cor
    const gaugeColor = useMemo(() => {
        if (typeof color === "function") {
            return color(value, min, max);
        }
        if (color) return color;
        return getDefaultColor(value, min, max);
    }, [color, value, min, max]);

    // Dados do gráfico
    const chartData = useMemo<ChartData<"doughnut">>(() => {
        const filledValue = (percentage / 100) * sweepAngle;
        const emptyValue = sweepAngle - filledValue;
        const hiddenValue = 360 - sweepAngle;

        // Se tem segmentos, usa cores diferentes
        if (segments && segments.length > 0) {
            const segmentData: number[] = [];
            const segmentColors: string[] = [];

            segments.forEach((segment) => {
                const segmentPercentage =
                    ((Math.min(segment.to, value) - segment.from) / (max - min)) * 100;
                if (segmentPercentage > 0) {
                    segmentData.push((segmentPercentage / 100) * sweepAngle);
                    segmentColors.push(segment.color);
                }
            });

            // Adiciona parte vazia
            const totalFilled = segmentData.reduce((a, b) => a + b, 0);
            if (totalFilled < sweepAngle) {
                segmentData.push(sweepAngle - totalFilled);
                segmentColors.push(backgroundColor);
            }

            // Adiciona parte oculta
            if (hiddenValue > 0) {
                segmentData.push(hiddenValue);
                segmentColors.push("transparent");
            }

            return {
                datasets: [
                    {
                        data: segmentData,
                        backgroundColor: segmentColors,
                        borderWidth: 0,
                        cutout: `${100 - arcThickness}%`,
                    },
                ],
            };
        }

        return {
            datasets: [
                {
                    data: [filledValue, emptyValue, hiddenValue],
                    backgroundColor: [gaugeColor, backgroundColor, "transparent"],
                    borderWidth: 0,
                    cutout: `${100 - arcThickness}%`,
                },
            ],
        };
    }, [percentage, sweepAngle, segments, value, max, min, gaugeColor, backgroundColor, arcThickness]);

    // Plugin para texto central
    const centerTextPlugin = useMemo<Plugin<"doughnut">>(() => ({
        id: "gaugeCenterText",
        afterDraw: (chart) => {
            if (!showValue && !showLabel) return;

            const ctx = chart.ctx;
            const { width, height } = chart;

            ctx.restore();

            const centerX = width / 2;
            const centerY = height * 0.65; // Ajustado para gauge de 180°

            // Valor
            if (showValue) {
                const displayValue = valueFormatter
                    ? valueFormatter(value)
                    : `${Math.round(value)}${suffix}`;

                ctx.font = "bold 28px sans-serif";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillStyle = gaugeColor;
                ctx.fillText(displayValue, centerX, centerY - (showLabel && label ? 12 : 0));
            }

            // Label
            if (showLabel && label) {
                ctx.font = "14px sans-serif";
                ctx.fillStyle = "#6B7280";
                ctx.fillText(label, centerX, centerY + 18);
            }

            ctx.save();
        },
    }), [showValue, showLabel, value, suffix, label, gaugeColor, valueFormatter]);

    // Opções
    const options = useMemo(() => ({
        responsive,
        maintainAspectRatio,
        aspectRatio,
        rotation: startAngle * (Math.PI / 180),
        circumference: sweepAngle,
        animation: animated ? { duration: animationDuration } : false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
    }), [responsive, maintainAspectRatio, aspectRatio, startAngle, sweepAngle, animated, animationDuration]);

    // Plugins
    const allPlugins = useMemo(() => {
        const plugins: any[] = [centerTextPlugin];
        if (userPlugins) plugins.push(...userPlugins);
        return plugins;
    }, [centerTextPlugin, userPlugins]);

    return (
        <BaseChart
            type="doughnut"
            data={chartData}
            options={options as any}
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

// ============================================================================
// EXPORT
// ============================================================================

export const GaugeChart = memo(GaugeChartComponent);
GaugeChart.displayName = "GaugeChart";
