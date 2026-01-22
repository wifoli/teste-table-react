import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { tokenManager } from "../utils/token";
import { handleApiError, isUnauthorizedError } from "../utils/errors";
import { UNAUTHORIZED_EVENT_NAME } from "../types";

export function setupInterceptors(axiosInstance: AxiosInstance) {
    axiosInstance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            if (config.url) {
                const [path, query] = config.url.split("?");
                if (!path.endsWith("/")) {
                    config.url = path + "/" + (query ? `?${query}` : "");
                }
            }

            const token = tokenManager.getToken();
            if (token && !config.headers.skipAuth) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            delete config.headers.skipAuth;

            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        async (error: AxiosError) => {
            const apiError = handleApiError(error);

            if (isUnauthorizedError(apiError)) {
                tokenManager.clearTokens();

                // window.location.href = '/login';
                // Ou emitar um evento para que os aplicativos possam lidar com isso
                window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT_NAME));
            }

            return Promise.reject(apiError);
        },
    );
}
