import { Heading4, Card, Grid, GridItem, Title, Body, Flex, Accordion, DataTable, Divider, Caption, Center } from "@front-engine/ui";
import { BookmarksIcon, BuildingsIcon, ChartBarIcon, ChartLineIcon, DropIcon, GlobeIcon, HandshakeIcon, MapPinAreaIcon, NavigationArrowIcon, ReceiptXIcon, VaultIcon } from "@phosphor-icons/react";
import { AccordionTab } from "primereact/accordion";
import { Fieldset } from "primereact/fieldset";


export function DadosGeraisView() {
    return (
            <Grid cols={3}>
                <GridItem>
                    <Card>
                        <Flex direction="row" align="center" gap={2}>
                            <BuildingsIcon size={24} weight="duotone" color="#003641" />
                            <Heading4 className="!text-deep-teal">Conta Capital</Heading4>
                        </Flex>
                        <Grid className="grid-cols-[auto_1fr] items-center mt-4" gapX={4} gapY={2}>
                            <Title>Número</Title>
                            <Body>936</Body>
                            <Title>Situação</Title>
                            <Body>ATIVO</Body>
                            <Title>Valor Integralizado</Title>
                            <Body>R$ 156.470,58</Body>
                            <Title>Data da Matrícula</Title>
                            <Body>25/02/2008 - 17 anos, 10 meses e 26 dias</Body>
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem>
                    <Card>
                        <Flex direction="row" align="center" gap={2}>
                            <ChartBarIcon size={24} weight="duotone" color="#003641" />
                            <Heading4 className="!text-deep-teal">Indicadores Consolidados</Heading4>
                        </Flex>
                        <Grid className="grid-cols-[auto_1fr] items-center mt-4" gapX={4} gapY={2}>
                            <Title>SOC</Title>
                            <Body>12,63%</Body>
                            <Title>IAP</Title>
                            <Body>6</Body>
                            <Title>Quadrante</Title>
                            <Body>Q1</Body>
                            <Title>Rentabilidade</Title>
                            <Body>R$ 1.922,76</Body>
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem>
                    <Card>
                        <Flex direction="row" align="center" gap={2}>
                            <NavigationArrowIcon size={24} weight="duotone" color="#003641" />
                            <Heading4 className="!text-deep-teal">Referência da Operação</Heading4>
                        </Flex>
                        <Grid className="grid-cols-[auto_1fr] items-center mt-4" gapX={4} gapY={2}>
                            <Title>Nº Proposta</Title>
                            <Body>264255451601</Body>
                            <Title>Dados do PA</Title>
                            <Body>PA 90 - SICOOB - PA PLATAFORMA PJ</Body>
                            <Title>Saldo Devedor PA</Title>
                            <Body>R$ 130.843.345,36</Body>
                            <Title>INAD 90</Title>
                            <Body>3,92% - R$ 5.129.191,16</Body>
                        </Grid>
                    </Card>
                </GridItem>
                <GridItem colSpan={3}>
                    <Accordion multiple>
                        <AccordionTab header="Desconto de Títulos e Cheques Devolvidos" icon={<BookmarksIcon size={24} weight="duotone" />} caption="Resumo de títulos descontados e cheques não compensados referentes aos motivos 11, 12 e 21">
                            <Grid gap={6}>
                                <Fieldset legend={
                                        <Flex direction="col">
                                            <Flex direction="row" gap={2}>
                                                <DropIcon weight="duotone" size={24} />
                                                <Heading4>Liquidez de Títulos</Heading4>
                                            </Flex>
                                            <Caption>Apuração da liquidez dos títulos descontados</Caption>
                                        </Flex>
                                    } toggleable>
                                    <Grid cols={3} gapX={0} gapY={3} className="mb-6">
                                        <GridItem colSpan={3}>
                                            <Heading4>Indicadores</Heading4>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Valor Limite Concedido</Title>
                                            <Body>R$ 1.200.000,00</Body>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Valor Utilizado</Title>
                                            <Body>R$ 513.212,54</Body>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Prazo Médio da Carteira</Title>
                                            <Body>48 dias</Body>
                                        </GridItem>
                                    </Grid>

                                    <Grid cols={2}>
                                        <Grid gapX={0} gapY={3} cols={3}>
                                            <GridItem colSpan={3}>
                                                <Heading4>Duplicata</Heading4>
                                                <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-2"></Divider>
                                            </GridItem>
                                            <GridItem>
                                                <Title>Valor Médio</Title>
                                                <Body>R$ 445,48</Body>
                                            </GridItem>
                                            <GridItem>
                                                <Title>Liquidez Vencimento</Title>
                                                <Body>68,22%</Body>
                                            </GridItem>
                                            <GridItem>
                                                <Title>% Concentração</Title>
                                                <Body>1,65%</Body>
                                            </GridItem>
                                        </Grid>
                                        <Grid gapX={0} gapY={3} cols={3}>
                                            <GridItem colSpan={3}>
                                                <Heading4>Cheque</Heading4>
                                                <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-2"></Divider>
                                            </GridItem>
                                            <GridItem>
                                                <Title>Valor Médio</Title>
                                                <Body>R$ 445,48</Body>
                                            </GridItem>
                                            <GridItem>
                                                <Title>Liquidez Vencimento</Title>
                                                <Body>68,22%</Body>
                                            </GridItem>
                                            <GridItem>
                                                <Title>% Concentração</Title>
                                                <Body>1,65%</Body>
                                            </GridItem>
                                        </Grid>
                                    </Grid>
                                </Fieldset>

                                <Fieldset legend={
                                        <Flex direction="col">
                                            <Flex direction="row" gap={2}>
                                                <ReceiptXIcon weight="duotone" size={24} />
                                                <Heading4>Cheques Devolvidos</Heading4>
                                            </Flex>
                                            <Caption>Resumo dos cheques não compensados nos motivos 11, 12 e 21</Caption>
                                        </Flex>
                                    } toggleable>
                                    <Grid cols={3}>
                                        <GridItem>
                                            <Grid gap={3}>
                                                <Heading4>Motivo 11</Heading4>
                                                <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-0"></Divider>
                                                <Grid cols={2} gap={1}>
                                                    <GridItem>                                                        
                                                        <Title>Valor total</Title>
                                                        <Body>R$ 1.200.000,00</Body>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Title>Quantidade</Title>
                                                        <Body>0</Body>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </GridItem>
                                        <GridItem>
                                            <Grid gap={3}>
                                                <Heading4>Motivo 12</Heading4>
                                                <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-0"></Divider>
                                                <Grid cols={2} gap={1}>
                                                    <GridItem>                                                        
                                                        <Title>Valor total</Title>
                                                        <Body>R$ 1.200.000,00</Body>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Title>Quantidade</Title>
                                                        <Body>0</Body>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </GridItem>
                                        <GridItem>
                                            <Grid gap={3}>
                                                <Heading4>Motivo 21</Heading4>
                                                <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-0"></Divider>
                                                <Grid cols={2} gap={1}>
                                                    <GridItem>                                                        
                                                        <Title>Valor total</Title>
                                                        <Body>R$ 1.200.000,00</Body>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Title>Quantidade</Title>
                                                        <Body>0</Body>
                                                    </GridItem>
                                                </Grid>
                                            </Grid>
                                        </GridItem>
                                    </Grid>
                                </Fieldset>
                            </Grid>
                        </AccordionTab>
                        <AccordionTab header="Informações do CRL" icon={<ChartLineIcon weight="duotone" size={24} />} caption="Consulta sobre o cálculo de risco e limites">
                            <DataTable className="p-simple-turquoise" data={[]} columns={[
                                { field: 'descricao', header: 'Descrição portifólio' },
                                { field: 'risco', header: 'Nível Risco' },
                                { field: 'valor_limite_concedido', header: 'Valor Limite Concedido'},
                                { field: 'valor_limite_utilizado', header: 'Valor Limite Utilizado'},
                                { field: 'situacao_limite', header: 'Situação Limite'},
                            ]}>
                            </DataTable>
                        </AccordionTab>
                        <AccordionTab header="Dados Societários" icon={<HandshakeIcon weight="duotone" size={24} />} caption="Cadastro societário e participação dos sócios">
                            <Grid cols={2}>
                                <GridItem>
                                    <Center>
                                        <Heading4 className="!text-deep-teal">Quadro Societário SISBR</Heading4>
                                    </Center>
                                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                                        { field: 'contrato', header: 'Nome' },
                                        { field: 'cooperado', header: 'CPF' },
                                        { field: 'tipo', header: 'Tipo Relacionamento'},
                                        { field: 'valor_garantia', header: 'Capital da Empresa'},
                                    ]}>
                                    </DataTable>
                                </GridItem>
                                <GridItem>
                                    <Center>
                                        <Heading4 className="!text-deep-teal">Quadro Societário PROCOB</Heading4>
                                    </Center>
                                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                                        { field: 'contrato', header: 'Nome' },
                                        { field: 'cooperado', header: 'CPF' },
                                        { field: 'tipo', header: 'Tipo Relacionamento'},
                                        { field: 'valor_garantia', header: 'Capital da Empresa'},
                                    ]}>
                                    </DataTable>
                                </GridItem>
                            </Grid>
                        </AccordionTab>
                        <AccordionTab header="Composição do Grupo Econômico" icon={<GlobeIcon weight="duotone" size={24} />} caption="Resumo da estrutura e vínculos do grupo econômico">
                            <Card className="shadow-none mb-4">
                                <Grid cols={5}>
                                    <GridItem>
                                        <Title>Descrição</Title>
                                        <Body>ACQUA COMERCIAL</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Endividamento Cooperativa</Title>
                                        <Body>R$ 1.486.288,32</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Endividamento Bacen</Title>
                                        <Body>R$ 1.489.845,81</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Integralização Conta Capital</Title>
                                        <Body>R$ 130.989,74</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Patrimônio Grupo</Title>
                                        <Body>R$ 1.569.876,32</Body>
                                    </GridItem> 
                                </Grid>
                            </Card>
                            <DataTable className="p-simple-turquoise" data={[]} columns={[
                                { field: 'cpf_cnpj', header: 'CPF/CNPJ' },
                                { field: 'cooperado', header: 'Nome/Razão Social' },
                                { field: 'saldo_devedor', header: 'Saldo Devedor Cooperativa'},
                                { field: 'saldo_devedor_bacen', header: 'Saldo Devedor Bacen'},
                                { field: 'valor_total_capital', header: 'Valor Total Capital'},
                                { field: 'valor_total_bens', header: 'Valor Total Bens'},
                                { field: 'risco', header: 'Risco'},
                            ]}>
                            </DataTable>
                        </AccordionTab>
                        <AccordionTab header="Endereço do Cooperado" icon={<MapPinAreaIcon weight="duotone" size={24} />} caption="Informações de endereço e localização do cooperado">
                            <Card className="shadow-none">
                                <Grid cols={6}>
                                    <GridItem>
                                        <Title>Tipo Logradouro</Title>
                                        <Body>AVENIDA</Body>
                                    </GridItem>
                                    <GridItem colSpan={3}>
                                        <Title>Logradouro</Title>
                                        <Body>GENERCY DELFINO COELHO</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Nº Logradouro</Title>
                                        <Body>181</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>UF</Title>
                                        <Body>PR</Body>
                                    </GridItem>
                                    <GridItem>
                                        <Title>Bairro</Title>
                                        <Body>CENTRO</Body>
                                    </GridItem> 
                                    <GridItem>
                                        <Title>Município</Title>
                                        <Body>ICARAÍMA</Body>
                                    </GridItem> 
                                    <GridItem colSpan={4}>
                                        <Title>Complemento</Title>
                                        <Body>BRCAO B QUADRA26 LOTE 14 E 15</Body>
                                    </GridItem> 
                                </Grid>
                            </Card>
                        </AccordionTab>
                        <AccordionTab header="Bens Patrimoniais" icon={<VaultIcon weight="duotone" size={24} />} caption="Detalhes do patrimônio declarado e registrado">
                            <Card className="shadow-none mb-4">
                                <Grid className="grid-cols-[1fr_2fr]">
                                    <Grid cols={2} gap={1}>
                                        <GridItem colSpan={2}>
                                            <Heading4>Quant. Total de Bens</Heading4>
                                            <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-1"></Divider>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Valor</Title>
                                            <Body>R$ 19.200.268,08</Body>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Quant. de Bens</Title>
                                            <Body>43</Body>
                                        </GridItem>
                                    </Grid>
                                    <Grid cols={4} gap={1}>
                                        <GridItem colSpan={4}>
                                            <Heading4>Quant. Total dos Bens por Tipo</Heading4>
                                            <Divider className="!border-deep-teal-faded-50 !border-[1.5px] !my-1"></Divider>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Bem Imóvel</Title>
                                            <Body>R$ 12.394.680,95</Body>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Quant. de Bens</Title>
                                            <Body>15</Body>
                                        </GridItem>
                                        <GridItem>
                                            <Title>Bem Móvel</Title>
                                            <Body>R$ 6.805.587,13</Body>
                                        </GridItem> 
                                        <GridItem>
                                            <Title>Quant. de Bens</Title>
                                            <Body>28</Body>
                                        </GridItem>
                                    </Grid>
                                </Grid>
                            </Card>
                            <DataTable className="p-simple-turquoise" data={[]} columns={[
                                { field: 'tipo_bem', header: 'Tipo Bem' },
                                { field: 'descricao', header: 'Descrição Bem' },
                                { field: 'area', header: 'Área'},
                                { field: 'status', header: 'Status'},
                                { field: 'quant_bem', header: 'Quant. Bem'},
                                { field: 'propriedade', header: 'Propriedade'},
                                { field: 'valor_participacao', header: 'Valor Participação'},
                                { field: 'valor_bem', header: 'Valor do Bem'},
                                { field: 'data_atualizacao', header: 'Data de Atualização'},
                            ]}>
                            </DataTable>
                        </AccordionTab>
                    </Accordion>
                </GridItem>
            </Grid>
        
    );
}