// Client
export { createApiClient } from "./client/axios";
export { createResource } from "./client/resource";
export type {
    ApiClientConfig,
    Resource,
    RestMethods,
    CustomMethods,
    ResourceConfig,
} from "./client";

// Services
export * from "./services";

// Utils
export { tokenManager, loadingStateManager, requestCancellation } from "./utils";

export * from "./utils/errors";

// Types
export type {
    ApiResponse,
    ApiError,
    PaginationParams,
    PaginatedResponse,
    LoadingState,
    ApiRequestConfig,
    CustomAxiosError,
} from "./types/api";

export { UNAUTHORIZED_EVENT_NAME } from "./types/api";

export * from "./types/models";

export { type AxiosInstance } from "axios";
