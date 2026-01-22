import { Button, CardGradient, DataTable } from "@front-engine/ui";
import { GavelIcon, RowsPlusBottomIcon } from "@phosphor-icons/react";


export function PromessaPropostaView() {
    return (
        <CardGradient header_icon={<GavelIcon weight="duotone" size={30} />} header="Controle de Promessas" header_actions={
            <>
                <Button
                    icon={<RowsPlusBottomIcon size={20} />}
                    label="Adicionar Promessa"
                    intent="secondary"
                />
            </>
        }>
            <DataTable data={[]} columns={[
                { field: 'produto', header: 'Produto' },
                { field: 'valor', header: 'Valor' },
                { field: 'atribuicao', header: 'Data de Atribuição' },
                { field: 'prazo_limite', header: 'Prazo Limite'},
                { field: 'status', header: 'Status'},
                { field: 'obs', header: 'Observação'},
                { field: 'acoes', header: 'Ações'},
            ]}/>
        </CardGradient>
    );
}