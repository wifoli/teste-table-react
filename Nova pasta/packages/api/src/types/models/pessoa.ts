import { PaginationParams } from "../api";
import { PA } from "./operador";

export type TipoAnotacao = "BAIXADAS" | "VIGENTES";

export interface LGD {
    id: number;
    codSubmodalidadeBacen: number;
    submodalidadeBacen: string;
    garantia: string;
    lgd: number;
}

export interface DER {
    id: string;
    tipoTomador: string;
    submodalidade: string;
    risco: number;
    pd12: number;
    pdvida: number;
    pdEstagio3: number;
}

export interface SubModalidadeBacen {
    id: number;
    codigoLinhaCredito: number;
    linhaCredito: string;
    codigoSubmodalidade: number;
    submodalidade: string;
}


// Pessoa
export interface PessoaParams extends PaginationParams {
    isSmartSearch?: boolean;
    search?: string;
}

export interface Pessoa {
    cpfCnpj: string;
    pa?: PA;
    nomeRazaoSocial: string;
    dataNascimentoConstituicao?: string;
    nomeFantasia?: string;
    profissao?: string;
    codigoCnae?: string;
    cnae?: string;
    codigoGrupoEconomico?: string;
    descricaoGrupoEconomico?: string;
    porte?: string;
    nacionalidade?: string;
    naturalidade?: string;
    atividadeEconomica?: string;
    dataAtualizacaoCadastral?: string;
    estadoCivil?: string;
    regimeBens?: string;
    enderecoEletronico?: string;
    nomeGerente?: string;
    nomePai?: string;
    nomeMae?: string;
    descDocumentoIdentidade?: string;
    descOrgaoExpDocumentoIdentidade?: string;
    numeroDocumentoIdentidade?: string;
    dataEmissaoDocumentoIdentidade?: string;
    conjuge?: Pessoa;
    enderecos?: Endereco[];
    rendas?: Renda[];
    bens?: Bem[];
    cheques?: Cheque[];
    bacens?: Bacen[];
    rendasBacen?: RendaBacen[];
    iap?: IAP;
    crls?: CRL[];
    socios?: Socio[];
    sociosProcob?: SocioProcob[];
    anotacoes?: Anotacao[];
    contaCapital?: ContaCapital;
    aplicacoes?: Aplicacao[];
    limitesDescontos?: LimiteDesconto[];
    margemContribuicao?: MargemContribuicao;
    saldoMedio?: SaldoMedio[];
    serasa?: Serasa;
    quadrantes?: Quadrante[];
}

export interface Endereco {
    id: number;
    tipoLogradouro: string;
    logradouro: string;
    numeroLogradouro: string;
    bairro: string;
    complemento?: string;
    municipio: string;
    uf: string;
}

export interface Bem {
    id: number;
    descricao: string;
    tipoBem: string;
    areaBemImovel?: number;
    unidadeMedidaImovel?: string;
    quantidade: number;
    porcentagem: number;
    valorParticipacao: number;
    valorBem?: number;
    dataAtualizacao: string;
    status?: string;
}

export interface Renda {
    id: number;
    tipoRenda: string;
    rendaBrutaMensal: number;
    dataAtualizacao: string;
}

export interface Bacen {
    id: number;
    valorSaldoDevedor: number;
    endividamentoCurtoPrazo: number;
    endividamentoLongoPrazo: number;
    prejuizo: number;
    valorVencido: number;
    modalidade: string;
}

export interface RendaBacen {
    id: number;
    saldoDevedorBacen: number;
    dataMovimento: number;
}

export interface Cheque {
    id: number;
    motivoDevolucao: string;
    valor: number;
}

export interface IAP {
    id: number;
    iap: string;
}

export interface Socio {
    id: number;
    nome: string;
    tipoRelacionamento: string;
    capitalEmpresa: number;
    relacionadoId: number;
    relacionado?: Pessoa;
}

export interface SocioProcob {
    id: number;
    nome: string;
    tipoRelacionamento: string;
    capitalEmpresa: number;
    relacionadoId: number;
    relacionado?: Pessoa;
}

export interface CRL {
    id: number;
    descricaoPortifolio: string;
    tipoTomador: string;
    nivelRisco: string;
    valor: number;
    utilizado?: number;
    situacao?: string;
}

export interface Anotacao {
    id: number;
    codigoAnotacao: string;
    dataAnotacao: string;
    dataBaixa?: string;
    categoriaAnotacao?: string;
    tipoAnotacao: TipoAnotacao;
    valor: number;
}

export interface ContaCapital {
    id: number;
    situacao: string;
    dataMatricula?: string;
    numero: string;
    valorIntegralizado: number;
}

export interface Aplicacao {
    id: number;
    valor: number;
}

export interface LimiteDesconto {
    id: number;
    limite: number;
    utilizado: number;
    valorMedio: number;
    liquidezVencimento: number;
    liquidez_5Dias: number;
    liquidezVencimento_6_29Dias: number;
    liquidezVencimentoTotal: number;
    concentracao: number;
    valorMedioCheque: number;
    liquidezVencimentoCheque: number;
    prazoMedioCArteira: number;
    concentracaoCheque: number;
}

export interface MargemContribuicao {
    id: number;
    margemContribuicao: number;
}

export interface SaldoMedio {
    id: number;
    valor: number;
}

export interface Serasa {
    id: number;
    score: number;
    acaoJudicial: number;
    dividaVencida: number;
    falencia: number;
    pefin: number;
    protesto: number;
    refin: number;
    recheque: number;
}

export interface Quadrante {
    id: number;
    valorBacen: number;
    valorSicoob: number;
    iap: number;
    dataMovimentacao?: number;
}
