import { useState, useCallback, memo } from "react";
import { DataTable as PrimeDataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";
import { DataTable, DataTableColumn } from "./DataTable";

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
}

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
}: NestedDataTableProps<TParent, TChild>) {
    const [expandedRows, setExpandedRows] = useState<any>(null);

    const rowExpansionTemplate = useCallback(
        (rowData: TParent) => {
            const nestedData = rowData[nestedField] as TChild[] | undefined;

            if (!nestedData || nestedData.length === 0) {
                return (
                    <div className="text-sm text-gray-500">
                        Nenhum detalhe disponível
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
        },
        [nestedField, nestedColumns],
    );

    const handleRowClick = useCallback(
        (e: any) => {
            if (e.originalEvent?.target?.closest("button, a, input")) {
                return;
            }

            const row = e.data;
            const key = row[dataKey as keyof TParent];

            setExpandedRows((prev: any) => {
                if (!prev) {
                    return { [key]: true };
                }

                if (prev[key]) {
                    const copy = { ...prev };
                    delete copy[key];
                    return Object.keys(copy).length ? copy : null;
                }

                return {
                    ...prev,
                    [key]: true,
                };
            });
        },
        [dataKey],
    );

    return (
        <div className="nested-datatable">
            <PrimeDataTable
                value={data}
                dataKey={dataKey as string}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                onRowClick={handleRowClick}
                rowExpansionTemplate={rowExpansionTemplate}
                loading={loading}
                emptyMessage={emptyMessage}
                className={classNames(
                    "rounded-lg overflow-hidden cursor-pointer"
                )}
            >
                <Column expander style={{ width: "3rem" }} />

                {columns.map((col) => (
                    <Column
                        key={String(col.field)}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        style={{
                            width: col.width,
                            textAlign: col.align,
                        }}
                        headerStyle={{
                            width: col.width,
                            textAlign: col.align,
                        }}
                    />
                ))}
            </PrimeDataTable>
        </div>
    );
}

export const NestedDataTable = memo(
    NestedDataTableComponent,
) as typeof NestedDataTableComponent;
