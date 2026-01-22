import { api, createResource } from "../client";
import { Proposta } from "../types";

export const propostaService = createResource<Proposta>(
    api,
    '/propostas',
);
