import { AxiosResponse, AxiosInstance } from "axios";
import { loadingStateManager } from "../utils/loading";
import { ApiError, PaginationParams, PaginatedResponse, ApiRequestConfig } from "../types";

export interface ResourceConfig {
    loadingKey?: string;
    trackLoading?: boolean;
}

export interface RestMethods<
    T,
    TParams extends PaginationParams = PaginationParams
> {
    list(params?: TParams, requestConfig?: ApiRequestConfig): Promise<T[]>;
    listPaginated(params?: TParams, requestConfig?: ApiRequestConfig): Promise<PaginatedResponse<T>>;
    get(id: string | number, requestConfig?: ApiRequestConfig): Promise<T>;
    create(data: Partial<T>, requestConfig?: ApiRequestConfig): Promise<T>;
    update(id: string | number, data: Partial<T>, requestConfig?: ApiRequestConfig): Promise<T>;
    delete(id: string | number, requestConfig?: ApiRequestConfig): Promise<void>;
}

export type CustomMethod<T, P extends any[] = []> = (
    ...args: [...params: P, requestConfig?: ApiRequestConfig]
) => Promise<T>;

export type CustomMethods<T> = Record<string, CustomMethod<T>>;

export type Resource<
    T, 
    TParams extends PaginationParams = PaginationParams, 
    C extends CustomMethods<T> = {}
> = RestMethods<T, TParams> & C;

export function createResource<
    T, 
    TParams extends PaginationParams = PaginationParams, 
    C extends CustomMethods<T> = {}
>(
    api: AxiosInstance,
    endpoint: string,
    customMethods?: C,
    config?: ResourceConfig,
): Resource<T, TParams, C> {
    const loadingKey = config?.loadingKey || endpoint;
    const trackLoading = config?.trackLoading !== false;

    const withLoading = async <R>(
        operation: string,
        fn: () => Promise<AxiosResponse<R>>,
    ): Promise<R> => {
        const key = `${loadingKey}:${operation}`;

        if (trackLoading) {
            loadingStateManager.startLoading(key);
        }

        try {
            const response = await fn();

            if (trackLoading) {
                loadingStateManager.stopLoading(key);
            }

            return response.data;
        } catch (error) {
            if (trackLoading) {
                loadingStateManager.stopLoading(key, error as ApiError);
            }
            throw error;
        }
    };

    // REST Methods
    const restMethods: RestMethods<T, TParams> = {
        list: (params, requestConfig) =>
            withLoading("list", () => api.get<T[]>(endpoint, { params, ...(requestConfig || {}) })),

        listPaginated: (params, requestConfig) =>
            withLoading("listPaginated", () =>
                api.get<PaginatedResponse<T>>(endpoint, { params, ...(requestConfig || {}) }),
            ),

        get: (id, requestConfig) =>
            withLoading("get", () => api.get<T>(`${endpoint}/${id}`, requestConfig)),

        create: (data, requestConfig) =>
            withLoading("create", () => api.post<T>(endpoint, data, requestConfig)),

        update: (id, data, requestConfig) =>
            withLoading("update", () => api.put<T>(`${endpoint}/${id}`, data, requestConfig)),

        delete: (id, requestConfig) =>
            withLoading("delete", () => api.delete(`${endpoint}/${id}`, requestConfig)),
    };

    // Junta os métodos REST com os métodos personalizados
    return {
        ...restMethods,
        ...(customMethods || {}),
    } as Resource<T, TParams, C>;
}
