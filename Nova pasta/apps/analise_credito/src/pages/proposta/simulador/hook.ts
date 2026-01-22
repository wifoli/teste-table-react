import { useRef, useState } from "react";
import { SimuladorPropostaProps } from "./types";
import { StepperRef } from "@front-engine/ui";
import { useSimuladorPropostaFirstStepper } from "./hookFirstStepper";
import { useSimuladorPropostaSecondStepper } from "./hooksecondStepper";
import { Sumula } from "@front-engine/api";
import { useForm } from "@front-engine/utils-react";
import { required } from "@front-engine/utils-ts/validations";


export const useSimuladorPropostaPage = (): SimuladorPropostaProps => {
    // Steps config
    const stepperRef = useRef<StepperRef | null>(null);
    const [activeStep, setActiveStep] = useState<number>(0);
    const onChangeStep = (e: { index: number }) => {
        setActiveStep(e.index);
    };

    // Form config
    const form = useForm<Sumula>({
        cpfCnpj: { initialValue: '', validators: [required] },
        numProposta: { initialValue: '', validators: [required] },
        codigoLinha: { initialValue: '', validators: [required] },
        dataProposta: { initialValue: '', validators: [required] },
        linha: { initialValue: '', validators: [required] },
        carencia: { initialValue: 0, validators: [required] },
        carenciaMeses: { initialValue: 0, validators: [required] },
        valorProposta: { initialValue: 0, validators: [required] },
        valorContratado: { initialValue: 0, validators: [required] },
        porcTaxaAoMes: { initialValue: 0, validators: [required] },
        periodicidade: { initialValue: undefined, validators: [required] },
        dataVencimentoPrimeiraParcela: { initialValue: '', validators: [required] },
        valorDespesaTarifa: { initialValue: 0, validators: [required] },
        qtdParcelas: { initialValue: 0, validators: [required] },
        dataVencimentoProposta: { initialValue: '', validators: [required] },
        valorParcela: { initialValue: 0, validators: [required] },
        hasTarifa: { initialValue: false, validators: [required] },
        seguroProposta: { initialValue: '', validators: [required] },
        capacidadePagamento: { initialValue: '', validators: [required] },
        tomadorRisco: { initialValue: '', validators: [required], setter: (value) =>
            typeof value === 'string' && value.startsWith('R') 
            ? value.slice(1)
            : value,  },
        porcPerdaEsperado: { initialValue: 0, validators: [required] },
        valorPerdaEsperada: { initialValue: 0, validators: [required] },
        perfilCarteira: { initialValue: '', validators: [required] },
        ativoProblematico: { initialValue: '', validators: [required] },
        estagioPerdaEsperada: { initialValue: undefined, validators: [required] },
        pdOperacao: { initialValue: 0, validators: [required] },
        dataBacen: { initialValue: '', validators: [required] },
        contaCorrenteId: { initialValue: null, validators: [required] },
        valorTotalDespesas: { initialValue: 0, validators: [required] },
        valorDespesaIof: { initialValue: 0, validators: [required] },
        valorDespesaSeguro: { initialValue: 0, validators: [required] },
        valorDespesaAdicional: { initialValue: 0, validators: [required] },
        porcCetAoMes: { initialValue: 0, validators: [required] },
        porcCetAoAno: { initialValue: 0, validators: [required] },
        porcMultaContratualInadimplido: { initialValue: 0, validators: [required] },
        porcJurosMonetarioAoMes: { initialValue: 0, validators: [required] },
        porcTaxaAoAno: { initialValue: 0, validators: [required] },
        porcJurosMora: { initialValue: 0, validators: [required] },
        sumulaRepac: { initialValue: undefined, validators: [required] },
        garantiasPessoais: { initialValue: [], validators: [required] },
        garantiasReais: { initialValue: [], validators: [required] },
    });


    const firstStep = useSimuladorPropostaFirstStepper(stepperRef, form.setValues, form.validateForm);
    const secondStep = useSimuladorPropostaSecondStepper(stepperRef, form);

    return {
        // Steps
        stepperRef,
        activeStep,
        onChangeStep,
        firstStep,
        secondStep,
    };  
}
