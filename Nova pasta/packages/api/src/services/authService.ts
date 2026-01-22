import { api } from "../client/axios";
import { tokenManager } from "../utils/token";
import { loadingStateManager } from "../utils/loading";
import { ApiRequestConfig, AuthResponse, LoginForm, Operador } from "../types";

class AuthService {
    constructor(private readonly endpoint = "") {}

    async login(credentials: LoginForm, config?: ApiRequestConfig): Promise<AuthResponse> {
        loadingStateManager.startLoading(AUTH_LOADING_KEYS.LOGIN);

        try {
            const response = await api.post<AuthResponse>(`${this.endpoint}/login`, credentials, {
                skipAuth: true,
                ...config,
            });

            const { tokens } = response.data;
            tokenManager.setToken(tokens.accessToken);
            // tokenManager.setRefreshToken(tokens.refreshToken);

            loadingStateManager.stopLoading(AUTH_LOADING_KEYS.LOGIN);
            return response.data;
        } catch (error) {
            loadingStateManager.stopLoading(AUTH_LOADING_KEYS.LOGIN, error as any);
            throw error;
        }
    }

    async logout(config?: ApiRequestConfig): Promise<void> {
        loadingStateManager.startLoading(AUTH_LOADING_KEYS.LOGOUT);

        try {
            await api.post<void>(`${this.endpoint}/logout`, undefined, config);
            tokenManager.clearTokens();
            loadingStateManager.stopLoading(AUTH_LOADING_KEYS.LOGOUT);
        } catch (error) {
            loadingStateManager.stopLoading(AUTH_LOADING_KEYS.LOGOUT, error as any);
            throw error;
        }
    }

    /**
    async refreshToken(): Promise<AuthResponse> {
        const refreshToken = tokenManager.getRefreshToken();

        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        try {
            const response = await api.post<AuthResponse>(`${this.endpoint}/refresh`, {
                refreshToken,
            });

            const { tokens } = response.data;
            tokenManager.setToken(tokens.accessToken);
            tokenManager.setRefreshToken(tokens.refreshToken);

            return response.data;
        } catch (error) {
            tokenManager.clearTokens();
            throw error;
        }
    }
    */

    async getCurrentOperador(config?: ApiRequestConfig): Promise<Operador> {
        loadingStateManager.startLoading(AUTH_LOADING_KEYS.CURRENT);

        try {
            const response = await api.get<Operador>(`${this.endpoint}/me`, config);
            loadingStateManager.stopLoading(AUTH_LOADING_KEYS.CURRENT);
            return response.data;
        } catch (error) {
            loadingStateManager.stopLoading(AUTH_LOADING_KEYS.CURRENT, error as any);
            throw error;
        }
    }

    isAuthenticated(): boolean {
        return tokenManager.hasToken();
    }
}

export const AUTH_LOADING_KEYS = {
    LOGIN: "auth:login",
    CURRENT: "auth:currentOperador",
    LOGOUT: "auth:logout",
};

export const authService = new AuthService();
