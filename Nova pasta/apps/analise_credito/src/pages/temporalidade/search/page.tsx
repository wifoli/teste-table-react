import { ListTempoAnaliseView } from "./view";


export const PesquisaTemporalidadePage: React.FC = () => {
    const vm = ListTempoAnaliseView();
    return <ListTempoAnaliseView {...vm} />;
};
