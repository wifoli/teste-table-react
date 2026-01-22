import { Caption, Container, Divider, Heading1, Spacer, VStack } from "@front-engine/ui";
import { ListPropostaProps } from "./types";
import { ListPropostaFilter } from "../list/filter";
import { ListPropostaTable } from "../../../components/tables/proposta_table";

export const InsightPropostaView: React.FC<ListPropostaProps> = ({
    data, pagination, totalRecords, sorting, isLoading, filters
}) => {
    return (
        <Container maxWidth="3xl" >
            <VStack spacing={0} className="mb-6">
                <Heading1>Central de Análise de Crédito</Heading1>
                <Caption>Consulta dinâmica das operações de crédito com informações essenciais e recursos avançados de filtragem</Caption>
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
