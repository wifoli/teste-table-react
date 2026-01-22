import { useSimuladorPropostaPage } from "./hook";
import { SimulatorPropostaView } from "./view";

export function SimuladorPropostaPage() {
    const vm = useSimuladorPropostaPage();
    return <SimulatorPropostaView {...vm} />;
}
