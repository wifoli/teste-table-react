import React, { memo, useMemo, useCallback } from "react";
import { classNames } from "primereact/utils";
import type { BaseChartProps, ColorPalette } from "./types";

// ============================================================================
// TYPES
// ============================================================================

export interface TreemapItem {
    id: string | number;
    label: string;
    value: number;
    color?: string;
    children?: TreemapItem[];
    data?: Record<string, unknown>;
}

export interface TreemapChartProps extends Omit<BaseChartProps, "type" | "data" | "options"> {
    /** Dados do treemap */
    data: TreemapItem[];

    /** Mostra labels */
    showLabels?: boolean;

    /** Mostra valores */
    showValues?: boolean;

    /** Formato do valor */
    valueFormat?: "number" | "currency" | "percent" | "compact";

    /** Paleta de cores */
    colorPalette?: ColorPalette;

    /** Cores customizadas */
    colors?: string[];

    /** Padding entre blocos */
    padding?: number;

    /** Border radius dos blocos */
    borderRadius?: number;

    /** Tamanho mínimo para mostrar label */
    minLabelSize?: number;

    /** Permite navegação em hierarquia */
    drillDown?: boolean;

    /** Callback ao clicar em um item */
    onItemClick?: (item: TreemapItem) => void;

    /** Callback ao hover */
    onItemHover?: (item: TreemapItem | null) => void;

    /** Tooltip customizado */
    renderTooltip?: (item: TreemapItem) => React.ReactNode;
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

function formatValue(value: number, format: TreemapChartProps["valueFormat"], total?: number): string {
    switch (format) {
        case "currency":
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
            }).format(value);
        case "percent":
            const percentage = total ? (value / total) * 100 : value;
            return `${percentage.toFixed(1)}%`;
        case "compact":
            return new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(value);
        default:
            return new Intl.NumberFormat("pt-BR").format(value);
    }
}

// Algoritmo Squarified Treemap simplificado
interface TreemapRect {
    item: TreemapItem;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

function calculateTreemap(
    items: TreemapItem[],
    width: number,
    height: number,
    colors: string[],
    padding: number
): TreemapRect[] {
    if (items.length === 0 || width <= 0 || height <= 0) return [];

    const total = items.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return [];

    const sortedItems = [...items].sort((a, b) => b.value - a.value);
    const rects: TreemapRect[] = [];

    let x = padding;
    let y = padding;
    let remainingWidth = width - padding * 2;
    let remainingHeight = height - padding * 2;
    let remainingItems = [...sortedItems];
    let colorIndex = 0;

    while (remainingItems.length > 0) {
        const isHorizontal = remainingWidth >= remainingHeight;
        const mainSize = isHorizontal ? remainingWidth : remainingHeight;
        const crossSize = isHorizontal ? remainingHeight : remainingWidth;

        // Encontra o melhor conjunto de itens para essa linha/coluna
        const remainingTotal = remainingItems.reduce((sum, item) => sum + item.value, 0);
        let rowItems: TreemapItem[] = [];
        let rowTotal = 0;
        let bestAspectRatio = Infinity;

        for (let i = 0; i < remainingItems.length; i++) {
            const testItems = remainingItems.slice(0, i + 1);
            const testTotal = testItems.reduce((sum, item) => sum + item.value, 0);
            const rowSize = (testTotal / remainingTotal) * mainSize;

            // Calcula aspect ratio médio
            let maxAspect = 0;
            testItems.forEach((item) => {
                const itemSize = (item.value / testTotal) * crossSize;
                const aspect = Math.max(rowSize / itemSize, itemSize / rowSize);
                maxAspect = Math.max(maxAspect, aspect);
            });

            if (maxAspect <= bestAspectRatio) {
                bestAspectRatio = maxAspect;
                rowItems = testItems;
                rowTotal = testTotal;
            } else {
                break;
            }
        }

        // Se não encontrou nenhum item válido, pega o primeiro
        if (rowItems.length === 0) {
            rowItems = [remainingItems[0]];
            rowTotal = remainingItems[0].value;
        }

        // Calcula tamanho da linha
        const rowMainSize = (rowTotal / remainingTotal) * mainSize;

        // Posiciona itens na linha
        let offset = 0;
        rowItems.forEach((item) => {
            const itemCrossSize = (item.value / rowTotal) * crossSize;
            const color = item.color || colors[colorIndex % colors.length];

            rects.push({
                item,
                x: isHorizontal ? x : x + offset,
                y: isHorizontal ? y + offset : y,
                width: isHorizontal ? rowMainSize - padding : itemCrossSize - padding,
                height: isHorizontal ? itemCrossSize - padding : rowMainSize - padding,
                color,
            });

            offset += itemCrossSize;
            colorIndex++;
        });

        // Atualiza área restante
        if (isHorizontal) {
            x += rowMainSize;
            remainingWidth -= rowMainSize;
        } else {
            y += rowMainSize;
            remainingHeight -= rowMainSize;
        }

        remainingItems = remainingItems.slice(rowItems.length);
    }

    return rects;
}

// ============================================================================
// TREEMAP ITEM COMPONENT
// ============================================================================

interface TreemapBlockProps {
    rect: TreemapRect;
    showLabels: boolean;
    showValues: boolean;
    valueFormat: TreemapChartProps["valueFormat"];
    total: number;
    borderRadius: number;
    minLabelSize: number;
    onClick?: (item: TreemapItem) => void;
    onHover?: (item: TreemapItem | null) => void;
    renderTooltip?: (item: TreemapItem) => React.ReactNode;
}

const TreemapBlock = memo<TreemapBlockProps>(({
    rect,
    showLabels,
    showValues,
    valueFormat,
    total,
    borderRadius,
    minLabelSize,
    onClick,
    onHover,
    renderTooltip,
}) => {
    const canShowLabel = rect.width >= minLabelSize && rect.height >= minLabelSize;

    const handleClick = useCallback(() => {
        onClick?.(rect.item);
    }, [onClick, rect.item]);

    const handleMouseEnter = useCallback(() => {
        onHover?.(rect.item);
    }, [onHover, rect.item]);

    const handleMouseLeave = useCallback(() => {
        onHover?.(null);
    }, [onHover]);

    return (
        <div
            className={classNames(
                "absolute transition-all duration-200 overflow-hidden group",
                {
                    "cursor-pointer hover:brightness-110 hover:z-10": onClick,
                }
            )}
            style={{
                left: rect.x,
                top: rect.y,
                width: rect.width,
                height: rect.height,
                backgroundColor: rect.color,
                borderRadius,
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={!renderTooltip ? `${rect.item.label}: ${formatValue(rect.item.value, valueFormat, total)}` : undefined}
        >
            {canShowLabel && (showLabels || showValues) && (
                <div className="absolute inset-0 p-2 flex flex-col justify-center items-center text-white text-center">
                    {showLabels && (
                        <span
                            className="font-medium truncate w-full"
                            style={{ fontSize: Math.min(14, rect.width / 8) }}
                        >
                            {rect.item.label}
                        </span>
                    )}
                    {showValues && (
                        <span
                            className="opacity-90 truncate w-full"
                            style={{ fontSize: Math.min(12, rect.width / 10) }}
                        >
                            {formatValue(rect.item.value, valueFormat, total)}
                        </span>
                    )}
                </div>
            )}

            {/* Tooltip customizado */}
            {renderTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    {renderTooltip(rect.item)}
                </div>
            )}
        </div>
    );
});

TreemapBlock.displayName = "TreemapBlock";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function TreemapChartComponent({
    data,
    showLabels = true,
    showValues = true,
    valueFormat = "number",
    colorPalette = "default",
    colors,
    padding = 2,
    borderRadius = 4,
    minLabelSize = 60,
    drillDown = false,
    onItemClick,
    onItemHover,
    renderTooltip,
    // Base props
    width = "100%",
    height = 400,
    className,
    style,
    title,
    subtitle,
    loading = false,
    error,
}: TreemapChartProps) {
    const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Observe container size
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // Calculate treemap
    const palette = colors || PALETTES[colorPalette];
    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

    const rects = useMemo(() => {
        if (containerSize.width === 0 || containerSize.height === 0) return [];
        return calculateTreemap(data, containerSize.width, containerSize.height, palette, padding);
    }, [data, containerSize.width, containerSize.height, palette, padding]);

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
            <div className={classNames("treemap-chart", className)} style={containerStyle}>
                <div className="flex items-center justify-center h-full">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={classNames("treemap-chart", className)} style={containerStyle}>
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
            <div className={classNames("treemap-chart", className)} style={containerStyle}>
                <div className="flex items-center justify-center h-full text-gray-500">
                    Nenhum dado disponível
                </div>
            </div>
        );
    }

    return (
        <div className={classNames("treemap-chart flex flex-col", className)} style={containerStyle}>
            {/* Title */}
            {title && (
                <div className="mb-4 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
            )}

            {/* Treemap Container */}
            <div ref={containerRef} className="relative flex-1 min-h-0">
                {rects.map((rect, index) => (
                    <TreemapBlock
                        key={rect.item.id ?? index}
                        rect={rect}
                        showLabels={showLabels}
                        showValues={showValues}
                        valueFormat={valueFormat}
                        total={total}
                        borderRadius={borderRadius}
                        minLabelSize={minLabelSize}
                        onClick={onItemClick}
                        onHover={onItemHover}
                        renderTooltip={renderTooltip}
                    />
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const TreemapChart = memo(TreemapChartComponent);
TreemapChart.displayName = "TreemapChart";
