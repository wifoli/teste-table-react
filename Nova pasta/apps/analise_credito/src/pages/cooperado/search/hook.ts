import { SearchCooperadoProps } from "./types";
import { AutoCompleteOption } from "@front-engine/ui";
import { usePessoaSearch } from "@front-engine/utils-react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


export function useSearchPessoaPage(): SearchCooperadoProps {
    const { onSearchPessoa } = usePessoaSearch();
    const [selectedPessoa, setSelectedPessoa] = useState<AutoCompleteOption | null>(null);
    const [enabledSubmit, setEnabledSubmit] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setEnabledSubmit(selectedPessoa && selectedPessoa.value ? true : false);
    }, [selectedPessoa]);

    const goToPessoaDetails = () => {
        if (selectedPessoa && selectedPessoa.value) {
            navigate(`/cooperado/${selectedPessoa.value}`);
        }
    }

    return {
        onSearch: onSearchPessoa,
        selectedPessoa,
        setSelectedPessoa,
        goToPessoaDetails,
        enabledSubmit,
    }
}
