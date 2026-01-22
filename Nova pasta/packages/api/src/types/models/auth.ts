import { Operador } from "./operador";

export interface AuthTokens {
    accessToken: string;
}

export interface AuthResponse {
    operador: Operador;
    tokens: AuthTokens;
}

export interface LoginForm {
    username: string;
    password: string;
}
