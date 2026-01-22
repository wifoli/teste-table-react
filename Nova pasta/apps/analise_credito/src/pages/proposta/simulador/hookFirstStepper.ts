import { confirmPopup, StepperRef } from "@front-engine/ui";
import { SimuladorPropostaFirstStepperProps } from "./types";
import { useState } from "react";
import { Sumula, sumulaService } from "@front-engine/api";

export const useSimuladorPropostaFirstStepper = (
    stepperRef: React.RefObject<StepperRef | null>,
    setFormValues: (values: Partial<Sumula>) => void,
    validateForm: () => boolean
): SimuladorPropostaFirstStepperProps => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sumulaEstudoFile, setSumulaEstudoFile] = useState<File | null>(null);

    const confirm = async (event: React.MouseEvent<HTMLElement>) => {
        if (!sumulaEstudoFile) {
            confirmPopup({
                target: event.currentTarget,
                message: 'Se não selecionar um arquivo terá que adicionar a súmula manualmente. Deseja continuar?',
                icon: 'pi pi-exclamation-triangle',
                accept: async () => {
                    await submitSumula();
                    stepperRef.current?.nextCallback();
                },
            });
        } else {
            await submitSumula();
            stepperRef.current?.nextCallback();
        }
    };

    const submitSumula = async () => {
        setIsSubmitting(true);
        try {
            const response = await sumulaService.extractFromPdf({
                sumulaEstudoFile: sumulaEstudoFile!,
            });

            setFormValues(response)
        } catch (error) {
            console.error('Erro ao extrair súmula:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submitSumula: confirm,
        isSubmitting,
        setSumulaEstudoFile,
    };
}