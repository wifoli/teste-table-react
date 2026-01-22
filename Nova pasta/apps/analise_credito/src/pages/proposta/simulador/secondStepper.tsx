import { ButtonGradient, Calendar, Caption, Card, Divider, FormActions, FormCol, FormLayout, Heading2, InputMask, InputNumber, InputText, VStack } from "@front-engine/ui";
import { ArrowClockwiseIcon, CalendarBlankIcon, CalendarCheckIcon, CalendarDotsIcon, CalendarXIcon, ChartLineUpIcon, CoinsIcon, CoinVerticalIcon, CreditCardIcon, FoldersIcon, GavelIcon, HandCoinsIcon, HashIcon, HashStraightIcon, HourglassMediumIcon, IdentificationCardIcon, MoneyWavyIcon, PercentIcon, PiggyBankIcon, PlusCircleIcon, ReceiptIcon, ShieldCheckIcon, ShieldIcon, StepsIcon, TipJarIcon, TrendDownIcon, UserCircleIcon, WarningCircleIcon, WarningDiamondIcon, WarningIcon, WarningOctagonIcon } from "@phosphor-icons/react";
import { SimuladorPropostaSecondStepperProps } from "./types";
import { FormField } from "@front-engine/utils-react";
import { GarantiaPessoal, GarantiaReal, Sumula } from "@front-engine/api";
import { memo } from "react";

export const SimuladorPropostaSecondStepper: React.FC<SimuladorPropostaSecondStepperProps> = ({
    submitPolitica, returnToFirstStep, form
}) => {
    const hasGarantiaPessoal = form.values.garantiasPessoais && form.values.garantiasPessoais.length > 0;
    const hasGarantiaReal = form.values.garantiasReais && form.values.garantiasReais.length > 0;

    const GarantiaPessoalComponent: React.FC = memo(() => (
        <>
            {form.getArrayField<GarantiaPessoal>('garantiasPessoais').map((_, index) => (
                <Card key={index} className="col-span-4">
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
                                        mask={"999.999.999-99"}
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
            ))}
        </>
    ));

    const GarantiaRealComponent: React.FC = memo(() => (
        <>
            {form.getArrayField<GarantiaReal>('garantiasReais').map((_, index) => (
                <Card key={index} className="col-span-4">
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
            ))}
        </>
    ));

    return (
        <VStack>
            <FormLayout responsive={false} columns={4} gap={4} className="!pr-0">

                <FormCol span={4}>
                    <Heading2>Identificação do Cooperado</Heading2>
                    <Caption>Identificação, perfil financeiro e nível de risco do cooperado</Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="cpfCnpj"
                        form={form}
                        label="CPF/CNPJ"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputMask
                                fullWidth
                                placeholder="Digite um CPF/CNPJ..."
                                mask={"999.999.999-99"}
                                startAddon={<IdentificationCardIcon size={24} />}
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={2}>
                    <InputText
                        placeholder="Selecione um cooperado..."
                        startAddon={<UserCircleIcon size={24} />}
                        label="Nome do Cooperado"
                    />
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="tomadorRisco"
                        form={form}
                        label="Risco"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Risco do cooperado..."
                                startAddon={<WarningDiamondIcon size={24} />}
                                prefix="R"
                                useGrouping={false}
                                max={20}
                                min={1}
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
                    <FormField<Sumula>
                        name="carencia"
                        form={form}
                        label="Renda"
                    >
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
                    <FormField<Sumula>
                        name="carencia"
                        form={form}
                        label="Total bens"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Bens do cooperado..."
                                startAddon={<TipJarIcon size={24} />}
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

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={4}>
                    <Heading2>Identificação da Proposta</Heading2>
                    <Caption>Informações cadastrais e parâmetros iniciais da proposta de crédito</Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="numProposta"
                        form={form}
                        label="Número da Proposta"
                    >
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
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="codigoLinha"
                        form={form}
                        label="Número da Linha"
                    >
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
                </FormCol>

                <FormCol span={2}>
                    <FormField<Sumula>
                        name="linha"
                        form={form}
                        label="Linha de Crédito"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                placeholder="Linha linha de crédito..."
                                startAddon={<CreditCardIcon size={24} />}
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
                    <FormField<Sumula>
                        name="dataProposta"
                        form={form}
                        label="Data da Proposta"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <Calendar
                                fullWidth
                                placeholder="Data da proposta..."
                                startAddon={<CalendarBlankIcon size={24} />}
                                showIcon
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={4}>
                    <Heading2>Condições da Operação</Heading2>
                    <Caption>Prazos, periodicidade e datas relevantes da operação de crédito</Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="carencia"
                        form={form}
                        label="Carência"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="Carência..."
                                startAddon={<HourglassMediumIcon size={24} />}
                                suffix=" Dias"
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
                    <FormField<Sumula>
                        name="periodicidade"
                        form={form}
                        label="Periodicidade"
                    >
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
                    <FormField<Sumula>
                        name="qtdParcelas"
                        form={form}
                        label="Prazo"
                    >
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
                    <FormField<Sumula>
                        name="dataVencimentoPrimeiraParcela"
                        form={form}
                        label="Data de Vencimento Primeira Parcela"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <Calendar
                                fullWidth
                                placeholder="Venc. Primeira Parcela..."
                                startAddon={<CalendarCheckIcon size={24} />}
                                showIcon
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
                    <FormField<Sumula>
                        name="dataVencimentoProposta"
                        form={form}
                        label="Data de Vencimento Operação"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <Calendar
                                fullWidth
                                placeholder="Venc. Operação..."
                                startAddon={<CalendarXIcon size={24} />}
                                showIcon
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={4}>
                    <Heading2>Valores e Taxas da Operação</Heading2>
                    <Caption>Valores financeiros, taxas aplicáveis e encargos contratuais</Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="valorProposta"
                        form={form}
                        label="Valor da Proposta"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
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
                    <FormField<Sumula>
                        name="valorContratado"
                        form={form}
                        label="Valor Contratado"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
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

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="porcTaxaAoMes"
                        form={form}
                        label="Taxa ao Mês da Operação"
                    >
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
                    <FormField<Sumula>
                        name="porcTaxaAoAno"
                        form={form}
                        label="Taxa ao Ano da Operação"
                    >
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
                    <FormField<Sumula>
                        name="porcCetAoMes"
                        form={form}
                        label="CET ao Mês"
                    >
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
                    <FormField<Sumula>
                        name="porcCetAoAno"
                        form={form}
                        label="CET ao Ano"
                    >
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
                    <FormField<Sumula>
                        name="valorParcela"
                        form={form}
                        label="Valor da Parcela"
                    >
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
                    <FormField<Sumula>
                        name="porcJurosMora"
                        form={form}
                        label="Taxa do Juros Mora"
                    >
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

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="porcMultaContratualInadimplido"
                        form={form}
                        label="Multa INAD"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<GavelIcon size={24} />}
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



                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={4}>
                    <Heading2>Despesas da Operação</Heading2>
                    <Caption>Custos, tributos e despesas adicionais incidentes sobre a operação</Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="valorDespesaTarifa"
                        form={form}
                        label="Valor Despesa Tarifa"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<ReceiptIcon size={24} />}
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
                    <FormField<Sumula>
                        name="valorDespesaIof"
                        form={form}
                        label="Valor Despesa IOF"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                startAddon={<PercentIcon size={24} />}
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
                    <FormField<Sumula>
                        name="valorDespesaSeguro"
                        form={form}
                        label="Valor Despesa Seguro"
                    >
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
                    <FormField<Sumula>
                        name="valorDespesaAdicional"
                        form={form}
                        label="Valor Despesa Adicional"
                    >
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

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={4}>
                    <Heading2>Capacidade de Pagamento</Heading2>
                    <Caption>Avaliação da capacidade financeira do cooperado para honrar a operação</Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="capacidadePagamento"
                        form={form}
                        label="Capacidade de Pagamento"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Possui capacidade..."
                                startAddon={<ShieldCheckIcon size={24} />}
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={Boolean(error)}
                            />
                        )}
                    </FormField>
                </FormCol>

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                <FormCol span={4}>
                    <Heading2>Risco e Perfil da Operação</Heading2>
                    <Caption>Indicadores de risco, perda esperada e classificação da carteira</Caption>
                </FormCol>

                <FormCol span={1}>
                    <FormField<Sumula>
                        name="estagioPerdaEsperada"
                        form={form}
                        label="Estágio Perda Esperada"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="Estágio 1/2/3/4/5..."
                                startAddon={<StepsIcon size={24} />}
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
                    <FormField<Sumula>
                        name="pdOperacao"
                        form={form}
                        label="PD Operação"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputNumber
                                fullWidth
                                placeholder="0%"
                                startAddon={<TrendDownIcon size={24} />}
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
                    <FormField<Sumula>
                        name="porcPerdaEsperado"
                        form={form}
                        label="% Perda Esperada"
                    >
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
                    <FormField<Sumula>
                        name="valorPerdaEsperada"
                        form={form}
                        label="Valor da Perda Esperada"
                    >
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
                    <FormField<Sumula>
                        name="perfilCarteira"
                        form={form}
                        label="Perfil da Carteira do Cooperado"
                    >
                        {({ value, onChange, onBlur, name, error }) => (
                            <InputText
                                fullWidth
                                placeholder="C1/C2/C3..."
                                startAddon={<FoldersIcon size={24} />}
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
                    <FormField<Sumula>
                        name="ativoProblematico"
                        form={form}
                        label="Ativo Problemático"
                    >
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

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>


                {hasGarantiaPessoal && (
                    <>
                        <FormCol span={4}>
                            <Heading2>Dados da Garantia Pessoal</Heading2>
                        </FormCol>

                        <GarantiaPessoalComponent />
                    </>
                )}

                <FormCol span={4}>
                    <Divider className="my-4" />
                </FormCol>

                {hasGarantiaReal && (
                    <>
                        <FormCol span={4}>
                            <Heading2>Dados da Garantia Real</Heading2>
                        </FormCol>
                        
                        <GarantiaRealComponent />
                    </>
                )}

            </FormLayout>

            <FormActions className="w-full" align="between" >
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
}
