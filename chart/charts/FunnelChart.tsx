import React, { memo, useMemo } from "react";
import { classNames } from "primereact/utils";
import type { BaseChartProps, ColorPalette } from "./types";

// ============================================================================
// TYPES
// ============================================================================

export interface FunnelChartItem {
    label: string;
    value: number;
    color?: string;
}

export interface FunnelChartProps extends Omit<BaseChartProps, "type" | "data" | "options"> {
    /** Dados do funil */
    data: FunnelChartItem[];

    /** Mostra valores */
    showValues?: boolean;

    /** Mostra porcentagens */
    showPercentages?: boolean;

    /** Mostra taxa de conversão entre etapas */
    showConversionRate?: boolean;

    /** Formato do valor */
    valueFormat?: "number" | "currency" | "compact";

    /** Paleta de cores */
    colorPalette?: ColorPalette;

    /** Cores customizadas */
    colors?: string[];

    /** Direção do funil */
    direction?: "vertical" | "horizontal";

    /** Estilo do funil */
    variant?: "funnel" | "pyramid" | "bars";

    /** Gap entre itens */
    gap?: number;

    /** Callback ao clicar em um item */
    onItemClick?: (item: FunnelChartItem, index: number) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

const DEFAULT_COLORS = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
];

const PALETTES: Record<ColorPalette, string[]> = {
    default: DEFAULT_COLORS,
    pastel: ["#93C5FD", "#6EE7B7", "#FCD34D", "#FCA5A5", "#C4B5FD", "#F9A8D4", "#67E8F9", "#BEF264"],
    vibrant: ["#2563EB", "#059669", "#D97706", "#DC2626", "#7C3AED", "#DB2777", "#0891B2", "#65A30D"],
    monochrome: ["#1F2937", "#374151", "#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB", "#F3F4F6"],
    warm: ["#DC2626", "#EA580C", "#D97706", "#CA8A04", "#F97316", "#EF4444", "#F59E0B", "#FBBF24"],
    cool: ["#2563EB", "#0891B2", "#0D9488", "#059669", "#3B82F6", "#06B6D4", "#14B8A6", "#10B981"],
    corporate: ["#1E40AF", "#166534", "#92400E", "#991B1B", "#5B21B6", "#9D174D", "#155E75", "#3F6212"],
};

function formatValue(value: number, format: FunnelChartProps["valueFormat"]): string {
    switch (format) {
        case "currency":
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
            }).format(value);
        case "compact":
            return new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(value);
        default:
            return new Intl.NumberFormat("pt-BR").format(value);
    }
}

// ============================================================================
// COMPONENT
// ============================================================================

function FunnelChartComponent({
    data,
    showValues = true,
    showPercentages = true,
    showConversionRate = false,
    valueFormat = "number",
    colorPalette = "default",
    colors,
    direction = "vertical",
    variant = "funnel",
    gap = 4,
    onItemClick,
    // Base props
    width,
    height = 300,
    className,
    style,
    title,
    subtitle,
    loading = false,
    error,
}: FunnelChartProps) {
    // Calcula valores máximos e porcentagens
    const processedData = useMemo(() => {
        const maxValue = Math.max(...data.map((d) => d.value));
        const firstValue = data[0]?.value || 1;

        return data.map((item, index) => {
            const palette = colors || PALETTES[colorPalette];
            const prevValue = index > 0 ? data[index - 1].value : item.value;

            return {
                ...item,
                color: item.color || palette[index % palette.length],
                percentage: (item.value / firstValue) * 100,
                widthPercentage: (item.value / maxValue) * 100,
                conversionRate: index > 0 ? (item.value / prevValue) * 100 : 100,
            };
        });
    }, [data, colors, colorPalette]);

    // Container style
    const containerStyle = useMemo<React.CSSProperties>(
        () => ({
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
            ...style,
        }),
        [width, height, style]
    );

    // Loading state
    if (loading) {
        return (
            <div className={classNames("funnel-chart", className)} style={containerStyle}>
                <div className="flex items-center justify-center h-full">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={classNames("funnel-chart", className)} style={containerStyle}>
                <div className="flex items-center justify-center h-full text-red-500">
                    <i className="pi pi-exclamation-triangle mr-2" />
                    {error}
                </div>
            </div>
        );
    }

    // Empty state
    if (data.length === 0) {
        return (
            <div className={classNames("funnel-chart", className)} style={containerStyle}>
                <div className="flex items-center justify-center h-full text-gray-500">
                    Nenhum dado disponível
                </div>
            </div>
        );
    }

    return (
        <div className={classNames("funnel-chart", className)} style={containerStyle}>
            {/* Title */}
            {title && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
            )}

            {/* Funnel Items */}
            <div
                className={classNames("flex", {
                    "flex-col": direction === "vertical",
                    "flex-row items-end h-full": direction === "horizontal",
                })}
                style={{ gap }}
            >
                {processedData.map((item, index) => {
                    const isVertical = direction === "vertical";
                    const isFunnel = variant === "funnel" || variant === "pyramid";

                    // Calcula largura baseado no variant
                    const widthPercent = isFunnel ? item.widthPercentage : 100;

                    return (
                        <div
                            key={index}
                            className={classNames(
                                "funnel-item relative transition-all duration-200",
                                {
                                    "cursor-pointer hover:opacity-80": onItemClick,
                                }
                            )}
                            style={{
                                ...(isVertical
                                    ? {
                                          width: `${widthPercent}%`,
                                          marginLeft: isFunnel ? `${(100 - widthPercent) / 2}%` : 0,
                                          marginRight: isFunnel ? `${(100 - widthPercent) / 2}%` : 0,
                                      }
                                    : {
                                          height: `${widthPercent}%`,
                                          flex: 1,
                                      }),
                            }}
                            onClick={() => onItemClick?.(item, index)}
                        >
                            {/* Bar */}
                            <div
                                className={classNames("rounded transition-all", {
                                    "h-12": isVertical,
                                    "w-full": !isVertical,
                                })}
                                style={{
                                    backgroundColor: item.color,
                                    ...(isVertical
                                        ? { height: "48px" }
                                        : { height: `${item.widthPercentage}%` }),
                                }}
                            />

                            {/* Label & Value */}
                            <div
                                className={classNames(
                                    "flex items-center justify-between px-3 py-1 text-sm",
                                    {
                                        "absolute inset-0": isVertical,
                                        "mt-2 text-center flex-col": !isVertical,
                                    }
                                )}
                            >
                                <span
                                    className={classNames("font-medium truncate", {
                                        "text-white": isVertical,
                                        "text-gray-700": !isVertical,
                                    })}
                                >
                                    {item.label}
                                </span>

                                <div className="flex items-center gap-2">
                                    {showValues && (
                                        <span
                                            className={classNames("font-semibold", {
                                                "text-white": isVertical,
                                                "text-gray-800": !isVertical,
                                            })}
                                        >
                                            {formatValue(item.value, valueFormat)}
                                        </span>
                                    )}

                                    {showPercentages && (
                                        <span
                                            className={classNames("text-xs", {
                                                "text-white/80": isVertical,
                                                "text-gray-500": !isVertical,
                                            })}
                                        >
                                            ({item.percentage.toFixed(1)}%)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Conversion Rate */}
                            {showConversionRate && index > 0 && isVertical && (
                                <div className="absolute -top-3 right-2 text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                    ↓ {item.conversionRate.toFixed(1)}%
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const FunnelChart = memo(FunnelChartComponent);
FunnelChart.displayName = "FunnelChart";
