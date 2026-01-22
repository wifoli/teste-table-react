import { Heading4, Card, Flex, Caption, Grid, GridItem, Title, Body, DataTable } from "@front-engine/ui";
import { GlobeHemisphereWestIcon, SneakerMoveIcon } from "@phosphor-icons/react";


export function BacenView() {
    return (
        <Grid gap={6}>
            <Card>
                <Flex direction="col" gap={1} className="!text-deep-teal">
                    <Flex direction="row" gap={2}>
                        <GlobeHemisphereWestIcon weight="duotone" size={24} />
                        <Heading4 className="!text-deep-teal">Dados Externos do Bacen - 11/2025</Heading4>
                    </Flex>
                    <Caption>Informações externas obtidas junto ao Banco Central</Caption>
                </Flex>

                <Card className="shadow-none my-4">
                    <Grid cols={4}>
                        <GridItem>
                            <Title>Valor Saldo Devedor Total</Title>
                            <Body>R$ 1.000,59</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Endividamento Curto Prazo</Title>
                            <Body>R$ 6.768.083,10</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Endividamento Longo Prazo</Title>
                            <Body>R$ 13.468.277,56</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Prejuízo</Title>
                            <Body>R$ 0,00</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Valor Vencido</Title>
                            <Body>R$ 418.216,08</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Percentual Maior Endividamento</Title>
                            <Body>37,30%</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Maior Endividamento</Title>
                            <Body>CUSTEIO E PRE-CUSTEIO</Body>
                        </GridItem>
                    </Grid>
                </Card>
                <DataTable className="p-simple-turquoise" data={[]} columns={[
                    { field: 'modalidade', header: 'Modalidade' },
                    { field: 'valor_saldo_devedor', header: 'Valor Saldo Devedor' },
                    { field: 'valor_endividamento_curto_prazo', header: 'Endividamento Curto Prazo'},
                    { field: 'valor_endividamento_longo_prazo', header: 'Endividamento Longo Prazo'},
                    { field: 'valor_prejuizo', header: 'Prejuízo'},
                    { field: 'valor_vencido', header: 'Valor Vencido'},
                ]}>
                </DataTable>
            </Card>

            <Card>
                <Flex direction="col" gap={1} className="!text-deep-teal mb-4">
                    <Flex direction="row" gap={2}>
                        <SneakerMoveIcon weight="duotone" size={24} />
                        <Heading4 className="!text-deep-teal">Dados do Histórico Financeiro (3 anos)</Heading4>
                    </Flex>
                    <Caption>Dados oficiais do Bacen e evolução financeira trienal do cooperado</Caption>
                </Flex>
                <DataTable className="p-simple-turquoise" data={[]} columns={[
                    { field: 'data_movimento', header: 'Data Movimento' },
                    { field: 'valor_renda_faturamento', header: 'Valor Renda/Faturamento' },
                    { field: 'valor_saldo_devedor_bacen', header: 'Valor do Saldo Devedor Bacen'},
                ]}>
                </DataTable>
            </Card>
        </Grid>
    );
}