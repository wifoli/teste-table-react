import {
    ButtonGradient,
    Caption,
    Container,
    Divider,
    FileUpload,
    FormActions,
    FormCol,
    FormLayout,
    Heading1,
    VStack
} from "@front-engine/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";


export function BulkCreatePropostaView() {

    return (
        <Container maxWidth="lg">
            <VStack spacing={0} className="mb-4">
                <Heading1>Inserção da Mesa</Heading1>
                <Caption>
                    Realize o envio dos arquivos da mesa de operações para atualização e
                    consolidação do ambiente de propostas de crédito.
                </Caption>
                <Divider className="my-4" />
            </VStack>

            <FormLayout responsive={false} columns={2} gap={3}>
                <FormCol span={2}>
                    <FileUpload chooseLabel="Empréstimo" label="Empréstimo" />
                    <Divider></Divider>
                </FormCol>
                <FormCol span={2}>
                    <FileUpload chooseLabel="Limites" label="Limites" />
                    <Divider></Divider>
                </FormCol>
                <FormCol span={2}>
                    <FileUpload chooseLabel="Consignado" label="Consignado" />
                    <Divider></Divider>
                </FormCol>
                <FormCol span={2}>
                    <FileUpload chooseLabel="Rural" label="Rural" />
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Sara.csv" label="Sara.csv" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Sara Power BI" label="Sara Power BI" />
                </FormCol>
            </FormLayout>

            <FormActions className="w-full">
                <ButtonGradient
                    icon={<MagnifyingGlassIcon size={20} />}
                    className="w-full"
                    label="Inserir"
                    type="submit"
                />
            </FormActions>
        </Container>
    );
}
