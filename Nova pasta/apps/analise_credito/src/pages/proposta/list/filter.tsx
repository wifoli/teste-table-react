import {
    FormCol,
    InputGroup,
    InputMask,
    InputNumber,
    InputText,
    MaskPresets,
    MultiSelect,
} from "@front-engine/ui";
import { CurrencyCircleDollarIcon, IdentificationCardIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { ListFiltersProps } from "./types";
import { TableFilters } from "@front-engine/ui";

export const ListPropostaFilter: React.FC<ListFiltersProps> = ({
    filters,
}) => {

    const getCpfCnpjMask = (value = "") =>
        String(value).replace(/\D/g, "").length > 11
            ? MaskPresets.CNPJ
            : MaskPresets.CPF;

    return (
        <TableFilters
            filters={filters}
        >
            <FormCol span={2}>
                <InputMask
                    label="CPF/CNPJ"
                    placeholder="000.000.000-00..."
                    mask={getCpfCnpjMask(filters?.draft?.cpfCnpjTomador)}
                    fullWidth
                    value={filters?.draft?.cpfCnpjTomador}
                    onChange={e => filters.setDraftValue('cpfCnpjTomador', e)}
                    unmask
                    startAddon={<IdentificationCardIcon size={24} />}
                />
            </FormCol>

            <FormCol span={4}>
                <InputText
                    label="Nome/Razão Social"
                    placeholder="Digite o nome ou razão social..."
                    fullWidth
                    value={filters?.draft?.nomeTomador}
                    onChange={e => filters.setDraftValue('nomeTomador', e.target.value)}
                    startAddon={<MagnifyingGlassIcon size={24} />}
                />
            </FormCol>

            <FormCol span={2}>
                <InputNumber
                    label="Número da Proposta"
                    placeholder="Digite o número da proposta..."
                    fullWidth
                    useGrouping={false}
                    value={filters?.draft?.numero}
                    onChange={e => filters.setDraftValue('numero', e)}
                    startAddon={<MagnifyingGlassIcon size={24} />}
                />
            </FormCol>

            <FormCol span={4}>
                <MultiSelect
                    label="Linha de Crédito"
                    placeholder="Selecione a linha de crédito..."
                    options={[
                        { label: "Crédito Pessoal", value: "credito_pessoal" },
                        { label: "Crédito Imobiliário", value: "credito_imobiliario" },
                        { label: "Crédito Consignado", value: "credito_consignado" },
                        { label: "Crédito Empresarial", value: "credito_empresarial" },
                    ]}
                    fullWidth
                    selectAll
                    searchable
                    value={filters?.draft?.linha}
                    onChange={e => filters.setDraftValue('linha', e)}
                    startAddon={<MagnifyingGlassIcon size={24} />}
                />
            </FormCol>

            <FormCol span={3}>
                <MultiSelect
                    label="Última Fase da Operação"
                    placeholder="Selecione a última fase da operação..."
                    options={[
                        { label: "Análise de Crédito", value: "analise_de_credito" },
                        { label: "Aprovação", value: "aprovacao" },
                        { label: "Liberação de Recursos", value: "liberacao_de_recursos" },
                        { label: "Emissão de Contrato", value: "emissao_de_contrato" },
                    ]}
                    fullWidth
                    selectAll
                    searchable
                    value={filters?.draft?.descricaoUltimaFase}
                    onChange={e => filters.setDraftValue('descricaoUltimaFase', e)}
                    startAddon={<MagnifyingGlassIcon size={24} />}
                />
            </FormCol>

            <FormCol span={3}>
                <MultiSelect
                    label="Canal de Origem"
                    placeholder="Selecione o canal de origem..."
                    options={[
                        { label: "Agência", value: "agencia" },
                        { label: "Internet Banking", value: "internet_banking" },
                        { label: "Aplicativo Móvel", value: "aplicativo_movel" },
                        { label: "Correspondente Bancário", value: "correspondente_bancario" },
                    ]}
                    fullWidth
                    selectAll
                    searchable
                    value={filters?.draft?.canal}
                    onChange={e => filters.setDraftValue('canal', e)}
                    startAddon={<MagnifyingGlassIcon size={24} />}
                />
            </FormCol>

            <FormCol span={4}>
                <InputGroup
                    startAddon={<CurrencyCircleDollarIcon size={24} />}
                    fullWidth
                    label="Valor da Proposta"
                >
                    <InputNumber
                        placeholder="Digite o valor mínimo..."
                        fullWidth
                        mode="currency"
                        value={filters?.draft?.valorMin}
                        onChange={e => filters.setDraftValue('valorMin', e)}
                    />
                    <InputNumber
                        placeholder="Digite o valor máximo..."
                        fullWidth
                        mode="currency"
                        value={filters?.draft?.valorMax}
                        onChange={e => filters.setDraftValue('valorMax', e)}
                    />
                </InputGroup>
            </FormCol>

        </TableFilters>
    );
}
