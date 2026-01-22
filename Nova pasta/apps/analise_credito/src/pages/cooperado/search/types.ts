import { AutoCompleteOption } from "@front-engine/ui";
import { OnSearchPessoa } from "@front-engine/utils-react";



export type SearchCooperadoProps = {
    onSearch: OnSearchPessoa;
    selectedPessoa: AutoCompleteOption | null;
    setSelectedPessoa: (value: AutoCompleteOption | null) => void;
    enabledSubmit: boolean;
    goToPessoaDetails: () => void;
};