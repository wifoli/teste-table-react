import axios, { AxiosInstance } from "axios";
import { setupInterceptors } from "./interceptors";

export interface ApiClientConfig {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
}

class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor(config: ApiClientConfig) {
        this.axiosInstance = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            headers: {
                "Content-Type": "application/json",
                ...config.headers,
            },
        });

        setupInterceptors(this.axiosInstance);
    }

    getInstance(): AxiosInstance {
        return this.axiosInstance;
    }

    updateBaseURL(baseURL: string): void {
        this.axiosInstance.defaults.baseURL = baseURL;
    }

    updateTimeout(timeout: number): void {
        this.axiosInstance.defaults.timeout = timeout;
    }
}

const defaultConfig: ApiClientConfig = {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
};

export const apiClient = new ApiClient(defaultConfig);
export const api = apiClient.getInstance();

// Função para criar uma instância personalizada do cliente API
export function createApiClient(config: ApiClientConfig): ApiClient {
    return new ApiClient(config);
}
