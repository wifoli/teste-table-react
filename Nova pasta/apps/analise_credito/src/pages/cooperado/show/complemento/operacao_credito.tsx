import { Heading4, Card, Grid, GridItem, Title, Body, Flex, Caption, TabView, DataTable } from "@front-engine/ui";
import { PiggyBankIcon } from "@phosphor-icons/react";
import { TabPanel } from "primereact/tabview";


export function OperacaoCreditoView() {
    return (
        <Card>
            <Flex direction="col" gap={1} className="!text-deep-teal">
                <Flex direction="row" gap={2}>
                    <PiggyBankIcon weight="duotone" size={24} />
                    <Heading4 className="!text-deep-teal">Operações de Crédito</Heading4>
                </Flex>
                <Caption>Histórico de créditos concedidos e limites utilizados</Caption>
            </Flex>

            <Card className="shadow-none my-4">
                <Grid cols={4}>
                    <GridItem>
                        <Title>Total de Operações</Title>
                        <Body>R$ 1.000,59</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Total do Saldo Devedor</Title>
                        <Body>R$ 2.479.433,45</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Modalidade com Maior Saldo Devedor</Title>
                        <Body>REPACTUAÇÃO CRÉDITO PESSOAL*</Body>
                    </GridItem>
                    <GridItem>
                        <Title>Percentual Maior Endividamento</Title>
                        <Body>25,27%</Body>
                    </GridItem>
                </Grid>
            </Card>
            <TabView className="overflow-visible">
                <TabPanel className="overflow-visible" header="Operações Vigentes">
                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                        { field: 'modalidade', header: 'Modalidade' },
                        { field: 'qtd_operacoes', header: 'Total de Operações' },
                        { field: 'valor_saldo_devedor', header: 'Valor do Saldo Devedor'},
                    ]}>
                    </DataTable>
                </TabPanel>
                <TabPanel className="overflow-visible" header="Operações Quitadas">
                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                        { field: 'modalidade', header: 'Modalidade' },
                        { field: 'qtd_operacoes', header: 'Total de Operações' },
                        { field: 'valor_operacao', header: 'Valor da Operação'},
                    ]}>
                    </DataTable>
                </TabPanel>
            </TabView>

        </Card>
    );
}