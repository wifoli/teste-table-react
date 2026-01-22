import { Caption, Container, Divider, Heading1, Spacer, VStack } from "@front-engine/ui";
import { ListPropostaProps } from "./types";
import { ListPropostaFilter } from "./filter";
import { ListPropostaTable } from "../../../components/tables/proposta_table";

export const ListPropostaView: React.FC<ListPropostaProps> = ({
    data, pagination, totalRecords, sorting, isLoading, filters
}) => {
    return (
        <Container maxWidth="3xl" >
            <VStack spacing={0} className="mb-6">
                <Heading1>Painel de Operações</Heading1>
                <Caption>Consulta Dinâmica de Operações de Crédito – Informações Principais com Recursos de Filtragem</Caption>
                <Divider className="my-4" />
            </VStack>

            <ListPropostaFilter filters={filters} />

            <Spacer size={6} axis="vertical" />

            <ListPropostaTable
                data={data}
                pagination={pagination}
                totalRecords={totalRecords}
                sorting={sorting}
                isLoading={isLoading}
            />
        </Container>
    );
}
