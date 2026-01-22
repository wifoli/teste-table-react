import { BiggerData, Body, Caption, Card, Center, Divider, Flex, Grid, GridItem, Heading2, Heading4, TabView, Title, ProgressBar, Accordion, DataTable, CardFocus, Heading1, FormLayout, FormCol, FileUpload, CardGradient, Container } from "@front-engine/ui";
import { BuildingsIcon, CalendarBlankIcon, DnaIcon, GrainsSlashIcon, HandCoinsIcon, HandDepositIcon, PercentIcon, PiggyBankIcon, ProjectorScreenChartIcon, ReceiptIcon, RecycleIcon, ShieldIcon, TrendDownIcon, TrendUpIcon, UsersIcon, WalletIcon, WarningIcon } from "@phosphor-icons/react";
import { MoneyIcon } from "@phosphor-icons/react/dist/icons/Money";
import { AccordionTab } from "primereact/accordion";
import { TabPanel } from "primereact/tabview";


export function SumulaPropostaView() {
    return (
        <CardGradient header={
            <FormLayout responsive={false} columns={1} gap={3}>
                <FormCol className="flex justify-between" span={1}>
                    <Center axis="vertical" className="gap-2">
                        <HandDepositIcon size={32} weight="duotone" color="#003641" />
                        <Heading4 className="!text-deep-teal">Inserção da Súmula em Fase de Estudo/Análise Técnica</Heading4>
                    </Center>
                    <FileUpload chooseLabel="Inserir Súmula" />
                </FormCol>
            </FormLayout>
        }>
            <Grid gap={4} className="overflow-visible grid-cols-[auto_1fr_1fr_1fr_1fr]">
                <GridItem colSpan={1}>
                    <Container className="!bg-transparent shadow-none !py-6 !px-3 !border-none">
                        <Grid gap={2} cols={1} autoRows="auto">
                            <Center axis="vertical" className="gap-2 mb-4">
                                <PiggyBankIcon weight="duotone" size={24} color="#003641" />
                                <Heading4>Informações da Operação</Heading4>
                            </Center>
                            <Grid gap={0}>
                                <Title>Nº Proposta</Title>
                                <Body>258216921702</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Código Linha</Title>
                                <Body>120586</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Linha de Crédito</Title>
                                <Body>LIMITE CCL PAR PJ - 02/24</Body>
                            </Grid>
                        </Grid>

                        <Divider></Divider>

                        <Grid cols={1} gap={2} autoRows="auto">
                            <Grid gap={0}>
                                <Title>Data da Operação</Title>
                                <Body>14/01/2026</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Carência</Title>
                                <Body>634 dias</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Data do 1º Vencimento</Title>
                                <Body>10/10/2027</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Prazo</Title>
                                <Body>634 dias (20 meses)</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Quant. Parcelas</Title>
                                <Body>1</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Periodicidade</Title>
                                <Body>Mensal</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>LCC</Title>
                                <Body>R$ 56.000,00</Body>
                            </Grid>
                        </Grid>

                        <Divider></Divider>

                        <Grid gap={2} cols={1} autoRows="auto">
                            <Grid gap={0}>
                                <Title>Possui Seguro</Title>
                                <Body>INEXISTENTE</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Possui TAC</Title>
                                <Body>Não - R$ 0,00</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Ativo Problemático</Title>
                                <Body>Não</Body>
                            </Grid>
                            <Grid gap={0}>
                                <Title>Data Bacen - Súmula</Title>
                                <Body>11/2025</Body>
                            </Grid>
                        </Grid>
                    </Container>
                </GridItem>

                <GridItem colSpan={4}>
                    <TabView className="overflow-visible">
                        <TabPanel className="overflow-visible" header="Análise de Risco">
                            <Grid cols={4}>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Valor Proposta</Heading2>
                                            <MoneyIcon weight="duotone" size={32} color="#003641" />
                                        </Center>
                                        <BiggerData>R$ 50.000,00</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Valor Contratado</Heading2>
                                            <TrendUpIcon size={32} color="#003641" weight="duotone" />
                                        </Center>
                                        <BiggerData>R$ 50.000,00</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Taxa Juros</Heading2>
                                            <PercentIcon size={32} color="#003641" weight="duotone" />
                                        </Center>
                                        <BiggerData>6,00%</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Capacidade de Pagamento</Heading2>
                                            <ShieldIcon size={32} color="#003641" weight="duotone" />
                                        </Center>
                                        <BiggerData>Não Calculada</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <Card className="bg-white/30">
                                        <Flex direction="col" gap={0}>
                                            <Center axis="vertical" className="gap-2">
                                                <WalletIcon weight="duotone" size={24} color="#003641" />
                                                <Heading4>Classificação da Carteira e Estágio</Heading4>
                                            </Center>
                                            <Caption>Classificação da Carteira do Cooperado — C1 / C2 / C3 e Estágio</Caption>
                                        </Flex>
                                        <BiggerData>C3 - Estágio 1</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <Card className="bg-white/30">
                                        <Flex direction="col" gap={0}>
                                            <Center axis="vertical" className="gap-2">
                                                <GrainsSlashIcon weight="duotone" size={24} color="#003641" />
                                                <Heading4>Perda Esperada</Heading4>
                                            </Center>
                                            <Caption>Percentual e valor projetado de perda</Caption>
                                        </Flex>
                                        <BiggerData>12,44% - R$ 3.343,68</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <Card className="bg-white/30">
                                        <Flex direction="col" gap={0} className="mb-4">
                                            <Center axis="vertical" className="gap-2">
                                                <ProjectorScreenChartIcon size={24} color="#003641" weight="duotone" />
                                                <Heading4>Probabilidade de Default (PD)</Heading4>
                                            </Center>
                                            <Caption>Análise por estágios de risco</Caption>
                                        </Flex>
                                        <Grid cols={1} gap={3}>
                                            <GridItem>
                                                <Grid className="items-center grid-cols-[auto_1fr_auto]">
                                                    <Body>PD Estágio 1</Body>
                                                    <ProgressBar className="h-2" showValue={false} color="#7DB61C" value={20}></ProgressBar>
                                                    <Body className="text-leaf-green">20%</Body>
                                                </Grid>
                                            </GridItem>
                                            <GridItem>
                                                <Grid className="items-center grid-cols-[auto_1fr_auto]">
                                                    <Body>PD Estágio 2</Body>
                                                    <ProgressBar className="h-2" showValue={false} color="#7DB61C" value={20}></ProgressBar>
                                                    <Body className="text-leaf-green">20%</Body>
                                                </Grid>
                                            </GridItem>
                                            <GridItem>
                                                <Grid className="items-center grid-cols-[auto_1fr_auto]">
                                                    <Body>PD Estágio 3</Body>
                                                    <ProgressBar className="h-2" showValue={false} color="#C9D200" value={20}></ProgressBar>
                                                    <Body className="text-lime-green">20%</Body>
                                                </Grid>
                                            </GridItem>
                                        </Grid>
                                    </Card>
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <Card className="bg-white/30">
                                        <Flex direction="col" gap={0} className="mb-4">
                                            <Center axis="vertical" className="gap-2">
                                                <TrendDownIcon size={24} color="#003641" weight="duotone" />
                                                <Heading4>Perda Dada a Inadimplência (LGD)</Heading4>
                                            </Center>
                                            <Caption>Exposição à Perda em Caso de Inadimplência</Caption>
                                        </Flex>
                                        <GridItem>
                                            <Center>
                                                <BiggerData>20%</BiggerData>
                                            </Center>
                                            <ProgressBar className="h-2" showValue={false} color="#7DB61C" value={20}></ProgressBar>
                                        </GridItem>
                                    </Card>
                                </GridItem>
                                <GridItem colSpan={4}>
                                    <Card className="bg-white/30">
                                        <Flex direction="col" gap={0} className="mb-4">
                                            <Center axis="vertical" className="gap-2">
                                                <WarningIcon size={24} color="#003641" weight="duotone" />
                                                <Heading4>Perda Esperada (PE) por Estágios</Heading4>
                                            </Center>
                                            <Caption>Análise detalhada da perda esperada em cada estágio de risco</Caption>
                                        </Flex>
                                        <Grid cols={3} gap={3}>
                                            <GridItem>
                                                <Center className="flex-col">
                                                    <Body>PE Estágio 1</Body>
                                                    <BiggerData>20%</BiggerData>
                                                </Center>
                                                <ProgressBar className="h-2" showValue={false} color="#7DB61C" value={20}></ProgressBar>
                                            </GridItem>
                                            <GridItem>
                                                <Center className="flex-col">
                                                    <Body>PE Estágio 2</Body>
                                                    <BiggerData>20%</BiggerData>
                                                </Center>
                                                <ProgressBar className="h-2" showValue={false} color="#7DB61C" value={20}></ProgressBar>
                                            </GridItem>
                                            <GridItem>
                                                <Center className="flex-col">
                                                    <Body>PE Estágio 3</Body>
                                                    <BiggerData>20%</BiggerData>
                                                </Center>
                                                <ProgressBar className="h-2" showValue={false} color="#C9D200" value={20}></ProgressBar>
                                            </GridItem>
                                        </Grid>
                                    </Card>
                                </GridItem>
                            </Grid>
                        </TabPanel>
                        <TabPanel className="overflow-visible" header="Garantias da Proposta">
                            <Accordion>
                                <AccordionTab header="Garantias Pessoais" icon={<UsersIcon weight="bold" size={24} />} caption="Informações sobre as garantias pessoais da operação">
                                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                                        { field: 'cpf_cnpj', header: 'CPF/CNPJ' },
                                        { field: 'cooperado', header: 'Cooperado' },
                                        { field: 'valor_bens', header: 'Valor total bens'},
                                        { field: 'qtd_op_direta', header: 'Quant. Op. Direta' },
                                        { field: 'valor_op_direta', header: 'Valor Op. Direta' },
                                        { field: 'qtd_op_indireta', header: 'Quant. Op. Indireta' },
                                        { field: 'valor_op_indireta', header: 'Valor Op. Indireta' },
                                    ]}>
                                    </DataTable>
                                </AccordionTab>
                                <AccordionTab header="Garantias Reais" icon={<BuildingsIcon weight="bold" size={24} />} caption="Informações sobre as garantias reais da operação">
                                    <CardFocus className="mb-2 shadow-none">
                                        <Grid cols={3}>
                                            <GridItem>
                                                <Title>Grupo Garantia</Title>
                                                <Body>FUNDO GARANTIDOR / DE AVAL</Body>
                                            </GridItem>
                                            <GridItem>
                                                <Title>Valor Da Garantia</Title>
                                                <Body>R$ 160.000,00</Body>
                                            </GridItem>
                                            <GridItem>
                                                <Title>Data da Última Atualização</Title>
                                                <Body>22/12/2025</Body>
                                            </GridItem>
                                        </Grid>
                                    </CardFocus>
                                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                                        { field: 'cpf_cnpj', header: 'CPF/CNPJ' },
                                        { field: 'cooperado', header: 'Cooperado' },
                                        { field: 'valor_bens', header: 'Responsabilidade'},
                                    ]}>
                                    </DataTable>
                                </AccordionTab>
                            </Accordion>
                        </TabPanel>
                        <TabPanel className="overflow-visible" header="Informações da Repactuação" >
                            <Grid cols={5}>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Pré-Renegociação</Heading2>
                                            <CalendarBlankIcon weight="duotone" size={32} color="#003641" />
                                        </Center>
                                        <BiggerData>R$ 25.800,29</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Troco</Heading2>
                                            <WalletIcon size={32} color="#003641" weight="duotone" />
                                        </Center>
                                        <BiggerData>R$ 0,00</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Acréscimos</Heading2>
                                            <TrendUpIcon size={32} color="#003641" weight="duotone" />
                                        </Center>
                                        <BiggerData>R$ 0,00</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Descontos</Heading2>
                                            <TrendDownIcon size={32} color="#003641" weight="duotone" />
                                        </Center>
                                        <BiggerData>R$ 0,00</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem>
                                    <Card className="bg-white/30">
                                        <Center axis="vertical" className="justify-between">
                                            <Heading2>Entrada</Heading2>
                                            <HandCoinsIcon size={32} color="#003641" weight="duotone" />
                                        </Center>
                                        <BiggerData>R$ 0,00</BiggerData>
                                    </Card>
                                </GridItem>
                                <GridItem colSpan={5}>
                                    <CardFocus variant="deepTeal">
                                        <Flex className="mb-6" direction="col" gap={2}>
                                            <Center axis="vertical" className="gap-2">
                                                <DnaIcon weight="duotone" size={24} color="#003641" />
                                                <Heading4 className="!text-deep-teal">Cálculo do Valor Total da Repactuação</Heading4>
                                            </Center>
                                            <Caption>Valor das Operações + Troco + Acréscimos - Descontos - Entrada</Caption>
                                        </Flex>
                                        <Flex direction="col" gap={2}>
                                            <Flex direction="row" className="justify-between">
                                                <Body>Valor das Operações:</Body>
                                                <Body>R$ 25.800,29</Body>
                                            </Flex>
                                            <Flex direction="row" className="justify-between">
                                                <Body className="text-leaf-green">+ Troco:</Body>
                                                <Body className="text-leaf-green">R$ 0,00</Body>
                                            </Flex>
                                            <Flex direction="row" className="justify-between">
                                                <Body className="text-leaf-green">+ Acréscimos:</Body>
                                                <Body className="text-leaf-green">R$ 0,00</Body>
                                            </Flex>
                                            <Flex direction="row" className="justify-between">
                                                <Body className="text-red-500">- Descontos:</Body>
                                                <Body className="text-red-500">R$ 0,00</Body>
                                            </Flex>
                                            <Flex direction="row" className="justify-between">
                                                <Body className="text-red-500">- Entrada:</Body>
                                                <Body className="text-red-500">R$ 0,00</Body>
                                            </Flex>
                                        </Flex>
                                        <Divider className="my-4 !border-deep-teal"></Divider>
                                        <Flex direction="row" className="justify-between">
                                            <Heading1 className="!text-deep-teal">Valor Total Repactuação:</Heading1>
                                            <Heading1 className="!text-deep-teal">R$ 25.800,29</Heading1>
                                        </Flex>
                                    </CardFocus>
                                </GridItem>
                                <GridItem colSpan={5}>
                                    <Accordion>
                                        <AccordionTab header="Operações Pré-Renegociadas" icon={<ReceiptIcon weight="bold" size={24} />} caption="Operações sob avaliação para eventual renegociação">
                                            <DataTable className="p-simple-turquoise" data={[]} columns={[
                                                { field: 'contrato', header: 'Número Contrato' },
                                                { field: 'cooperado', header: 'Operação ou CC' },
                                                { field: 'modalidade', header: 'Modalidade/Tipo'},
                                                { field: 'valor_saldo_devedor', header: 'Valor Saldo Devedor' },
                                                { field: 'valor_operacao', header: 'Valor Operação/ADP' },
                                            ]}>
                                            </DataTable>
                                        </AccordionTab>
                                        <AccordionTab header="Garantias das Operações Repactuadas" icon={<RecycleIcon weight="bold" size={24} />} caption="Informações das garantias vinculadas às operações repactuadas">
                                            <DataTable className="p-simple-turquoise" data={[]} columns={[
                                                { field: 'contrato', header: 'Número Contrato' },
                                                { field: 'cooperado', header: 'Nome/Descrição' },
                                                { field: 'tipo', header: 'Tipo'},
                                                { field: 'valor_garantia', header: 'Valor da Garantia'},
                                            ]}>
                                            </DataTable>
                                        </AccordionTab>
                                    </Accordion>
                                </GridItem>
                            </Grid>
                        </TabPanel>
                    </TabView>
                </GridItem>
            </Grid>
        </CardGradient>
    );
}