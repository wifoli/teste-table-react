/**
 * =============================================================================
 * EXEMPLO DE SECONDSTEPPER OTIMIZADO
 * =============================================================================
 * 
 * Este arquivo mostra como migrar o formulário para evitar re-renders desnecessários.
 * 
 * PRINCIPAIS MUDANÇAS:
 * 1. Usar o novo FormField que usa subscriptions granulares
 * 2. Mover componentes memoizados para FORA do componente pai
 * 3. Usar o componente FormArray para arrays
 * 4. Não acessar form.values diretamente no componente pai
 */

import { memo, useCallback, useMemo } from "react";
import { 
    ButtonGradient, Calendar, Caption, Card, Divider, FormActions, 
    FormCol, FormLayout, Heading2, InputMask, InputNumber, InputText, VStack 
} from "@front-engine/ui";
import { 
    ArrowClockwiseIcon, CalendarDotsIcon, ChartLineUpIcon, CoinsIcon, 
    CoinVerticalIcon, HandCoinsIcon, HashIcon, HashStraightIcon, 
    MoneyWavyIcon, PercentIcon, PiggyBankIcon, PlusCircleIcon, 
    ShieldIcon, TipJarIcon, UserCircleIcon, WarningCircleIcon, 
    WarningIcon, WarningOctagonIcon 
} from "@phosphor-icons/react";
import { GarantiaPessoal, GarantiaReal, Sumula } from "@front-engine/api";
import { FormField, FormArray, useFormField } from "./FormFieldOptimized";
import type { UseFormResult } from "./useFormOptimized";

// ============================================================================
// TIPOS
// ============================================================================

interface SimuladorPropostaSecondStepperProps {
    submitPolitica: () => void;
    returnToFirstStep: () => void;
    form: UseFormResult<Sumula>;
}

// ============================================================================
// COMPONENTES DE CAMPO INDIVIDUAIS MEMOIZADOS
// ============================================================================

/**
 * 🔑 IMPORTANTE: Estes componentes estão FORA do componente pai
 * Isso evita que sejam recriados a cada render
 */

// Campo de número da proposta
const NumPropostaField = memo(function NumPropostaField({ 
    form 
}: { 
    form: UseFormResult<Sumula> 
}) {
    return (
        <FormField<Sumula> name="numProposta" form={form} label="Número da Proposta">
            {({ value, onChange, onBlur, name, error }) => (
                <InputNumber
                    placeholder="Número da Proposta..."
                    startAddon={<HashIcon size={24} />}
                    useGrouping={false}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(error)}
                />
            )}
        </FormField>
    );
});

// Campo de código da linha
const CodigoLinhaField = memo(function CodigoLinhaField({ 
    form 
}: { 
    form: UseFormResult<Sumula> 
}) {
    return (
        <FormField<Sumula> name="codigoLinha" form={form} label="Número da Linha">
            {({ value, onChange, onBlur, name, error }) => (
                <InputNumber
                    placeholder="Número da Linha..."
                    startAddon={<HashStraightIcon size={24} />}
                    useGrouping={false}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(error)}
                />
            )}
        </FormField>
    );
});

// Campo de taxa ao mês
const TaxaAoMesField = memo(function TaxaAoMesField({ 
    form 
}: { 
    form: UseFormResult<Sumula> 
}) {
    return (
        <FormField<Sumula> name="porcTaxaAoMes" form={form} label="Taxa ao Mês da Operação">
            {({ value, onChange, onBlur, name, error }) => (
                <InputNumber
                    fullWidth
                    startAddon={<PercentIcon size={24} />}
                    suffix="%"
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(error)}
                />
            )}
        </FormField>
    );
});

// ============================================================================
// COMPONENTE DE GARANTIA PESSOAL - FORA DO COMPONENTE PAI
// ============================================================================

interface GarantiaPessoalItemProps {
    form: UseFormResult<Sumula>;
    index: number;
    onRemove: () => void;
}

const GarantiaPessoalItem = memo(function GarantiaPessoalItem({
    form,
    index,
    onRemove,
}: GarantiaPessoalItemProps) {
    return (
        <Card className="col-span-4">
            <FormLayout responsive={false} columns={4} gap={4} className="!pr-0">
                <FormCol span={1}>
                    <FormField
                        name={`garantiasPessoais.${index}.pessoaId`}
                        form={form}
                        label="CPF/CNPJ"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputMask
                                fullWidth
                                mask="999.999.999-99"
                                placeholder="CPF/CNPJ..."
                                startAddon={<UserCircleIcon size={24} />}
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={3}>
                    <FormField
                        name={`garantiasPessoais.${index}.nome`}
                        form={form}
                        label="Nome"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Nome da garantia pessoal..."
                                startAddon={<UserCircleIcon size={24} />}
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField
                        name={`garantiasPessoais.${index}.qtdOpDireta`}
                        form={form}
                        label="Quantidade Op. Direta"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Quantidade Op. Direta..."
                                startAddon={<CoinsIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField
                        name={`garantiasPessoais.${index}.valorOpDireta`}
                        form={form}
                        label="Valor Op. Direta"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Valor Op. Direta..."
                                startAddon={<CoinsIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField
                        name={`garantiasPessoais.${index}.qtdOpIndireta`}
                        form={form}
                        label="Quantidade Op. Indireta"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Quantidade Op. Indireta..."
                                startAddon={<CoinsIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField
                        name={`garantiasPessoais.${index}.valorOpIndireta`}
                        form={form}
                        label="Valor Op. Indireta"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Valor Op. Indireta..."
                                startAddon={<CoinVerticalIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>
            </FormLayout>
        </Card>
    );
});

// ============================================================================
// COMPONENTE DE GARANTIA REAL - FORA DO COMPONENTE PAI
// ============================================================================

interface GarantiaRealItemProps {
    form: UseFormResult<Sumula>;
    index: number;
    onRemove: () => void;
}

const GarantiaRealItem = memo(function GarantiaRealItem({
    form,
    index,
    onRemove,
}: GarantiaRealItemProps) {
    return (
        <Card className="col-span-4">
            <FormLayout responsive={false} columns={4} gap={4} className="!pr-0">
                <FormCol span={1}>
                    <FormField
                        name={`garantiasReais.${index}.grupoGarantia`}
                        form={form}
                        label="Grupo de Garantia"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Grupo de Garantia..."
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField
                        name={`garantiasReais.${index}.valorGarantia`}
                        form={form}
                        label="Valor da Garantia"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Valor da Garantia..."
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField
                        name={`garantiasReais.${index}.ultimaAtualizacao`}
                        form={form}
                        label="Última Atualização"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Última Atualização..."
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField
                        name={`garantiasReais.${index}.anoModelo`}
                        form={form}
                        label="Ano Modelo"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Ano Modelo..."
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>
            </FormLayout>
        </Card>
    );
});

// ============================================================================
// COMPONENTE PARA VERIFICAR EXISTÊNCIA DE GARANTIAS
// ============================================================================

/**
 * Componente que se inscreve APENAS no array de garantias
 * para verificar se deve mostrar a seção
 */
const GarantiasPessoaisSection = memo(function GarantiasPessoaisSection({
    form,
}: {
    form: UseFormResult<Sumula>;
}) {
    // Se inscreve apenas no array de garantias pessoais
    const { value: garantias } = useFormField(form, 'garantiasPessoais');
    const hasGarantias = Array.isArray(garantias) && garantias.length > 0;

    if (!hasGarantias) return null;

    return (
        <>
            <FormCol span={4}>
                <Heading2>Dados da Garantia Pessoal</Heading2>
            </FormCol>

            <FormArray<Sumula, GarantiaPessoal> form={form} name="garantiasPessoais">
                {(item, index, remove) => (
                    <GarantiaPessoalItem
                        key={index}
                        form={form}
                        index={index}
                        onRemove={remove}
                    />
                )}
            </FormArray>
        </>
    );
});

const GarantiasReaisSection = memo(function GarantiasReaisSection({
    form,
}: {
    form: UseFormResult<Sumula>;
}) {
    const { value: garantias } = useFormField(form, 'garantiasReais');
    const hasGarantias = Array.isArray(garantias) && garantias.length > 0;

    if (!hasGarantias) return null;

    return (
        <>
            <FormCol span={4}>
                <Heading2>Dados da Garantia Real</Heading2>
            </FormCol>

            <FormArray<Sumula, GarantiaReal> form={form} name="garantiasReais">
                {(item, index, remove) => (
                    <GarantiaRealItem
                        key={index}
                        form={form}
                        index={index}
                        onRemove={remove}
                    />
                )}
            </FormArray>
        </>
    );
});

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const SimuladorPropostaSecondStepper: React.FC<SimuladorPropostaSecondStepperProps> = ({
    submitPolitica,
    returnToFirstStep,
    form,
}) => {
    // 🔑 NÃO acessamos form.values aqui - isso causaria re-render de tudo!
    // Em vez disso, usamos componentes que se inscrevem individualmente

    return (
        <VStack className="w-full">
            <FormLayout responsive={false} columns={4} gap={4}>
                {/* Seção: Identificação da Proposta */}
                <FormCol span={4}>
                    <Heading2>Identificação da Proposta</Heading2>
                    <Caption>
                        Informações cadastrais e parâmetros iniciais da proposta de crédito
                    </Caption>
                </FormCol>

                <FormCol span={1}>
                    <NumPropostaField form={form} />
                </FormCol>

                <FormCol span={1}>
                    <CodigoLinhaField form={form} />
                </FormCol>

                <FormCol span={2}>
                    <FormField<Sumula> name="linha" form={form} label="Linha de Crédito">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                placeholder="Linha de crédito..."
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                {/* Seção: Taxas */}
                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={1}>
                    <TaxaAoMesField form={form} />
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="porcTaxaAoAno" form={form} label="Taxa ao Ano da Operação">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<PercentIcon size={24} />}
                                suffix="%"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="porcCetAoMes" form={form} label="CET ao Mês">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<ChartLineUpIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="porcCetAoAno" form={form} label="CET ao Ano">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<ChartLineUpIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                {/* Seção: Parcelas */}
                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="valorParcela" form={form} label="Valor da Parcela">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<HandCoinsIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="qtdParcelas" form={form} label="Prazo">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Prazo..."
                                startAddon={<CalendarDotsIcon size={24} />}
                                suffix=" Meses"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="periodicidade" form={form} label="Periodicidade">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Periodicidade..."
                                startAddon={<ArrowClockwiseIcon size={24} />}
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="porcJurosMora" form={form} label="Taxa do Juros Mora">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<WarningCircleIcon size={24} />}
                                suffix="%"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                {/* Seção: Despesas e Perdas */}
                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="porcPerdaEsperado" form={form} label="% Perda Esperada">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="0%"
                                startAddon={<WarningIcon size={24} />}
                                suffix="%"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="valorPerdaEsperada" form={form} label="Valor da Perda Esperada">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<MoneyWavyIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="valorDespesaSeguro" form={form} label="Valor Despesa Seguro">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<ShieldIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="valorDespesaAdicional" form={form} label="Valor Despesa Adicional">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<PlusCircleIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                {/* Seção: Capacidade de Pagamento */}
                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={4}>
                    <Heading2>Capacidade de Pagamento</Heading2>
                    <Caption>
                        Avaliação da capacidade financeira do cooperado para honrar a operação
                    </Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="capacidadePagamento" form={form} label="Capacidade de Pagamento">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="carencia" form={form} label="Renda">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Renda do cooperado..."
                                startAddon={<PiggyBankIcon size={24} />}
                                mode="currency"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula> name="ativoProblematico" form={form} label="Ativo Problemático">
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Não/Sim..."
                                startAddon={<WarningOctagonIcon size={24} />}
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                {/* Seção: Garantias Pessoais */}
                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <GarantiasPessoaisSection form={form} />

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                {/* Seção: Garantias Reais */}
                <GarantiasReaisSection form={form} />
            </FormLayout>

            <FormActions className="w-full" align="between">
                <ButtonGradient
                    icon="pi pi-angle-double-left"
                    iconPos="left"
                    intent="tertiary"
                    label="Adicionar Súmula"
                    onClick={returnToFirstStep}
                />

                <ButtonGradient
                    icon="pi pi-calculator"
                    iconPos="right"
                    label="Simular"
                    type="submit"
                    onClick={submitPolitica}
                />
            </FormActions>
        </VStack>
    );
};
