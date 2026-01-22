import { Card, TabView, DataTable, Flex, Heading4, Caption } from "@front-engine/ui";
import { FloppyDiskBackIcon } from "@phosphor-icons/react/dist/icons/FloppyDiskBack";
import { TabPanel } from "primereact/tabview";


export function AnotacoesView() {
    return (
        <Card>
            <Flex direction="col" gap={1} className="!text-deep-teal mb-2">
                <Flex direction="row" gap={2}>
                    <FloppyDiskBackIcon weight="duotone" size={24} />
                    <Heading4 className="!text-deep-teal">Histórico de Anotações</Heading4>
                </Flex>
                <Caption>Registros vigentes e baixados vinculados ao cooperado</Caption>
            </Flex>

            <TabView className="overflow-visible">
                <TabPanel className="overflow-visible" header="Anotações Vigentes">
                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                        { field: 'mes', header: 'Mês' },
                        { field: 'qtd_anotacoes', header: 'Total de Anotações' },
                        { field: 'valor_total_anotacoes', header: 'Valor Total das Anotações'},
                    ]}>
                    </DataTable>
                </TabPanel>
                <TabPanel className="overflow-visible" header="Anotações Baixadas">
                    <DataTable className="p-simple-turquoise" data={[]} columns={[
                        { field: 'mes', header: 'Mês' },
                        { field: 'qtd_anotacoes', header: 'Total de Anotações' },
                        { field: 'valor_total_anotacoes', header: 'Valor Total das Anotações'},
                    ]}>
                    </DataTable>
                </TabPanel>
            </TabView>
        </Card>
    );
}