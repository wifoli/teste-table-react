import { Caption, Container, Heading1, TabView, VStack } from "@front-engine/ui";
import { TabPanel } from "primereact/tabview";
import { SumulaPropostaView } from "../../proposta/show/sumula";
import { AnalisePropostaView } from "../../proposta/show/analise";
import { PromessaPropostaView } from "../../proposta/show/promessa";
import { CooperadoInfoView } from "./cooperado";



export function ShowCooperadoView() {
    return (
        <Container maxWidth="full" className="flex flex-col gap-4 !bg-white/80">

            <VStack spacing={0}>
                <Heading1>Dados do Cooperado</Heading1>
                <Caption>Informações cadastrais e financeiras do cooperado.</Caption>
            </VStack>

            <TabView className="overflow-visible">
                <TabPanel header="Cooperado">
                    <CooperadoInfoView />
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
