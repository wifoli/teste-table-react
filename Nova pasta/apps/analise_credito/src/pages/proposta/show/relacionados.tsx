import { BigData, Body, ButtonGradient, CircleRatio, Grid, GridItem, Heading3, SmallData, Title } from "@front-engine/ui";
import { MapPinAreaIcon, ScrollIcon } from "@phosphor-icons/react";


export function RelacionadosPropostaView() {
    return (
        <Grid cols={6} gap={2}>
            <GridItem colSpan={2} rowSpan={2}>
                <Grid className="grid-cols-[auto_1fr]">
                    <CircleRatio className="bg-leaf-green-faded-10 shadow" size="min-w-20 min-h-20 max-w-20 max-h-20">
                        <ScrollIcon color="#7DB61C" size={36} />
                    </CircleRatio>
                    <Grid gap={1}>
                        <Heading3 className="!m-0">CPF: 652.482.289-72</Heading3>
                        <BigData className="!m-0">SULIEN CRISTINA AYMORE BORTOLON</BigData>
                        <SmallData className="!m-0">61 anos, 1 mês e 22 dias</SmallData>
                    </Grid>
                </Grid>
            </GridItem>
            <GridItem>
                <Title>Profissão</Title>
                <Body>PRODUTOR AGROPECUÁRIO, EM GERAL</Body>
            </GridItem>
            <GridItem>
                <Title>Tomador</Title>
                <Body>PF RURAL</Body>
            </GridItem>
            <GridItem>
                <Title>Data de Nascimento</Title>
                <Body>27/11/1964</Body>
            </GridItem>
            <GridItem>
                <Title>Estado Cívil</Title>
                <Body>CASADO(A)</Body>
            </GridItem>
            <GridItem>
                <Title>Renda</Title>
                <Body>R$ 263.169,63 - AGROPECUÁRIA</Body>
            </GridItem>
            <GridItem>
                <Title>Risco</Title>
                <Body>R4</Body>
            </GridItem>
            <GridItem>
                <Title>Relacionamento</Title>
                <Body>Sócio</Body>
            </GridItem>
            <GridItem>
                <ButtonGradient
                    icon={<MapPinAreaIcon size={20} />}
                    className="w-full"
                    intent="tertiary"
                    size="small"
                    label="Redirecionar"
                    type="button"
                />
            </GridItem>
        </Grid>
    );
}