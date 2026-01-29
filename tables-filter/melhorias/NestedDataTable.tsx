import { useState, useCallback, memo, useRef, useMemo } from "react";
import { DataTable as PrimeDataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
import { DataTable, DataTableColumn } from "./DataTable";

// ============================================================================
// TYPES
// ============================================================================

interface NestedDataTableProps<
    TParent extends Record<string, any>,
    TChild extends Record<string, any>
> {
    data: TParent[];
    columns: DataTableColumn<TParent>[];
    nestedField: keyof TParent;
    nestedColumns: DataTableColumn<TChild>[];
    dataKey?: keyof TParent;
    loading?: boolean;
    emptyMessage?: string;
    nestedEmptyMessage?: string;
    className?: string;
    striped?: boolean;
    gridLines?: boolean;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface NestedContentProps<TChild extends Record<string, any>> {
    nestedData: TChild[] | undefined;
    nestedColumns: DataTableColumn<TChild>[];
    emptyMessage: string;
}

// Componente memoizado para o conteúdo expandido
const NestedContent = memo(function NestedContent<TChild extends Record<string, any>>({
    nestedData,
    nestedColumns,
    emptyMessage,
}: NestedContentProps<TChild>) {
    if (!nestedData || nestedData.length === 0) {
        return (
            <div className="text-sm text-gray-500 p-3">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="p-0">
            <DataTable<TChild>
                data={nestedData}
                columns={nestedColumns}
                striped
                gridLines
                showHeader
                size="small"
            />
        </div>
    );
}) as <TChild extends Record<string, any>>(props: NestedContentProps<TChild>) => JSX.Element;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function NestedDataTableComponent<
    TParent extends Record<string, any>,
    TChild extends Record<string, any>
>({
    data,
    columns,
    nestedField,
    nestedColumns,
    dataKey = "id",
    loading,
    emptyMessage = "Nenhum registro encontrado",
    nestedEmptyMessage = "Nenhum detalhe disponível",
    className,
    striped = true,
    gridLines = false,
}: NestedDataTableProps<TParent, TChild>) {
    // ========== STATE ==========
    
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean> | null>(null);

    // ========== REFS PARA ESTABILIDADE ==========
    
    const nestedFieldRef = useRef(nestedField);
    nestedFieldRef.current = nestedField;

    const nestedColumnsRef = useRef(nestedColumns);
    nestedColumnsRef.current = nestedColumns;

    const nestedEmptyMessageRef = useRef(nestedEmptyMessage);
    nestedEmptyMessageRef.current = nestedEmptyMessage;

    const dataKeyRef = useRef(dataKey);
    dataKeyRef.current = dataKey;

    // ========== HANDLERS ESTÁVEIS ==========

    const rowExpansionTemplate = useCallback((rowData: TParent) => {
        const nestedData = rowData[nestedFieldRef.current] as TChild[] | undefined;
        
        return (
            <NestedContent
                nestedData={nestedData}
                nestedColumns={nestedColumnsRef.current}
                emptyMessage={nestedEmptyMessageRef.current}
            />
        );
    }, []);

    const handleRowToggle = useCallback((e: { data: any }) => {
        setExpandedRows(e.data);
    }, []);

    const handleRowClick = useCallback((e: any) => {
        // Ignora cliques em elementos interativos
        if (e.originalEvent?.target?.closest("button, a, input, select, textarea")) {
            return;
        }

        const row = e.data;
        const key = row[dataKeyRef.current as keyof TParent];

        setExpandedRows((prev) => {
            if (!prev) {
                return { [key as string]: true };
            }

            if (prev[key as string]) {
                const copy = { ...prev };
                delete copy[key as string];
                return Object.keys(copy).length ? copy : null;
            }

            return {
                ...prev,
                [key as string]: true,
            };
        });
    }, []);

    // ========== MEMOIZED COLUMNS ==========

    const renderedColumns = useMemo(() => {
        return columns.map((col) => (
            <Column
                key={String(col.field)}
                field={col.field}
                header={col.header}
                body={col.body}
                style={{
                    width: col.width,
                    textAlign: col.align,
                    ...col.bodyStyle,
                }}
                headerStyle={{
                    width: col.width,
                    textAlign: col.align,
                    ...col.headerStyle,
                }}
                headerClassName={col.headerClassName}
                bodyClassName={col.bodyClassName}
            />
        ));
    }, [columns]);

    // ========== RENDER ==========

    return (
        <div className={classNames("nested-datatable", className)}>
            <PrimeDataTable
                value={data}
                dataKey={dataKey as string}
                expandedRows={expandedRows}
                onRowToggle={handleRowToggle}
                onRowClick={handleRowClick}
                rowExpansionTemplate={rowExpansionTemplate}
                loading={loading}
                emptyMessage={emptyMessage}
                stripedRows={striped}
                showGridlines={gridLines}
                className={classNames("rounded-lg overflow-hidden cursor-pointer")}
            >
                <Column expander style={{ width: "3rem" }} />
                {renderedColumns}
            </PrimeDataTable>
        </div>
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const NestedDataTable = memo(NestedDataTableComponent) as typeof NestedDataTableComponent;
