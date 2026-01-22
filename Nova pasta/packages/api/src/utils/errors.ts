import { AxiosError } from "axios";
import { ApiError } from "../types";

export function handleApiError(error: AxiosError): ApiError {
    if (error.response) {
        const data = error.response.data as any;

        return {
            message: data?.message || error.message || "An error occurred",
            code: data?.code || error.code,
            status: error.response.status,
            errors: data?.errors,
        };
    } else if (error.request) {
        return {
            message: "Sem resposta do servidor. Por favor, verifique sua conexão.",
            code: "NETWORK_ERROR",
            status: 0,
        };
    } else {
        return {
            message: error.message || "Falha ao fazer a requisição",
            code: "REQUEST_ERROR",
        };
    }
}

export function isUnauthorizedError(error: ApiError): boolean {
    return error.status === 401;
}

export function isForbiddenError(error: ApiError): boolean {
    return error.status === 403;
}

export function isNotFoundError(error: ApiError): boolean {
    return error.status === 404;
}

export function isBadRequestError(error: ApiError): boolean {
    return error.status === 400;
}

export function isValidationError(error: ApiError): boolean {
    return error.status === 422;
}

export function isConflictError(error: ApiError): boolean {
    return error.status === 409;
}

export function isServerError(error: ApiError): boolean {
    return !!error.status && error.status >= 500;
}

export function getErrorMessage(error: ApiError): string {
    if (error.errors) {
        const messages = Object.values(error.errors).flat();
        return messages.join(", ");
    }
    return error.message;
}

export function getFriendlyMessage(error: ApiError | undefined | null): string {
    if (!error) {
        return "Ocorreu um erro inesperado. Tente novamente.";
    }

    if (error.status === 0) {
        return "Sem resposta do servidor. Verifique sua conexão e tente novamente.";
    }

    if (isServerError(error)) {
        return "Ocorreu um erro no servidor. Tente novamente mais tarde.";
    }

    if (isValidationError(error)) {
        return "Existem erros no formulário. Corrija os campos indicados e envie novamente.";
    }

    if (isUnauthorizedError(error)) {
        return "Sua sessão expirou. Faça login novamente.";
    }

    if (isForbiddenError(error)) {
        return "Você não tem permissão para executar esta ação.";
    }

    if (isNotFoundError(error)) {
        return "Recurso não encontrado.";
    }

    if (isBadRequestError(error)) {
        return error.message || "Requisição inválida. Verifique os dados e tente novamente.";
    }

    if (isConflictError(error)) {
        return error.message || "Conflito ao processar sua solicitação.";
    }

    const detailed = getErrorMessage(error);
    if (detailed && detailed.trim()) {
        return detailed;
    }

    return "Ocorreu um erro. Tente novamente.";
}
