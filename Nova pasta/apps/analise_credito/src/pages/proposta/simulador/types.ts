import { Sumula } from "@front-engine/api";
import { StepperRef } from "@front-engine/ui";
import { UseFormResult } from "@front-engine/utils-react";

export type SimuladorPropostaFirstStepperProps = {
    submitSumula: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    isSubmitting: boolean;
    setSumulaEstudoFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export type SimuladorPropostaSecondStepperProps = {
    submitPolitica: () => void;
    returnToFirstStep: () => void;
    form : UseFormResult<Sumula>;
}

export type SimuladorPropostaProps = {
    stepperRef: React.RefObject<StepperRef | null>;
    activeStep: number;
    onChangeStep: (e: { index: number }) => void;
    firstStep: SimuladorPropostaFirstStepperProps;
    secondStep: SimuladorPropostaSecondStepperProps;
}