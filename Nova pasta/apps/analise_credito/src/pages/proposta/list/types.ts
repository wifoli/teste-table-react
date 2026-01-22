import { Proposta } from "@front-engine/api";
import { FilterMap, UseTableQueryResult } from "@front-engine/ui";

export interface ListPropostaFilters extends FilterMap {
  cpfCnpjTomador: string;
  nomeTomador: string;
  numero: number | null;
  linha: string[];
  descricaoUltimaFase: string[];
  canal: string[];
  valorMin: number | null;
  valorMax: number | null;
  dataCriacaoUltimaFaseBefore: string | null;
  dataCriacaoUltimaFaseAfter: string | null;
}

export type ListFiltersProps = Pick<UseTableQueryResult<Proposta, ListPropostaFilters>, 'filters'>;

export type ListPropostaTableProps = Pick<
  UseTableQueryResult<Proposta, ListPropostaFilters>,
  'data' | 'pagination' | 'totalRecords' | 'sorting' | 'isLoading'
>;

export type ListPropostaProps = UseTableQueryResult<Proposta, ListPropostaFilters>;