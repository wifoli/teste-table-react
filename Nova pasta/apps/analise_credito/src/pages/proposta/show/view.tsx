import {
    BigData, CircleRatio, Body, Heading3, Title, ButtonGradient, Button, GhostButton,
    Caption, CardFocus, Container, Flex, Grid, GridItem, Heading1, SmallData, TabView, VStack
} from "@front-engine/ui";
import { CopyIcon, MapPinAreaIcon, PencilLineIcon, PenIcon, ScrollIcon,
    UserCircleIcon,
} from "@phosphor-icons/react";
import { TabPanel } from "primereact/tabview";
import { RelacionadosPropostaView } from "./relacionados";
import { SumulaPropostaView } from "./sumula";
import { AnalisePropostaView } from "./analise";
import { PromessaPropostaView } from "./promessa";


export function ShowPropostaView() {
    return (
        <Container maxWidth="full" className="bg-white/80 overflow-visible">
            <VStack spacing={0} className="mb-6">
                <Heading1>Detalhes da Proposta</Heading1>
                <Caption>Acompanhe informações detalhadas da proposta, incluindo súmula, tempo de análise e promessas de crédito</Caption>
            </VStack>

            <Grid cols={2} gap={4} className="mb-4 overflow-visible">
                <CardFocus>
                    <Grid cols={2}>
                        <GridItem colSpan={2}>
                            <Grid className="grid-cols-[auto_1fr]">
                                <CircleRatio className="bg-turquoise-faded-10 shadow" size="min-w-20 min-h-20 max-w-20 max-h-20">
                                    <ScrollIcon color="#00AE9D" size={36} />
                                </CircleRatio>
                                <Grid gap={1}>
                                    <Heading3 className="!m-0">Nº Proposta: 258216921702</Heading3>
                                    <BigData className="!m-0">RPL INVESTIMENTO PECUÁRIO SINGULAR TAXA LIVRE</BigData>
                                    <SmallData className="!m-0">R$ 312.228,00</SmallData>
                                </Grid>
                            </Grid>
                        </GridItem>
                        <GridItem>
                            <Title>PA</Title>
                            <Body>90 - SICOOB - PA PLATAFORMA PJ</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Fase Atual</Title>
                            <Body>Análise Técnica</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Início Fase</Title>
                            <Body>16/01/2026 - 16:26</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Canal</Title>
                            <Body>SISBRWEB</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Analista</Title>
                            <Body>gabrielr4379_00</Body>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Grid cols={2} gap={2}>
                                <Button
                                    icon={<PenIcon size={20} />}
                                    intent="secondary"
                                    size="small"
                                    label="Editar Operação"
                                    type="button"
                                />
                                <Button
                                    icon={<PencilLineIcon size={20} />}
                                    intent="secondary"
                                    size="small"
                                    label="Editar Análise"
                                    type="button"
                                />
                            </Grid>
                        </GridItem>
                    </Grid>
                </CardFocus>
                <CardFocus>
                    <Grid cols={2}>
                        <GridItem colSpan={2}>
                           <Grid className="grid-cols-[auto_1fr]">
                                <CircleRatio className="bg-turquoise-faded-10 shadow" size="min-w-20 min-h-20 max-w-20 max-h-20">
                                    <UserCircleIcon color="#00AE9D" size={36} />
                                </CircleRatio>
                                <Grid gap={1}>
                                    <Heading3 className="!m-0">CNPJ: 76.350.115/0001-78</Heading3>
                                    <BigData className="!m-0">AUTORAMA AUTOMOVEIS UMUARAMA LIMITADA</BigData>
                                    <SmallData className="!m-0">62 anos, 6 meses e 23 dias</SmallData>
                                </Grid>
                            </Grid>
                        </GridItem>
                        <GridItem>
                            <Title>Nome Fantasia</Title>
                            <Body>AUTORAMA</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Data Nascimento/Constituição</Title>
                            <Body>26/06/1963</Body>
                        </GridItem>
                        <GridItem>
                            <Title>Renda/Faturamento</Title>
                            <Body>R$ 5.069.548,91</Body>
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
                            <Title>Atividade Econômina do Cliente</Title>
                            <Body>SET.PRIV.ATV.EMP.COMERCIO</Body>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Flex gap={2}>
                                <GhostButton
                                    icon={<CopyIcon size={24} />}
                                    intent="secondary"
                                    size="small"
                                    label="Copiar"
                                    type="button"
                                />
                                <ButtonGradient
                                    icon={<MapPinAreaIcon size={20} />}
                                    className="w-full"
                                    size="small"
                                    label="Redirecionar"
                                    type="button"
                                />
                            </Flex>
                        </GridItem>
                    </Grid>
                </CardFocus>
            </Grid>

            <TabView className="overflow-visible">
                <TabPanel header="Relacionados">
                    <CardFocus variant="leafGreen">
                        <RelacionadosPropostaView />
                    </CardFocus>
                </TabPanel>
                <TabPanel header="Súmula de Crédito">
                    <SumulaPropostaView />
                </TabPanel>
                <TabPanel header="Tempo de análise">
                    <AnalisePropostaView />
                </TabPanel>
                <TabPanel header="Promessa de Crédito">
                    <PromessaPropostaView />
                </TabPanel>
            </TabView>

        </Container>
    );
}
