import { Body, Caption, DataTable, VStack } from "@front-engine/ui";
import { ListPropostaTableProps } from "../../pages/proposta/list/types";
import { Proposta } from "@front-engine/api";
import { cnpj, cpf, date, currency, datetime } from "@front-engine/utils-ts/formatters";

export const ListPropostaTable: React.FC<ListPropostaTableProps> = ({
    data, pagination, totalRecords, sorting, isLoading
}) => {
    const renderCooperado = (col: Proposta) => (
        <VStack spacing={0}>
            <Body>{col.nomeTomador}</Body>
            <Caption>{col.cpfCnpjTomador?.length > 11 ? cnpj(col.cpfCnpjTomador) : cpf(col.cpfCnpjTomador)}</Caption>
        </VStack>
    );

    const renderProposta = (col: Proposta) => (
        <VStack spacing={0}>
            <Body>{col.linha}</Body>
            <Caption>{col.numero} - {date(col.dataCriacao)}</Caption>
        </VStack>
    );

    const renderValor = (col: Proposta) => <Body>{col.valor ? currency(col.valor) : 'R$ —'}</Body>;

    const renderFase = (col: Proposta) => (
        <VStack spacing={0}>
            <Body>{col.descricaoUltimaFase}</Body>
            <Caption>{col.dataCriacaoUltimaFase ? datetime(col.dataCriacaoUltimaFase) : '__/__/____ __:__'}</Caption>
        </VStack>
    );

    const renderAnalista = (col: Proposta) => <Body>{col.operadorUltimaFase || '—'}</Body>;

    const renderCanal = (col: Proposta) => <Body>{col.canal || '—'}</Body>;


    return (
        <DataTable
            data={data}
            columns={[
                { field: 'nomeTomador', header: 'Cooperado', sortable: true, body: renderCooperado },
                { field: 'linha', header: 'Proposta', sortable: true, body: renderProposta },
                { field: 'valor', header: 'Valor', sortable: true, body: renderValor },
                { field: 'descricaoUltimaFase', header: 'Fase', sortable: true, body: renderFase },
                { field: 'operadorUltimaFase', header: 'Analista', sortable: true, body: renderAnalista },
                { field: 'canal', header: 'Canal', sortable: true, body: renderCanal }
            ]}
            pagination={{ ...pagination, totalRecords }}
            sorting={sorting}
            loading={isLoading}
            dataKey="numero"
        />
    );
}