import { useAuth } from "../../contexts/AuthContext";
import {
    AUTH_LOADING_KEYS,
    loadingStateManager,
    LoginForm,
    isValidationError,
    ApiError,
} from "@front-engine/api";
import { useForm } from "../../hooks/useForm";

import { minLength, required } from "@front-engine/utils-ts/validations";
import { LoginViewProps } from "./types";
import { useToggle } from "../../hooks";
import { useEffect, useState } from "react";

export function useLoginPage(): LoginViewProps {
    const { login } = useAuth();
    const [viewAlert, _, setViewAlertTrue, setViewAlertFalse] = useToggle(false);

    const form = useForm<LoginForm>({
        username: {
            initialValue: "",
            validators: [required],
        },
        password: {
            initialValue: "",
            validators: [required, minLength(6)],
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<ApiError | null>(null);

    const onSubmit = async (values: LoginForm) => {
        try {
            await login(values);
        } catch (err: any) {
            if (apiError && isValidationError(apiError)) {
                form.setApiErrors(apiError);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = loadingStateManager.subscribe(
            AUTH_LOADING_KEYS.LOGIN,
            ({ isLoading, error }) => {
                setIsLoading(isLoading);
                setApiError(error);
            },
        );

        return unsubscribe;
    }, []);

    useEffect(() => {
        apiError ? setViewAlertTrue() : setViewAlertFalse();
    }, [apiError]);

    return {
        form,
        isLoading,
        apiError,
        viewAlert,
        setViewAlertFalse,
        handleSubmit: form.handleSubmit(onSubmit),
    };
}
