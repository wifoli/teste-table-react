import { Pessoa } from "./pessoa";
import { Operador } from "./operador";

export type TipoProposta = "Operacao" | "CRL" | "Topdesk" | "Demandas Extras";
export type CanalProposta = "SISBRWEB" | "SICOOBNET" | "OUTROS" | "TOPDESK" | "SARA";

export interface StatusCicloProposta {
    id: number;
    descricao: string;
}

export interface Produto {
    id: number;
    descricao: string;
    observacao?: string;
}

// Proposta ---------------------------------------------------
export interface PropostaForm {
    tipoProposta: TipoProposta;
    canal: CanalProposta;
    numero: string;
    pessoaId: string;
    linha: string;
    valor: number;
    descricao?: string;
}

export interface Proposta {
    id: number;
    numero?: string;
    linha?: string;
    canal?: CanalProposta & string;
    pa?: string;
    valor?: number;
    observacao?: string;
    prioridade: boolean;
    dataCriacao: string;
    tipoProposta: TipoProposta;
    fonteProposta: string;
    operador: Operador;
    promessas?: Promessa[];
    analises?: Analise[];
    dataCriacaoUltimaFase?: string;
    descricaoUltimaFase?: string;
    operadorUltimaFase?: string;
    nomeTomador: string;
    cpfCnpjTomador: string;
}
// Fim Proposta -----------------------------------------------

export interface Promessa {
    id: number;
    produto: Produto;
    dataCriacao: string;
    dataAtribuicao: string;
    dataPrazo?: string;
    observacao: string;
    valor?: number;
    status: boolean;
}

export interface Analise {
    id: number;
    dataCriacao: string;
    tomador: boolean;
    tipoRelacionamento?: string;
    pessoaId: string;
    pessoa: Pessoa;
}

export interface Ciclo {
    id: number;
    status?: StatusCicloProposta;
    dataCriacao: string;
    dataFinalizacao?: string;
}
