import { useMemo, useRef, useCallback } from "react";
import type { ChartOptions, TooltipItem } from "chart.js";
import type {
    SupportedChartType,
    LegendPosition,
    TooltipFormat,
    UseChartOptionsOptions,
} from "../types";

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Formata valor para tooltip
 */
function formatTooltipValue(
    value: number,
    format: TooltipFormat,
    customFormatter?: (value: number, label: string, datasetLabel?: string) => string,
    label?: string,
    datasetLabel?: string
): string {
    if (customFormatter) {
        return customFormatter(value, label || "", datasetLabel);
    }

    switch (format) {
        case "currency":
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(value);

        case "percent":
            return new Intl.NumberFormat("pt-BR", {
                style: "percent",
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            }).format(value / 100);

        case "number":
            return new Intl.NumberFormat("pt-BR").format(value);

        default:
            return String(value);
    }
}

/**
 * Obtém configuração de legenda baseado na posição
 */
function getLegendConfig(position: LegendPosition, show: boolean) {
    if (!show || position === "none") {
        return { display: false };
    }

    return {
        display: true,
        position: position as "top" | "bottom" | "left" | "right",
        labels: {
            usePointStyle: true,
            padding: 16,
            font: {
                size: 12,
            },
        },
    };
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook para criar e memoizar opções do gráfico
 * Evita recriação desnecessária do objeto ChartOptions
 */
export function useChartOptions(options: UseChartOptionsOptions): ChartOptions {
    const {
        type,
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
        onClick,
        onHover,
        extraOptions = {},
    } = options;

    // Refs para callbacks estáveis
    const callbacksRef = useRef({ onClick, onHover, tooltipFormatter });
    callbacksRef.current = { onClick, onHover, tooltipFormatter };

    // Handler de click estável
    const handleClick = useCallback(
        (event: any, elements: any[], chart: any) => {
            if (elements.length > 0 && callbacksRef.current.onClick) {
                const element = elements[0];
                const datasetIndex = element.datasetIndex;
                const index = element.index;
                const value = chart.data.datasets[datasetIndex].data[index];

                callbacksRef.current.onClick({
                    datasetIndex,
                    index,
                    value: typeof value === "number" ? value : 0,
                });
            }
        },
        []
    );

    // Handler de hover estável
    const handleHover = useCallback(
        (event: any, elements: any[], chart: any) => {
            if (callbacksRef.current.onHover) {
                if (elements.length > 0) {
                    const element = elements[0];
                    const datasetIndex = element.datasetIndex;
                    const index = element.index;
                    const value = chart.data.datasets[datasetIndex].data[index];

                    callbacksRef.current.onHover({
                        datasetIndex,
                        index,
                        value: typeof value === "number" ? value : 0,
                    });
                } else {
                    callbacksRef.current.onHover(null);
                }
            }
        },
        []
    );

    return useMemo<ChartOptions>(() => {
        // Configuração base
        const baseOptions: ChartOptions = {
            responsive,
            maintainAspectRatio,
            aspectRatio,

            animation: animated
                ? {
                      duration: animationDuration,
                      easing: "easeOutQuart",
                  }
                : false,

            plugins: {
                legend: getLegendConfig(legendPosition, showLegend),

                title: title
                    ? {
                          display: true,
                          text: title,
                          font: {
                              size: 16,
                              weight: "bold" as const,
                          },
                          padding: { bottom: subtitle ? 4 : 16 },
                      }
                    : { display: false },

                subtitle: subtitle
                    ? {
                          display: true,
                          text: subtitle,
                          font: {
                              size: 12,
                          },
                          color: "#6B7280",
                          padding: { bottom: 16 },
                      }
                    : { display: false },

                tooltip: {
                    enabled: true,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleFont: { size: 13 },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context: TooltipItem<any>) => {
                            const value = context.parsed?.y ?? context.parsed ?? context.raw;
                            const numValue = typeof value === "number" ? value : 0;

                            return formatTooltipValue(
                                numValue,
                                tooltipFormat,
                                callbacksRef.current.tooltipFormatter,
                                context.label,
                                context.dataset?.label
                            );
                        },
                    },
                },
            },

            interaction: {
                intersect: false,
                mode: "index" as const,
            },

            onClick: onClick ? handleClick : undefined,
            onHover: onHover ? handleHover : undefined,
        };

        // Configurações específicas por tipo
        const typeSpecificOptions = getTypeSpecificOptions(type);

        // Merge com opções extras
        return deepMerge(baseOptions, typeSpecificOptions, extraOptions) as ChartOptions;
    }, [
        type,
        legendPosition,
        showLegend,
        title,
        subtitle,
        tooltipFormat,
        animated,
        animationDuration,
        responsive,
        maintainAspectRatio,
        aspectRatio,
        onClick,
        onHover,
        handleClick,
        handleHover,
        extraOptions,
    ]);
}

/**
 * Obtém opções específicas para cada tipo de gráfico
 */
function getTypeSpecificOptions(type: SupportedChartType): Partial<ChartOptions> {
    switch (type) {
        case "line":
        case "bar":
        case "combo":
            return {
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: { size: 11 },
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                        },
                        ticks: {
                            font: { size: 11 },
                        },
                        beginAtZero: true,
                    },
                },
            };

        case "pie":
        case "doughnut":
            return {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context: TooltipItem<any>) => {
                                const value = context.raw as number;
                                const total = (context.dataset.data as number[]).reduce(
                                    (a, b) => a + b,
                                    0
                                );
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value} (${percentage}%)`;
                            },
                        },
                    },
                },
            };

        case "radar":
            return {
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 20,
                            font: { size: 10 },
                        },
                        pointLabels: {
                            font: { size: 11 },
                        },
                    },
                },
            };

        case "polarArea":
            return {
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            display: false,
                        },
                    },
                },
            };

        case "bubble":
        case "scatter":
            return {
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0, 0, 0, 0.05)",
                        },
                        beginAtZero: true,
                    },
                },
            };

        default:
            return {};
    }
}

/**
 * Deep merge de objetos
 */
function deepMerge<T extends object>(...objects: Partial<T>[]): T {
    const result: any = {};

    for (const obj of objects) {
        if (!obj) continue;

        for (const key of Object.keys(obj)) {
            const value = (obj as any)[key];

            if (value && typeof value === "object" && !Array.isArray(value)) {
                result[key] = deepMerge(result[key] || {}, value);
            } else if (value !== undefined) {
                result[key] = value;
            }
        }
    }

    return result;
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook para opções de gráfico de linha
 */
export function useLineChartOptions(
    options: Omit<UseChartOptionsOptions, "type"> & {
        showGrid?: boolean;
        beginAtZero?: boolean;
        yAxisLabel?: string;
        xAxisLabel?: string;
    }
): ChartOptions {
    const { showGrid = true, beginAtZero = true, yAxisLabel, xAxisLabel, ...rest } = options;

    const extraOptions: Partial<ChartOptions> = useMemo(
        () => ({
            scales: {
                x: {
                    grid: { display: showGrid },
                    title: xAxisLabel
                        ? { display: true, text: xAxisLabel }
                        : { display: false },
                },
                y: {
                    grid: { display: showGrid },
                    beginAtZero,
                    title: yAxisLabel
                        ? { display: true, text: yAxisLabel }
                        : { display: false },
                },
            },
        }),
        [showGrid, beginAtZero, yAxisLabel, xAxisLabel]
    );

    return useChartOptions({
        ...rest,
        type: "line",
        extraOptions: deepMerge(extraOptions, rest.extraOptions || {}),
    });
}

/**
 * Hook para opções de gráfico de barra
 */
export function useBarChartOptions(
    options: Omit<UseChartOptionsOptions, "type"> & {
        horizontal?: boolean;
        stacked?: boolean;
        showGrid?: boolean;
        beginAtZero?: boolean;
        yAxisLabel?: string;
        xAxisLabel?: string;
    }
): ChartOptions {
    const {
        horizontal = false,
        stacked = false,
        showGrid = true,
        beginAtZero = true,
        yAxisLabel,
        xAxisLabel,
        ...rest
    } = options;

    const extraOptions: Partial<ChartOptions> = useMemo(
        () => ({
            indexAxis: horizontal ? ("y" as const) : ("x" as const),
            scales: {
                x: {
                    grid: { display: showGrid },
                    stacked,
                    title: xAxisLabel
                        ? { display: true, text: xAxisLabel }
                        : { display: false },
                },
                y: {
                    grid: { display: showGrid },
                    stacked,
                    beginAtZero,
                    title: yAxisLabel
                        ? { display: true, text: yAxisLabel }
                        : { display: false },
                },
            },
        }),
        [horizontal, stacked, showGrid, beginAtZero, yAxisLabel, xAxisLabel]
    );

    return useChartOptions({
        ...rest,
        type: "bar",
        extraOptions: deepMerge(extraOptions, rest.extraOptions || {}),
    });
}
