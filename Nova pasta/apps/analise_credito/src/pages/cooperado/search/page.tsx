import { ListCooperadoView } from "./view";
import { useSearchPessoaPage } from "./hook";


export const SearchCooperadoPage: React.FC = () => {
    const vm = useSearchPessoaPage();
    return <ListCooperadoView {...vm} />;
};
