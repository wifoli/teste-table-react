import { useForm, usePessoaSearch } from "@front-engine/utils-react";
import { PropostaCreateProps } from "./types";
import {
    CanalProposta,
    isValidationError,
    PropostaForm,
    propostaService,
    TipoProposta
} from "@front-engine/api";
import {
    required,
    isType,
    minLength,
    onlyNumbers,
    cpfCnpj,
    isMoney,
    ValidationResult,
    ValidatorFn
} from "@front-engine/utils-ts/validations";

export function usePropostaCreatePage(): PropostaCreateProps {
    const tipoPropostaOptions: { label: string; value: TipoProposta }[] = [
        { label: "Operação", value: 'Operacao' },
        { label: "CRL", value: 'CRL' },
        { label: "Topdesk", value: 'Topdesk' },
        { label: "Demandas Extras", value: 'Demandas Extras' },
    ]
    const canalPropostaOptions: { label: string; value: CanalProposta }[] = [
        { label: "SISBRWEB", value: 'SISBRWEB' },
        { label: "SICOOBNET", value: 'SICOOBNET' },
        { label: "OUTROS", value: 'OUTROS' },
        { label: "TOPDESK", value: 'TOPDESK' },
        { label: "SARA", value: 'SARA' },
    ]
    const { onSearchPessoa } = usePessoaSearch();

    const requiredIfTipoProposta = (fieldName: keyof PropostaForm): ValidatorFn => {
        return (value: any): ValidationResult => {
            const tipoOperacao: TipoProposta = form.values.tipoProposta;

            switch (tipoOperacao) {
                case "Operacao":
                    return required(value);
                case "CRL":
                    if (["tipoProposta", "canal", "pessoaId"].includes(fieldName)) {
                        return required(value);
                    }
                    break;
                case "Topdesk":
                    if (["tipoProposta", "canal", "numero"].includes(fieldName)) {
                        return required(value);
                    }
                    break;
                case "Demandas Extras":
                    if (["tipoProposta", "canal"].includes(fieldName)) {
                        return required(value);
                    }
                    break;
            }

            return { valid: true };
        }
    }

    const hideField = (fieldName: keyof PropostaForm): boolean => {
        const tipoOperacao: TipoProposta = form.values.tipoProposta;

        switch (tipoOperacao) {
            case "Operacao":
                return fieldName === "descricao";

            case "CRL":
                return ["linha", "valor", "numero", "descricao"].includes(fieldName);

            case "Topdesk":
                return ["linha", "valor", "pessoaId", "descricao"].includes(fieldName);

            case "Demandas Extras":
                return ["linha", "valor"].includes(fieldName);

            default:
                return false;
        }
    };


    const form = useForm<PropostaForm>({
        tipoProposta: {
            initialValue: "Operacao",
            validators: [requiredIfTipoProposta("tipoProposta"), isType(["Operacao", "CRL", "Topdesk", "Demandas Extras"])],
        },
        canal: {
            initialValue: undefined,
            validators: [requiredIfTipoProposta("canal"), isType(["SISBRWEB", "SICOOBNET", "OUTROS", "TOPDESK", "SARA"])],
        },
        numero: {
            initialValue: "",
            validators: [requiredIfTipoProposta("numero"), minLength(3), onlyNumbers],
        },
        pessoaId: {
            initialValue: "",
            validators: [requiredIfTipoProposta("pessoaId"), onlyNumbers, cpfCnpj],
        },
        linha: {
            initialValue: "",
            validators: [requiredIfTipoProposta("linha")],
        },
        valor: {
            initialValue: 0,
            validators: [requiredIfTipoProposta("valor"), isMoney],
        },
        descricao: {
            initialValue: "",
            validators: [],
        },
    });

    const onSubmit = async (values: PropostaForm) => {
        try {
            await propostaService.create(values);
        } catch (err: any) {
            if (err && isValidationError(err)) {
                form.setApiErrors(err);
            }
        }
    };

    return {
        tipoPropostaOptions,
        canalPropostaOptions,
        form,
        isloading: form.isSubmitting,
        onSearchPessoa,
        handleSubmit: form.handleSubmit(onSubmit),
        hideField,
    }
}