import { InsightPropostaView } from "./view";
import { useListProposta } from "./hook";

export const InsightPropostaPage: React.FC = () => {
    const vm = useListProposta();
    return <InsightPropostaView {...vm} />;
};