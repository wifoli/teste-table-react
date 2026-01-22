import { Proposta } from "@front-engine/api";
import { useTableQuery } from "@front-engine/utils-react";
import { propostaService } from "@front-engine/api";
import { ListPropostaFilters, ListPropostaProps } from "./types";


export function useListProposta(): ListPropostaProps {
    const table = useTableQuery<Proposta, ListPropostaFilters>({
        fetchFn: (params) => propostaService.listPaginated(params),
        arrayFields: ["linha", "descricaoUltimaFase", "canal"],
    });

    return {
        ...table,
    };
}
