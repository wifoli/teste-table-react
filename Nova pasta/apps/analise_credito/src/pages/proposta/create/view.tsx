import {
    AutoComplete,
    Dropdown,
    InputNumber,
    InputText,
    InputTextarea,
} from "@front-engine/ui";
import {
    ButtonGradient,
    Caption,
    Container,
    Divider,
    FormActions,
    FormCol,
    FormLayout,
    Heading1,
    MultiSelect,
    VStack
} from "@front-engine/ui";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { PropostaCreateProps } from "./types";
import { FormField } from "@front-engine/utils-react";
import { PropostaForm } from "@front-engine/api";


export const CreatePropostaView: React.FC<PropostaCreateProps> = ({
    form,
    isloading,
    tipoPropostaOptions,
    canalPropostaOptions,
    handleSubmit,
    onSearchPessoa,
    hideField,
}) => {
    return (
        <Container maxWidth="lg">
            <VStack spacing={0} className="mb-4">
                <Heading1>Cadastro de Propostas</Heading1>
                <Caption>
                    Inicie uma nova proposta para operações de crédito, CRL,
                    Service Desk ou demandas gerais
                </Caption>
                <Divider className="my-4" />
            </VStack>

            <FormLayout responsive={false} columns={3} gap={2}>
                {!hideField("tipoProposta") && <FormCol span={1}>
                    <FormField<PropostaForm>
                        name="tipoProposta"
                        form={form}
                        label="Tipo Proposta"
                    >
                        <Dropdown
                            fullWidth
                            placeholder="Tipo da Proposta..."
                            options={tipoPropostaOptions}
                            searchable
                            startAddon={<MagnifyingGlassIcon size={24} />}
                        />
                    </FormField>
                </FormCol>}

                {!hideField("canal") && <FormCol span={1}>
                    <FormField<PropostaForm>
                        name="canal"
                        form={form}
                        label="Canal"
                    >
                        <Dropdown
                            fullWidth
                            placeholder="Canal..."
                            options={canalPropostaOptions}
                            searchable
                            startAddon={<MagnifyingGlassIcon size={24} />}
                        />
                    </FormField>
                </FormCol>}

                {!hideField("numero") && <FormCol span={1}>
                    <FormField<PropostaForm>
                        name="numero"
                        form={form}
                        label="Número da Proposta"
                    >
                        <InputText
                            fullWidth
                            placeholder="Número da proposta..."
                            startAddon={<MagnifyingGlassIcon size={24} />}
                        />
                    </FormField>
                </FormCol>}

                {!hideField("pessoaId") && <FormCol span={1}>
                    <FormField<PropostaForm>
                        name="pessoaId"
                        form={form}
                        label="Cooperado"
                    >
                        <AutoComplete
                            fullWidth
                            placeholder="Digite Nome/Razão ou CPF/CNPJ"
                            onSearch={onSearchPessoa}
                            onSelect={(e) => form.handleChange('pessoaId')(e.value)}
                            startAddon={<MagnifyingGlassIcon size={24} />}
                        />
                    </FormField>
                </FormCol>}

                {!hideField("linha") && <FormCol span={2}>
                    <MultiSelect
                        label="Linha de Crédito"
                        placeholder="Selecione uma linha de crédito..."
                        options={[]}
                        searchable
                        fullWidth
                        startAddon={<MagnifyingGlassIcon size={24} />}
                    />
                </FormCol>}

                {!hideField("valor") && <FormCol span={1}>
                    <FormField<PropostaForm>
                        name="valor"
                        form={form}
                        label="Valor da Proposta"
                    >
                        <InputNumber
                            fullWidth
                            placeholder="Valor da proposta..."
                            mode="currency"
                            startAddon={<MagnifyingGlassIcon size={24} />}
                        />
                    </FormField>
                </FormCol>}

                {!hideField("descricao") && <FormCol span={3}>
                    <FormField<PropostaForm>
                        name="descricao"
                        form={form}
                        label="Observação"
                    >
                        <InputTextarea
                            fullWidth
                            placeholder="Descrição (opcional)..."
                            rows={3}
                        />
                    </FormField>
                </FormCol>}
            </FormLayout>

            <FormActions className="w-full">
                <ButtonGradient
                    icon={<MagnifyingGlassIcon size={20} />}
                    className="w-full"
                    label="Cadastrar"
                    type="submit"
                    disabled={isloading}
                    loading={isloading}
                    onClick={handleSubmit}
                />
            </FormActions>
        </Container>
    );
}
