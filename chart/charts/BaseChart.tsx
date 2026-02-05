import React, { memo, useRef, useEffect, useMemo, useCallback } from "react";
import { Chart } from "primereact/chart";
import { classNames } from "primereact/utils";
import type { ChartData, ChartOptions, ChartType } from "chart.js";

// ============================================================================
// TYPES
// ============================================================================

export interface BaseChartProps<T extends ChartType = ChartType> {
    /** Tipo do gráfico */
    type: T;

    /** Dados do gráfico */
    data: ChartData<T>;

    /** Opções do gráfico */
    options: ChartOptions;

    /** Largura */
    width?: string | number;

    /** Altura */
    height?: string | number;

    /** Classes CSS */
    className?: string;

    /** Estilo inline */
    style?: React.CSSProperties;

    /** Estado de loading */
    loading?: boolean;

    /** Componente de loading customizado */
    loadingComponent?: React.ReactNode;

    /** Mensagem de erro */
    error?: string;

    /** Componente de erro customizado */
    errorComponent?: React.ReactNode;

    /** Plugins do Chart.js */
    plugins?: any[];

    /** ID único */
    id?: string;

    /** Callback quando o gráfico é renderizado */
    onRender?: (chart: any) => void;
}

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const DefaultLoading = memo(() => (
    <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Carregando gráfico...</span>
        </div>
    </div>
));

DefaultLoading.displayName = "DefaultLoading";

// ============================================================================
// ERROR COMPONENT
// ============================================================================

interface DefaultErrorProps {
    message: string;
}

const DefaultError = memo<DefaultErrorProps>(({ message }) => (
    <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="flex flex-col items-center gap-3 text-center px-4">
            <i className="pi pi-exclamation-triangle text-4xl text-red-500" />
            <span className="text-sm text-red-600">{message}</span>
        </div>
    </div>
));

DefaultError.displayName = "DefaultError";

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

const EmptyState = memo(() => (
    <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="flex flex-col items-center gap-3 text-center px-4">
            <i className="pi pi-chart-bar text-4xl text-gray-300" />
            <span className="text-sm text-gray-500">Nenhum dado disponível</span>
        </div>
    </div>
));

EmptyState.displayName = "EmptyState";

// ============================================================================
// COMPONENT
// ============================================================================

function BaseChartComponent<T extends ChartType = ChartType>({
    type,
    data,
    options,
    width,
    height,
    className,
    style,
    loading = false,
    loadingComponent,
    error,
    errorComponent,
    plugins,
    id,
    onRender,
}: BaseChartProps<T>) {
    const chartRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Callback de render estável
    const onRenderRef = useRef(onRender);
    onRenderRef.current = onRender;

    // Verifica se tem dados
    const hasData = useMemo(() => {
        if (!data?.datasets) return false;
        return data.datasets.some((ds) => {
            if (!ds.data) return false;
            return Array.isArray(ds.data) && ds.data.length > 0;
        });
    }, [data]);

    // Estilos computados
    const containerStyle = useMemo<React.CSSProperties>(
        () => ({
            width: typeof width === "number" ? `${width}px` : width,
            height: typeof height === "number" ? `${height}px` : height,
            ...style,
        }),
        [width, height, style]
    );

    // Effect para callback de render
    useEffect(() => {
        if (chartRef.current && onRenderRef.current) {
            const chart = chartRef.current.getChart?.();
            if (chart) {
                onRenderRef.current(chart);
            }
        }
    }, [data, options]);

    // Render loading
    if (loading) {
        return (
            <div
                ref={containerRef}
                className={classNames("chart-container", className)}
                style={containerStyle}
            >
                {loadingComponent || <DefaultLoading />}
            </div>
        );
    }

    // Render error
    if (error) {
        return (
            <div
                ref={containerRef}
                className={classNames("chart-container", className)}
                style={containerStyle}
            >
                {errorComponent || <DefaultError message={error} />}
            </div>
        );
    }

    // Render empty
    if (!hasData) {
        return (
            <div
                ref={containerRef}
                className={classNames("chart-container", className)}
                style={containerStyle}
            >
                <EmptyState />
            </div>
        );
    }

    // Render chart
    return (
        <div
            ref={containerRef}
            className={classNames("chart-container", className)}
            style={containerStyle}
        >
            <Chart
                ref={chartRef}
                type={type}
                data={data as any}
                options={options}
                plugins={plugins}
                id={id}
            />
        </div>
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const BaseChart = memo(BaseChartComponent) as typeof BaseChartComponent;
BaseChart.displayName = "BaseChart";
