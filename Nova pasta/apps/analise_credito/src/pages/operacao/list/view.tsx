import {
    Caption, Container, Divider, Heading1, VStack,
} from "@front-engine/ui";


export function ListOperacaoView() {
    return (
        <Container maxWidth="3xl">
            <VStack spacing={0} className="mb-6">
                <Heading1>Painel de Operações</Heading1>
                <Caption>Consulta Dinâmica de Operações de Crédito – Informações Principais com Recursos de Filtragem</Caption>
                <Divider className="my-4" />
            </VStack>
        </Container>
    );
}
