import { Heading4, Accordion, Flex, Caption, DataTable, TabView, Card, Grid, GridItem, Title, Body, Center } from "@front-engine/ui";
import { ArrowsCounterClockwiseIcon, BankIcon, InfoIcon } from "@phosphor-icons/react";
import { AccordionTab } from "primereact/accordion";
import { TabPanel } from "primereact/tabview";



export function ContaCorrenteView() {
    return (
            <Accordion multiple>
                <AccordionTab header={
                    <Flex direction="col">
                        <Flex direction="row" gap={2}>
                            <BankIcon weight="duotone" size={24} />
                            <Heading4>Contas Correntes</Heading4>
                        </Flex>
                        <Caption>Informações sobre as contas correntes e aplicações do cooperado</Caption>
                    </Flex>
                }>
                    <Card className="shadow-none mb-4">
                        <Grid cols={2}>
                            <GridItem>
                                <Title>Soma das Aplicações</Title>
                                <Body>R$ 1.000,59</Body>
                            </GridItem>
                            <GridItem>
                                <Title>Saldo Médio Depósito Conta Corrente (6 meses)</Title>
                                <Body>R$ 1.602,26</Body>
                            </GridItem>
                        </Grid>
                    </Card>
                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                        { field: 'mes', header: 'Tipo' },
                        { field: 'quant_lancamentos', header: 'Número' },
                        { field: 'valor_credito', header: 'Limite Contratado'},
                        { field: 'valor_credito', header: 'Saldo Devedor Limite'},
                        { field: 'valor_credito', header: 'Saldo Devedor ADP'},
                        { field: 'valor_credito', header: 'Saldo Depósito'},
                        { field: 'valor_credito', header: 'Valor Médio Utilizado Limite'},
                        { field: 'valor_credito', header: 'Débito Automático'},
                    ]}>
                    </DataTable>
                </AccordionTab>
                <AccordionTab header={
                    <Flex direction="col">
                        <Flex direction="row" gap={2}>
                            <ArrowsCounterClockwiseIcon weight="duotone" size={24} />
                            <Heading4>Movimentação da Conta Corrente</Heading4>
                        </Flex>
                        <Caption>Detalhamento dos débitos e créditos da conta corrente no último ano</Caption>
                    </Flex>
                }>
                    <TabView className="overflow-visible">
                        <TabPanel className="overflow-visible" header="Lançamentos em 6 Meses">
                            <Card className="shadow-none mb-4">
                                <Grid cols={5}>
                                    <Center axis="vertical" className="gap-2" title="7064, 7065, 7066, 7067, 7068, 7069, 7070, 7071, 7072, 7368, 7386, 821, 510 e 512">
                                        <Title>Códigos dos Lançamentos </Title>
                                        <Title><InfoIcon size={24} /></Title>
                                    </Center>
                                    <GridItem>
                                        <Title>Quant. de Lançamentos</Title>
                                        <Body>44</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Valor Total Crédito</Title>
                                        <Body>R$ 1.091.423,59</Body>
                                    </GridItem>
                                    <GridItem colSpan={2}>
                                        <Title>Lançamento com Maior Movimentação</Title>
                                        <Body>PIX RECEBIDO - OUTRA IF - 65,91%</Body>
                                    </GridItem>
                                </Grid>
                            </Card>
                            <DataTable className="p-simple-turquoise" data={[]} columns={[
                                { field: 'mes', header: 'Mês' },
                                { field: 'quant_lancamentos', header: 'Quant. de Lançamentos' },
                                { field: 'valor_credito', header: 'Valor Total Crédito'},
                            ]}>
                            </DataTable>
                        </TabPanel>
                        <TabPanel className="overflow-visible" header="Lançamentos em 1 ano">
                            <Card className="shadow-none mb-4">
                                <Grid cols={4}>
                                    <GridItem>
                                        <Title>Quant. Total de Lançamentos</Title>
                                        <Body>1559</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Lançamento com Maior Movimentação</Title>
                                        <Body>PIX EMITIDO OUTRA IF</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Percentual da Maior Movimentação</Title>
                                        <Body>27,07%</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Quant. Lançamentos Crédito</Title>
                                        <Body>278</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Valor Total Crédito</Title>
                                        <Body>R$ 4.694.610,48</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Quant. Lançamentos Débito</Title>
                                        <Body>1281</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Valor Total Débito</Title>
                                        <Body>R$ 5.842.238,26</Body>
                                    </GridItem>
                                </Grid>
                            </Card>
                            <DataTable className="p-simple-turquoise" data={[]} columns={[
                                { field: 'mes', header: 'Mês' },
                                { field: 'quant_lancamentos', header: 'Quant. de Lançamentos' },
                                { field: 'valor_credito', header: 'Valor Total Crédito'},
                                { field: 'valor_debito', header: 'Valor Total Débito'},
                            ]}>
                            </DataTable>
                        </TabPanel>
                    </TabView>
                </AccordionTab>
                
            </Accordion>

    );
}