import { ListPropostaView } from "./view";
import { useListProposta } from "./hook";
import { ListHistoryPropostaView } from "./history_view";


export const PainelPropostaPage: React.FC = () => {
    const vm = useListProposta();
    return <ListPropostaView {...vm} />;
};

export const HistoryPropostaPage: React.FC = () => {
    const vm = useListProposta();
    return <ListHistoryPropostaView {...vm} />;
};