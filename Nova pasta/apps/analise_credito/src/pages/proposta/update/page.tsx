import { UpdatePropostaView } from "./view";


export const UpdateProposta: React.FC = () => {
    const vm = UpdatePropostaView();
    return <UpdatePropostaView {...vm} />;
};
