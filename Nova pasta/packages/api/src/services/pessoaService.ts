import { api, createResource } from "../client";
import { Pessoa, PessoaParams } from "../types";

export const pessoaService = createResource<Pessoa, PessoaParams>(
    api,
    '/pessoas',
);