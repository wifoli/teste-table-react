import { useCallback, useState, useRef, useMemo } from "react";
import type { FormEvent } from "react";
import type { ValidationResult, ValidatorFn } from "@front-engine/utils-ts/validations";
import { ApiError } from "@front-engine/api";

export interface FieldConfig<T = any> {
    validators?: ValidatorFn[];
    initialValue?: T;
    setter?: (value: T) => T;
}

export type FormConfig<T extends Record<string, any>> = {
    [K in keyof T]: FieldConfig<T[K]>;
};

export type FormErrors<T extends Record<string, any>> = Partial<Record<keyof T | string, string>>;
export type FormValues<T extends Record<string, any>> = T;

export interface UseFormResult<T extends Record<string, any>> {
    values: FormValues<T>;
    errors: FormErrors<T>;
    touched: Partial<Record<string, boolean>>;
    isValid: boolean;
    isSubmitting: boolean;
    setValue: (field: string, value: any) => void;
    setValues: (values: Partial<FormValues<T>>) => void;
    setError: (field: string, error: string) => void;
    setErrors: (errors: FormErrors<T>) => void;
    clearError: (field: string) => void;
    setTouched: (field: string, touched: boolean) => void;
    setApiErrors: (apiError?: ApiError | null, keyMap?: Record<string, string>) => void;
    validateField: (field: string, value?: any) => boolean;
    validateForm: () => boolean;
    getFieldProps: (field: string) => FieldProps;
    handleSubmit: (
        onSubmit: (values: FormValues<T>) => void | Promise<void>,
    ) => (e: FormEvent) => Promise<void>;
    reset: (newValues?: Partial<FormValues<T>>) => void;
    // Array helpers
    appendItem: <I>(field: keyof T, item: I) => void;
    removeItem: (field: keyof T, index: number) => void;
    updateItem: <I>(field: keyof T, index: number, item: I) => void;
    getArrayField: <I>(field: keyof T) => I[];
}

export interface FieldProps {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => void;
    onBlur: () => void;
    name: string;
    error: boolean;
}

// Utilitário para acessar/modificar valores por path (ex: "items.0.name" ou "items[0].name")
function getByPath(obj: any, path: string): any {
    const keys = parsePath(path);
    let current = obj;
    for (const key of keys) {
        if (current == null) return undefined;
        current = current[key];
    }
    return current;
}

function setByPath(obj: any, path: string, value: any): any {
    const keys = parsePath(path);
    const result = deepClone(obj);
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];

        if (current[key] == null) {
            current[key] = typeof nextKey === "number" ? [] : {};
        } else if (typeof current[key] !== "object") {
            current[key] = typeof nextKey === "number" ? [] : {};
        } else {
            current[key] = Array.isArray(current[key])
                ? [...current[key]]
                : { ...current[key] };
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return result;
}

function parsePath(path: string): (string | number)[] {
    // Suporta "items.0.name" e "items[0].name"
    return path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .map((key) => {
            const num = parseInt(key, 10);
            return isNaN(num) ? key : num;
        });
}

function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(deepClone) as T;
    const cloned = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

function getInitialValues<T extends Record<string, any>>(config: FormConfig<T>): FormValues<T> {
    const values = {} as FormValues<T>;
    for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            const fieldConfig = config[key];
            (values as any)[key] = fieldConfig.initialValue ?? "";
        }
    }
    return values;
}

export function useForm<T extends Record<string, any>>(config: FormConfig<T>): UseFormResult<T> {
    // Usar useRef para config para evitar recriação de callbacks
    const configRef = useRef(config);
    configRef.current = config;

    const initialValuesRef = useRef<FormValues<T>>(getInitialValues(config));

    const [values, setValuesState] = useState<FormValues<T>>(() => initialValuesRef.current);
    const [errors, setErrorsState] = useState<FormErrors<T>>({});
    const [touched, setTouchedState] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ref para valores atuais (evita dependências nos callbacks)
    const valuesRef = useRef(values);
    valuesRef.current = values;

    const touchedRef = useRef(touched);
    touchedRef.current = touched;

    // Obtém o field config para um campo (suporta campos de primeiro nível)
    const getFieldConfig = useCallback((field: string): FieldConfig<any> | undefined => {
        const rootKey = parsePath(field)[0];
        return configRef.current[rootKey as keyof T];
    }, []);

    // Aplica setter se existir
    const applySetter = useCallback((field: string, value: any): any => {
        const fieldConfig = getFieldConfig(field);
        if (fieldConfig?.setter) {
            return fieldConfig.setter(value);
        }
        return value;
    }, [getFieldConfig]);

    const validateField = useCallback((field: string, valueArg?: any): boolean => {
        const fieldConfig = getFieldConfig(field);
        if (!fieldConfig?.validators) return true;

        const value = valueArg !== undefined ? valueArg : getByPath(valuesRef.current, field);

        for (const validator of fieldConfig.validators) {
            const result: ValidationResult = validator(value);
            if (!result.valid) {
                setErrorsState((prev) => ({
                    ...prev,
                    [field]: result.error || "Campo inválido",
                }));
                return false;
            }
        }

        setErrorsState((prev) => {
            if (!(field in prev)) return prev;

            const next = { ...prev };
            delete (next as any)[field];
            return next;
        });

        return true;
    }, [getFieldConfig]);

    const validateForm = useCallback((): boolean => {
        let isValid = true;
        const newErrors: FormErrors<T> = {};
        const currentConfig = configRef.current;
        const currentValues = valuesRef.current;

        for (const field in currentConfig) {
            if (!Object.prototype.hasOwnProperty.call(currentConfig, field)) continue;

            const fieldConfig = currentConfig[field];
            if (!fieldConfig?.validators) continue;

            const value = (currentValues as any)[field];
            setTouchedState((prev) => ({ ...prev, [field]: true }));

            for (const validator of fieldConfig.validators) {
                const result: ValidationResult = validator(value);
                if (!result.valid) {
                    newErrors[field] = result.error || "Campo inválido";
                    isValid = false;
                    break;
                }
            }
        }

        setErrorsState(newErrors);
        return isValid;
    }, []);

    const setValue = useCallback((field: string, value: any) => {
        const finalValue = applySetter(field, value);
        setValuesState((prev) => setByPath(prev, field, finalValue));
    }, [applySetter]);

    const setValues = useCallback((newValues: Partial<FormValues<T>>) => {
        setValuesState((prev) => {
            let updated = { ...prev };
            for (const key in newValues) {
                if (Object.prototype.hasOwnProperty.call(newValues, key)) {
                    const finalValue = applySetter(key, newValues[key]);
                    updated = setByPath(updated, key, finalValue);
                }
            }
            return updated;
        });
    }, [applySetter]);

    const setError = useCallback((field: string, error: string) => {
        setErrorsState((prev) => ({ ...prev, [field]: error }));
    }, []);

    const setErrors = useCallback((newErrors: FormErrors<T>) => {
        setErrorsState(newErrors);
    }, []);

    const clearError = useCallback((field: string) => {
        setErrorsState((prev) => {
            if (!(field in prev)) return prev;

            const next = { ...prev };
            delete (next as any)[field];
            return next;
        });
    }, []);

    const setTouched = useCallback((field: string, isTouched: boolean) => {
        setTouchedState((prev) => {
            if (prev[field] === isTouched) return prev;
            return { ...prev, [field]: isTouched };
        });
    }, []);

    const setApiErrors = useCallback(
        (apiError?: ApiError | null, keyMap?: Record<string, string>) => {
            if (!apiError?.errors) return;

            const out: FormErrors<T> = {};

            for (const [apiKey, arr] of Object.entries(apiError.errors)) {
                if (!arr) continue;
                const message = Array.isArray(arr) ? arr.filter(Boolean).join(" ") : String(arr);
                const targetKey = keyMap?.[apiKey] ?? apiKey;
                out[targetKey as keyof FormErrors<T>] = message;
            }

            setErrorsState(out);
        },
        [],
    );

    // Handler otimizado que usa refs
    const handleFieldChange = useCallback((field: string, rawValue: any) => {
        let value: any;

        if (rawValue === null || rawValue === undefined) {
            value = rawValue;
        } else if (typeof rawValue === "string" || typeof rawValue === "number" || typeof rawValue === "boolean") {
            value = rawValue;
        } else if (rawValue && typeof rawValue === "object" && "target" in rawValue) {
            const target = rawValue.target as HTMLInputElement;
            value = target.type === "checkbox" ? target.checked : target.value;
        } else {
            // Objetos, arrays, etc.
            value = rawValue;
        }

        const finalValue = applySetter(field, value);
        setValuesState((prev) => setByPath(prev, field, finalValue));

        // Validar apenas se já foi tocado
        if (touchedRef.current[field]) {
            // Usar setTimeout para não bloquear o render
            setTimeout(() => validateField(field, finalValue), 0);
        }
    }, [applySetter, validateField]);

    const handleFieldBlur = useCallback((field: string) => {
        setTouchedState((prev) => {
            if (prev[field]) return prev;
            return { ...prev, [field]: true };
        });
        validateField(field);
    }, [validateField]);

    // Cache de handlers por field - evita criar novas funções
    const handlersCache = useRef<Map<string, { onChange: any; onBlur: any }>>(new Map());

    const getFieldProps = useCallback((field: string): FieldProps => {
        let handlers = handlersCache.current.get(field);

        if (!handlers) {
            handlers = {
                onChange: (e: any) => handleFieldChange(field, e),
                onBlur: () => handleFieldBlur(field),
            };
            handlersCache.current.set(field, handlers);
        }

        return {
            value: getByPath(valuesRef.current, field) ?? "",
            onChange: handlers.onChange,
            onBlur: handlers.onBlur,
            name: field,
            error: !!(touchedRef.current[field] && errors[field]),
        };
    }, [handleFieldChange, handleFieldBlur, errors]);

    const handleSubmit = useCallback(
        (onSubmit: (values: FormValues<T>) => void | Promise<void>) => {
            return async (e: FormEvent) => {
                e.preventDefault();

                // Marcar todos como touched
                const allTouched: Record<string, boolean> = {};
                for (const key in configRef.current) {
                    if (Object.prototype.hasOwnProperty.call(configRef.current, key)) {
                        allTouched[key] = true;
                    }
                }
                setTouchedState(allTouched);

                if (!validateForm()) return;

                setIsSubmitting(true);
                try {
                    await onSubmit(valuesRef.current);
                } finally {
                    setIsSubmitting(false);
                }
            };
        },
        [validateForm],
    );

    const reset = useCallback((newValues?: Partial<FormValues<T>>) => {
        handlersCache.current.clear();
        const resetValues = newValues
            ? { ...initialValuesRef.current, ...newValues }
            : initialValuesRef.current;
        setValuesState(resetValues);
        setErrorsState({});
        setTouchedState({});
        setIsSubmitting(false);
    }, []);

    // === Array Helpers ===

    const appendItem = useCallback(<I,>(field: keyof T, item: I) => {
        setValuesState((prev) => {
            const currentArray = (prev as any)[field] || [];
            if (!Array.isArray(currentArray)) {
                console.warn(`Field "${String(field)}" is not an array`);
                return prev;
            }
            return {
                ...prev,
                [field]: [...currentArray, item],
            };
        });
    }, []);

    const removeItem = useCallback((field: keyof T, index: number) => {
        setValuesState((prev) => {
            const currentArray = (prev as any)[field];
            if (!Array.isArray(currentArray)) {
                console.warn(`Field "${String(field)}" is not an array`);
                return prev;
            }
            const newArray = [...currentArray];
            newArray.splice(index, 1);
            return {
                ...prev,
                [field]: newArray,
            };
        });

        // Limpar erros relacionados ao item removido
        setErrorsState((prev) => {
            const prefix = `${String(field)}.${index}`;
            const newErrors = { ...prev };
            let hasChanges = false;

            for (const key in newErrors) {
                if (key.startsWith(prefix)) {
                    delete newErrors[key];
                    hasChanges = true;
                }
            }

            return hasChanges ? newErrors : prev;
        });
    }, []);

    const updateItem = useCallback(<I,>(field: keyof T, index: number, item: I) => {
        setValuesState((prev) => {
            const currentArray = (prev as any)[field];
            if (!Array.isArray(currentArray)) {
                console.warn(`Field "${String(field)}" is not an array`);
                return prev;
            }
            const newArray = [...currentArray];
            newArray[index] = item;
            return {
                ...prev,
                [field]: newArray,
            };
        });
    }, []);

    const getArrayField = useCallback(<I,>(field: keyof T): I[] => {
        const value = (valuesRef.current as any)[field];
        return Array.isArray(value) ? value : [];
    }, []);

    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

    return {
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
        setValue,
        setValues,
        setError,
        setErrors,
        clearError,
        setTouched,
        setApiErrors,
        validateField,
        validateForm,
        getFieldProps,
        handleSubmit,
        reset,
        appendItem,
        removeItem,
        updateItem,
        getArrayField,
    };
}