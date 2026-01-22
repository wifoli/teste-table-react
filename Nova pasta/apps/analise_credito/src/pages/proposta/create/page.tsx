import { usePropostaCreatePage } from "./hook";
import { CreatePropostaView } from "./view";

export function CreatePropostaPage() {
    const vm = usePropostaCreatePage();
    return <CreatePropostaView {...vm} />;
}
