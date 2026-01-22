import { Center, Heading4, CardGradient, Flex, Button, GhostButton, CardFocus, Grid, GridItem, CircleRatio, Body, Title, Divider, TabView } from "@front-engine/ui";
import { BuildingApartmentIcon, CopyIcon, DnaIcon, PenNibIcon, UserIcon, WalletIcon } from "@phosphor-icons/react";
import { TabPanel } from "primereact/tabview";
import { DadosGeraisView } from "./complemento/dados_gerais";
import { ContaCorrenteView } from "./complemento/conta_corrente";
import { OperacaoCreditoView } from "./complemento/operacao_credito";
import { BacenView } from "./complemento/bacen";
import { SerasaView } from "./complemento/serasa";
import { AnotacoesView } from "./complemento/anotacoes";


export function CooperadoInfoView() {
    return (
        <CardGradient header={
            <Flex direction="row" justify="between">
                <Center axis="vertical" className="gap-4">
                    <DnaIcon size={32} weight="duotone" color="#003641" />
                    <Heading4 className="!text-deep-teal">Informações Gerais do Cooperado</Heading4>
                </Center>
                <Center axis="vertical" className="gap-2">
                    <GhostButton intent="secondary" label="Copiar" icon={<CopyIcon size={16} weight="duotone" />} />
                    <Button intent="secondary" label="Parecer" icon={<PenNibIcon size={16} weight="duotone" />} />
                </Center>
            </Flex>
        }>
            <Grid className="grid-cols-[auto_1fr_1fr]">
                <GridItem>
                    <CardFocus>
                        <Grid gap={2} className="justify-items-center mb-2">
                            <CircleRatio className="bg-deep-teal-faded-10 !text-deep-teal shadow mb-1" size="min-w-20 min-h-20 max-w-20 max-h-20">
                                <UserIcon size={36} weight="duotone" />
                            </CircleRatio>
                            <Heading4 className="!text-deep-teal">AUTORAMA AUTOMOVEIS UMUARAMA LIMITADA</Heading4>
                            <Body className="!text-deep-teal">76.350.115/0001-78</Body>
                        </Grid>
                        <Grid gap={2}>
                            <GridItem>
                                <Flex direction="row" justify="between" gap={2}>
                                    <Title>Nome Fantasia</Title>
                                    <Body>AUTORAMA</Body>
                                </Flex>
                            </GridItem>
                            <GridItem>
                                <Flex direction="row" justify="between" gap={2}>
                                    <Title>Data Constituição</Title>
                                    <Body>26/06/1963</Body>
                                </Flex>
                            </GridItem>
                            <GridItem>
                                <Flex direction="row" justify="between" gap={2}>
                                    <Title>Tempo Constituição</Title>
                                    <Body>62 anos, 6 meses e 25 dias</Body>
                                </Flex>
                            </GridItem>
                            <GridItem>
                                <Flex direction="row" justify="between" gap={2}>
                                    <Title>Atualização Cadastral</Title>
                                    <Body>09/09/2024</Body>
                                </Flex>
                            </GridItem>
                        </Grid>
                    </CardFocus>
                </GridItem>
                <GridItem colSpan={2}>
                    <Grid gap={4}>
                        <GridItem>
                            <Center axis="vertical" className="gap-2">
                                <BuildingApartmentIcon weight="duotone" size={24} color="#003641" />
                                <Heading4 className="!text-deep-teal">Perfil Empresarial</Heading4>
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Grid cols={2} gap={4}>
                                <GridItem>
                                    <Title>Atividade Econômina</Title>
                                    <Body>SET.PRIV.ATV.EMP.COMERCIO</Body>
                                </GridItem>
                                <GridItem>
                                    <Title>Porte Empresa</Title>
                                    <Body>MÉDIA EMPRESA</Body>
                                </GridItem>
                                <GridItem colSpan={2}>
                                    <Title>CNAE</Title>
                                    <Body>G4511101 - COMÉRCIO A VAREJO DE AUTOMÓVEIS, CAMIONETAS E UTILITÁRIOS NOVOS</Body>
                                </GridItem>
                            </Grid>
                        </GridItem>
                        <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-1"></Divider>
                        <GridItem>
                            <Center axis="vertical" className="gap-2">
                                <WalletIcon weight="duotone" size={24} color="#003641" />
                                <Heading4 className="!text-deep-teal">Dados Econômicos</Heading4>
                            </Center>
                        </GridItem>
                        <GridItem>
                            <Grid cols={2} gap={4}>
                                <GridItem>
                                    <Title>Renda</Title>
                                    <Body>DECLARAÇÃO DE FATURAMENTO - R$ 5.069.548,91</Body>
                                </GridItem>
                                <GridItem>
                                    <Title>Risco</Title>
                                    <Body>R6</Body>
                                </GridItem>
                                <GridItem>
                                    <Title>Tomador</Title>
                                    <Body>PJ MAIOR TOMADOR</Body>
                                </GridItem>
                                <GridItem>
                                    <Title>Atualização da Renda</Title>
                                    <Body>30/10/2025</Body>
                                </GridItem>
                            </Grid>
                        </GridItem>
                    </Grid>
                </GridItem>
            </Grid>

            <TabView className="overflow-visible mt-6">
                <TabPanel className="overflow-visible" header="Dados Gerais">
                    <DadosGeraisView />
                </TabPanel>
                <TabPanel className="overflow-visible" header="Conta Corrente">
                    <ContaCorrenteView />
                </TabPanel>
                <TabPanel className="overflow-visible" header="Operações de Crédito" >
                    <OperacaoCreditoView />
                </TabPanel>
                <TabPanel className="overflow-visible" header="Bacen SCR" >
                    <BacenView />
                </TabPanel>
                <TabPanel className="overflow-visible" header="Serasa" >
                    <SerasaView />
                </TabPanel>
                <TabPanel className="overflow-visible" header="Anotações" >
                    <AnotacoesView />
                </TabPanel>
            </TabView>
            
        </CardGradient>
    );
}