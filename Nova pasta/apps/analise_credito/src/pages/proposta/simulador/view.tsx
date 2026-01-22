import { Heading4, Stepper, StepperPanel } from "@front-engine/ui";
import { Container, Divider, Heading1, VStack } from "@front-engine/ui";
import { SimuladorPropostaFirstStepper } from "./firstStepper";
import { SimuladorPropostaSecondStepper } from "./secondStepper";
import { SimuladorPropostaProps } from "./types";
import { SimuladorPropostaThirdStepper } from "./thirdStepper";

export const SimulatorPropostaView: React.FC<SimuladorPropostaProps> = ({
    stepperRef, firstStep, secondStep, activeStep, onChangeStep
}) => {

    const subtitle = () => {
        switch (activeStep) {
            case 0:
                return "Faça o upload da súmula na fase de estudo para iniciar a simulação";
            case 1:
                return "Preencha os campos necessários para a simulação da proposta";
            default:
                return "";
        }
    }

    return (
        <Container maxWidth="2xl">
            <VStack spacing={0} className="mb-4">
                <Heading1>Simulador de Propostas</Heading1>
                <Heading4 className="text-turquoise">
                    {subtitle()}
                </Heading4>
                <Divider className="my-4" />
            </VStack>

            <Stepper 
                ref={stepperRef} 
                linear 
                style={{ flexBasis: '50rem' }} 
                orientation="vertical"
                activeStep={activeStep}
                onChangeStep={onChangeStep}
            >
                <StepperPanel header="Súmulas de Estudo">
                    <SimuladorPropostaFirstStepper {...firstStep} />
                </StepperPanel>
                <StepperPanel header="Campos da Simulação">
                    <SimuladorPropostaSecondStepper {...secondStep} />
                </StepperPanel>
                <StepperPanel header="Resultados da Simulação">
                    <SimuladorPropostaThirdStepper />
                </StepperPanel>
            </Stepper>
        </Container>
    );
}
