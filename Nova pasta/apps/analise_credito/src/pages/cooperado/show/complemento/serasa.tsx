import { Heading4, Card, Flex, Caption, Grid, GridItem, Title, Body } from "@front-engine/ui";
import { ScalesIcon } from "@phosphor-icons/react";


export function SerasaView() {
    return (
        <Card>
            <Flex direction="col" gap={1} className="!text-deep-teal mb-4">
                <Flex direction="row" gap={2}>
                    <ScalesIcon weight="duotone" size={24} />
                    <Heading4 className="!text-deep-teal">Dados Externos do Serasa</Heading4>
                </Flex>
                <Caption>Resumo cadastral e restritivo proveniente do Serasa</Caption>
            </Flex>
            <Card className="shadow-none my-4">
                <Grid cols={4}>
                    <GridItem>
                        <Title>Score</Title>
                        <Body>667</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Ações Judiciais</Title>
                        <Body>0</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Dívidas Vencidas</Title>
                        <Body>0</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Falências</Title>
                        <Body>0</Body>
                    </GridItem>
                    <GridItem>
                        <Title>PEFIN</Title>
                        <Body>0</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Protestos</Title>
                        <Body>0</Body>
                    </GridItem>
                    <GridItem>
                        <Title>REFIN</Title>
                        <Body>0</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Recheques</Title>
                        <Body>0</Body>
                    </GridItem>
                </Grid>
            </Card>
        </Card>
    );
}