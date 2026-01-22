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


export function BulkCreateCooperadoView() {

    return (
        <Container maxWidth="full">
            <VStack spacing={0} className="mb-4">
                <Heading1>Inserção de Dados dos Cooperados</Heading1>
                <Caption>
                    Realize o envio dos arquivos de inserção para atualização dos dados dos cooperados
                </Caption>
                <Divider className="my-4" />
            </VStack>

            <FormLayout responsive={false} columns={2} gap={3}>
                <FormCol span={1}>
                    <FileUpload chooseLabel="CPF/CNPJ" label="CPF/CNPJ" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload multiple chooseLabel="Anotações" label="Anotações" />
                </FormCol>
                <FormCol span={2}>
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Aplicações" label="Aplicações" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Bens" label="Bens" />
                </FormCol>
                <FormCol span={2}>
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Cliente" label="Cliente" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Conglomerado - Sócios" label="Conglomerado - Sócios" />
                </FormCol>
                <FormCol span={2}>
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Conta Capital" label="Conta Capital" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="CRL" label="CRL" />
                </FormCol>
                <FormCol span={2}>
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Endereços" label="Endereços" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Lançamentos C/C" label="Lançamentos C/C" />
                </FormCol>
                <FormCol span={2}>
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="PA Inad" label="PA Inad" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Renda/Faturamento" label="Renda/Faturamento" />
                </FormCol>
                <FormCol span={2}>
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload multiple chooseLabel="Operações/CC/Cartão/Cobranca/GR5" label="Operações/CC/Cartão/Cobranca/GR5" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload multiple chooseLabel="Garantias" label="Garantias" />
                </FormCol>
                <FormCol span={2}>
                    <Divider></Divider>
                </FormCol>
                <FormCol span={1}>
                    <FileUpload multiple chooseLabel="Limites/Liquidez" label="Limites/Liquidez" />
                </FormCol>
                <FormCol span={1}>
                    <FileUpload chooseLabel="Cheques" label="Cheques" />
                </FormCol>
            </FormLayout>

            <FormActions className="w-full">
                <ButtonGradient
                    icon={<MagnifyingGlassIcon size={20} />}
                    className="w-full"
                    label="Inserir"
                    type="submit"
                    size="large"
                />
            </FormActions>
        </Container>
    );
}
