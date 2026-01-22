export type Role = "Administrador" | "Gestor" | "Analista" | "PA";
export type Permission = string;

export interface User {
    id: string;
    firstName: string;
    lastName?: string;
    username: string;
    email?: string;
    roles: Role[];
    permissions: Permission[];
}

export interface Regional {
    id: number;
    descricao: string;
}

export interface PA {
    id: string;
    numeroPA: string;
    nomePA: string;
    // cidade: string;
    // uf: string;
    regional: Regional;
}

export interface Operador {
    pa: PA;
    user: User;
}
