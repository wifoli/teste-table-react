import { pessoaService } from "@front-engine/api";
import { AutoCompleteOption } from "@front-engine/ui";
import { cpf, cnpj } from "@front-engine/utils-ts/formatters";

export type OnSearchPessoa = (query: string) => Promise<AutoCompleteOption[]>;

export type UsePessoaSearchReturn = {
    onSearchPessoa: OnSearchPessoa;
};

export function usePessoaSearch(): UsePessoaSearchReturn {
    const onSearch = async (query: string): Promise<AutoCompleteOption[]> => {
        try {
            const response = await pessoaService.listPaginated({
                search: query,
                pageSize: 50,
                isSmartSearch: true,
            });
            const completedOptions = response.data.map((pessoa) => {
                const cpfCnpj =
                    pessoa.cpfCnpj?.length <= 11 ? cpf(pessoa.cpfCnpj) : cnpj(pessoa.cpfCnpj);

                return {
                    label: pessoa.nomeRazaoSocial + " - " + cpfCnpj,
                    value: pessoa.cpfCnpj,
                };
            });

            return Promise.resolve<AutoCompleteOption[]>(completedOptions);
        } catch (error) {
            console.error("Error fetching pessoas:", error);
            return Promise.resolve<AutoCompleteOption[]>([]);
        }
    };

    return {
        onSearchPessoa: onSearch,
    };
}
