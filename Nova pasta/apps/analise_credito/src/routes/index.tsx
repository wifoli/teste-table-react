import { AppRoute } from "@front-engine/utils-react/routes";
import { HistoryPropostaPage, PainelPropostaPage } from "../pages/proposta/list/page";
import { SearchCooperadoPage } from "../pages/cooperado/search/page";
import { CreatePropostaPage } from "../pages/proposta/create/page";
import { BulkCreatePropostaView } from "../pages/proposta/insert/view";
import { InsightPropostaPage } from "../pages/proposta/insights/page";
import { PesquisaTemporalidadePage } from "../pages/temporalidade/search/page";
import { UpdatePropostaView } from "../pages/proposta/update/view";
import { ShowPropostaView } from "../pages/proposta/show/view";
import { ShowCooperadoView } from "../pages/cooperado/show/view";
import { BulkCreateCooperadoView } from "../pages/cooperado/insert/view";

import { SimuladorPropostaPage } from "../pages/proposta/simulador/page";

export const analiseCreditoRoutes: AppRoute[] = [
    {
        path: "/",
        element: <PainelPropostaPage />,
    },
    {
        path: "/cooperado/search",
        element: <SearchCooperadoPage />,
    },
    {
        path: "/cooperado/insert",
        element: <BulkCreateCooperadoView />,
    },
    {
        path: "/cooperado/show",
        element: <ShowCooperadoView />,
    },
    {
        path: "/proposta/simulator",
        element: <SimuladorPropostaPage />,
    },
    {
        path: "/proposta/create",
        element: <CreatePropostaPage />,
    },
    {
        path: "/proposta/update",
        element: <UpdatePropostaView />,
    },
    {
        path: "/proposta/insert",
        element: <BulkCreatePropostaView />,
    },
    {
        path: "/proposta/history",
        element: <HistoryPropostaPage />,
    },
    {
        path: "/proposta/show",
        element: <ShowPropostaView />,
    },
    {
        path: "/painel-analista",
        element: <InsightPropostaPage />,
    },
    {
        path: "/temporalidade/search",
        element: <PesquisaTemporalidadePage />,
    },
];
