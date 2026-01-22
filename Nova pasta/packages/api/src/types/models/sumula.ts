export type SumulaPeriodicidade = 'ANUAL' | 'SEMESTRAL' | 'MENSAL';

export type SumulaEstagioPerdaEsperada = 'ESTAGIO_1' | string; // TROCAR STRING PARA TIPOS DEFINIDOS

export interface ExportSumulaPDF {
    sumulaEstudoFile: File;
    sumulaRepacFile?: File;
}

export interface Sumula {
	cpfCnpj?: string,
	numProposta?: string,
	codigoLinha?: string,
	dataProposta?: string,
	linha?: string,
	carencia?: number,
	carenciaMeses?: number,
	valorProposta?: number,
	valorContratado?: number,
	porcTaxaAoMes?: number,
	periodicidade?: SumulaPeriodicidade,
	dataVencimentoPrimeiraParcela?: string,
	valorDespesaTarifa?: number,
	qtdParcelas?: number,
	dataVencimentoProposta?: string,
	valorParcela?: number,
	hasTarifa?: boolean,
	seguroProposta?: string,
	capacidadePagamento?: string,
	tomadorRisco?: string,
	porcPerdaEsperada?: number,
	valorPerdaEsperada?: number,
	perfilCarteira?: string,
	ativoProblematico?: string,
	estagioPerdaEsperada?: SumulaEstagioPerdaEsperada,
	pdOperacao?: number,
	dataBacen?: string,
	contaCorrenteId?: null,
	valorTotalDespesas?: number,
	valorDespesaIof?: number,
	valorDespesaSeguro?: number,
	valorDespesaAdicional?: number,
	porcCetAoMes?: number,
	porcCetAoAno?: number,
	porcMultaContratualInadimplido?: number,
	porcJurosMonetarioAoMes?: number,
	porcTaxaAoAno?: number,
	porcJurosMora?: number,
	sumulaRepac?: SumulaRepac,
	garantiasPessoais?: GarantiaPessoal[],
	garantiasReais?: GarantiaReal[],
}

export interface GarantiaPessoal {
	pessoaId?: string,
	nome?: string,
	qtdOpDireta?: number,
	valorOpDireta?: number,
	qtdOpIndireta?: number,
	valorOpIndireta?: number
}

export interface GarantiaReal {
	grupoGarantia?: string,
	valorGarantia?: number,
	ultimaAtualizacao?: string,
	anoModelo?: string,
	pessoas?: GarantiaRealPessoa[]	
}

export interface GarantiaRealPessoa {
	pessoaId?: string,
	nome?: string,
	responsabilidade?: string
} 

export interface SumulaRepac {}