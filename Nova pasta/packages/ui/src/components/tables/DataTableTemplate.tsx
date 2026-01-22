import { DataTable as PrimeDataTable, DataTableProps } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";


const mock_data = [
    {
        id: 1,
        code: "A001",
        name: "Documento A",
        size: "15 KB",
        type: "PDF",
    },
    {
        id: 2,
        code: "A002",
        name: "Documento B",
        size: "32 KB",
        type: "DOCX",
    },
    {
        id: 3,
        code: "A003",
        name: "Imagem C",
        size: "120 KB",
        type: "PNG",
    },
    {
        id: 4,
        code: "A004",
        name: "Planilha D",
        size: "54 KB",
        type: "XLSX",
    },
];

export const StyledColumn = (props: ColumnProps) => {
    return (
        <Column
            {...props}
            pt={{
                columnTitle: { className: "font-app" }
            }}
        />
    );
};

export const DataTableTemplate = ({
    children,
    className,
    ...rest
}: DataTableProps<any>) => {
    const cleaned = {
        ...rest,
        selection: undefined,
        selectionMode: undefined,
        cellSelection: false,
        onSelectionChange: undefined
    };

    return (
        <PrimeDataTable
            {...(cleaned as DataTableProps<any>)}
            className={className}
            value={mock_data}
            pt={{
                root: { className: "font-app" },
            }}
        >
            {children}
        </PrimeDataTable>
    );
};
