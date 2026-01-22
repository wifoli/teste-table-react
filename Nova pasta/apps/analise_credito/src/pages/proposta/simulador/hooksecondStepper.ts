import { StepperRef } from "@front-engine/ui";
import { SimuladorPropostaSecondStepperProps } from "./types";
import { UseFormResult } from "@front-engine/utils-react";
import { Sumula } from "@front-engine/api";

export const useSimuladorPropostaSecondStepper = (
    stepperRef: React.RefObject<StepperRef | null>,
    form: UseFormResult<Sumula>
): SimuladorPropostaSecondStepperProps => {
    const confirm = () => {
        console.log("Confirming and moving to next step");
        stepperRef.current?.nextCallback();
    };

    const returnToFirstStep = () => {
        console.log("Returning to first step");
        stepperRef.current?.prevCallback();
    }

    const submitPolitica = () => {
        // Logic to handle file upload confirmation
        console.log("Política submitted");
    };

    return {
        submitPolitica: confirm,
        returnToFirstStep,
        form,
    };
}