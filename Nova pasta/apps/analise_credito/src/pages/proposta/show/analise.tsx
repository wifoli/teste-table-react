import { Button, ButtonGradient, CardGradient, ButtonGroup, DataTable } from "@front-engine/ui";
import { AirplaneTakeoffIcon, HandWithdrawIcon, PauseCircleIcon, ProjectorScreenChartIcon, ReceiptXIcon, RewindIcon } from "@phosphor-icons/react";


export function AnalisePropostaView() {
    return (
        <CardGradient header_icon={<ProjectorScreenChartIcon weight="duotone" size={30} />} header="Estatísticas da Análise - Em Construção"
            header_actions={
                <ButtonGroup>
                    <ButtonGradient
                        icon={<AirplaneTakeoffIcon size={20} />}
                        label="Submeter"
                    />
                    <Button
                        icon={<RewindIcon size={20} />}
                        label="Devolver"
                    />
                    <Button
                        icon={<ReceiptXIcon size={20} />}
                        label="Cancelar"
                    />
                    <ButtonGradient
                        icon={<HandWithdrawIcon size={20} />}
                        intent="quaternary"
                        label="Assumir Proposta"
                    />
                    <Button
                        icon={<PauseCircleIcon size={20} />}
                        intent="secondary"
                        label="Pausar Análise"
                    />
                </ButtonGroup>
            }
        >
            <DataTable data={[]} columns={[
                { field: 'id', header: 'ID' },
                { field: 'analista', header: 'Analista' },
                { field: 'fase', header: 'Fase' },
                { field: 'analise_finalizada', header: 'Analise Finalizada'},
                { field: 'status', header: 'Status'},
                { field: 'tempo_analise', header: 'Tempo de análise'},
                { field: 'tempo_inicio', header: 'Tempo Início'},
                { field: 'tempo_finalizado', header: 'Tempo Finalizado'},
                { field: 'pausas', header: 'Pausas'},
                { field: 'tempo_pausado', header: 'Tempo Pausado'},
                { field: 'analise_pausa', header: 'Análise e Pausa'},
            ]}/>
        </CardGradient>
    );
}