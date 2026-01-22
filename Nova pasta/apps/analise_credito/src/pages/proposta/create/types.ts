import { CanalProposta, PropostaForm, TipoProposta } from "@front-engine/api";
import { OnSearchPessoa, UseFormResult } from "@front-engine/utils-react";

export type PropostaCreateProps = {
    tipoPropostaOptions: { label: string; value: TipoProposta }[];
    canalPropostaOptions: { label: string; value: CanalProposta }[];
    form: UseFormResult<PropostaForm>;
    isloading: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    onSearchPessoa: OnSearchPessoa;
    hideField: (fieldName: keyof PropostaForm) => boolean;
}