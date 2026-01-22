import { useCallback, useState, useRef, useMemo, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import type { ValidationResult, ValidatorFn } from "@front-engine/utils-ts/validations";
import { ApiError } from "@front-engine/api";

// ============================================================================
// TIPOS
// ============================================================================

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

export interface FieldProps {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => void;
    onBlur: () => void;
    name: string;
    error: boolean;
}

export interface FieldState {
    value: any;
    error: string | undefined;
    touched: boolean;
}

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
    // 🆕 Novos métodos para otimização
    subscribe: (field: string, callback: () => void) => () => void;
    getFieldState: (field: string) => FieldState;
    useField: (field: string) => FieldState & { 
        onChange: (value: any) => void; 
        onBlur: () => void;
    };
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

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

// ============================================================================
// FORM STORE - Sistema de subscriptions granular
// ============================================================================

type Listener = () => void;

class FormStore<T extends Record<string, any>> {
    private values: FormValues<T>;
    private errors: FormErrors<T> = {};
    private touched: Record<string, boolean> = {};
    private listeners: Map<string, Set<Listener>> = new Map();
    private globalListeners: Set<Listener> = new Set();

    constructor(initialValues: FormValues<T>) {
        this.values = initialValues;
    }

    // Obtém estado de um campo específico
    getFieldState(field: string): FieldState {
        return {
            value: getByPath(this.values, field) ?? "",
            error: this.errors[field],
            touched: !!this.touched[field],
        };
    }

    // Obtém todos os valores
    getValues(): FormValues<T> {
        return this.values;
    }

    getErrors(): FormErrors<T> {
        return this.errors;
    }

    getTouched(): Record<string, boolean> {
        return this.touched;
    }

    // Atualiza valor de um campo
    setValue(field: string, value: any): void {
        const oldValue = getByPath(this.values, field);
        if (oldValue === value) return;

        this.values = setByPath(this.values, field, value);
        this.notifyField(field);
    }

    // Atualiza múltiplos valores
    setValues(newValues: Partial<FormValues<T>>): void {
        let hasChanges = false;
        for (const key in newValues) {
            if (Object.prototype.hasOwnProperty.call(newValues, key)) {
                const oldValue = getByPath(this.values, key);
                if (oldValue !== newValues[key]) {
                    this.values = setByPath(this.values, key, newValues[key]);
                    hasChanges = true;
                    this.notifyField(key);
                }
            }
        }
        if (hasChanges) {
            this.notifyGlobal();
        }
    }

    // Atualiza erro de um campo
    setError(field: string, error: string | undefined): void {
        if (this.errors[field] === error) return;

        if (error) {
            this.errors = { ...this.errors, [field]: error };
        } else {
            const newErrors = { ...this.errors };
            delete newErrors[field];
            this.errors = newErrors;
        }
        this.notifyField(field);
    }

    // Atualiza todos os erros
    setErrors(errors: FormErrors<T>): void {
        this.errors = errors;
        this.notifyGlobal();
    }

    // Atualiza touched de um campo
    setTouched(field: string, isTouched: boolean): void {
        if (this.touched[field] === isTouched) return;

        this.touched = { ...this.touched, [field]: isTouched };
        this.notifyField(field);
    }

    // Atualiza múltiplos touched
    setAllTouched(fields: string[]): void {
        const newTouched = { ...this.touched };
        fields.forEach(field => {
            newTouched[field] = true;
        });
        this.touched = newTouched;
        this.notifyGlobal();
    }

    // Reset do form
    reset(newValues: FormValues<T>): void {
        this.values = newValues;
        this.errors = {};
        this.touched = {};
        this.notifyGlobal();
    }

    // Sistema de subscriptions
    subscribe(field: string, listener: Listener): () => void {
        if (!this.listeners.has(field)) {
            this.listeners.set(field, new Set());
        }
        this.listeners.get(field)!.add(listener);

        return () => {
            const fieldListeners = this.listeners.get(field);
            if (fieldListeners) {
                fieldListeners.delete(listener);
                if (fieldListeners.size === 0) {
                    this.listeners.delete(field);
                }
            }
        };
    }

    subscribeGlobal(listener: Listener): () => void {
        this.globalListeners.add(listener);
        return () => {
            this.globalListeners.delete(listener);
        };
    }

    private notifyField(field: string): void {
        const fieldListeners = this.listeners.get(field);
        if (fieldListeners) {
            fieldListeners.forEach(listener => listener());
        }
        // Também notifica listeners de campos pai (para arrays)
        const parts = field.split('.');
        for (let i = parts.length - 1; i > 0; i--) {
            const parentField = parts.slice(0, i).join('.');
            const parentListeners = this.listeners.get(parentField);
            if (parentListeners) {
                parentListeners.forEach(listener => listener());
            }
        }
    }

    private notifyGlobal(): void {
        // Notifica todos os campos
        this.listeners.forEach((listeners) => {
            listeners.forEach(listener => listener());
        });
        this.globalListeners.forEach(listener => listener());
    }
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useForm<T extends Record<string, any>>(config: FormConfig<T>): UseFormResult<T> {
    const configRef = useRef(config);
    configRef.current = config;

    const initialValuesRef = useRef<FormValues<T>>(getInitialValues(config));

    // Store única para o form
    const storeRef = useRef<FormStore<T>>();
    if (!storeRef.current) {
        storeRef.current = new FormStore<T>(initialValuesRef.current);
    }
    const store = storeRef.current;

    // Estado global para forçar re-render quando necessário (submit, reset)
    const [, forceUpdate] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cache de handlers por field - ESTÁVEL
    const handlersCache = useRef<Map<string, { onChange: (e: any) => void; onBlur: () => void }>>(new Map());

    // Obtém o field config
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

    // Validação de campo
    const validateField = useCallback((field: string, valueArg?: any): boolean => {
        const fieldConfig = getFieldConfig(field);
        if (!fieldConfig?.validators) {
            store.setError(field, undefined);
            return true;
        }

        const value = valueArg !== undefined ? valueArg : store.getFieldState(field).value;

        for (const validator of fieldConfig.validators) {
            const result: ValidationResult = validator(value);
            if (!result.valid) {
                store.setError(field, result.error || "Campo inválido");
                return false;
            }
        }

        store.setError(field, undefined);
        return true;
    }, [getFieldConfig, store]);

    // Handler de mudança - ESTÁVEL
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
            value = rawValue;
        }

        const finalValue = applySetter(field, value);
        store.setValue(field, finalValue);

        // Validar apenas se já foi tocado
        if (store.getTouched()[field]) {
            // Usar setTimeout para não bloquear o render
            setTimeout(() => validateField(field, finalValue), 0);
        }
    }, [applySetter, store, validateField]);

    // Handler de blur - ESTÁVEL
    const handleFieldBlur = useCallback((field: string) => {
        store.setTouched(field, true);
        validateField(field);
    }, [store, validateField]);

    // getFieldProps otimizado - retorna handlers estáveis do cache
    const getFieldProps = useCallback((field: string): FieldProps => {
        let handlers = handlersCache.current.get(field);

        if (!handlers) {
            handlers = {
                onChange: (e: any) => handleFieldChange(field, e),
                onBlur: () => handleFieldBlur(field),
            };
            handlersCache.current.set(field, handlers);
        }

        const state = store.getFieldState(field);

        return {
            value: state.value,
            onChange: handlers.onChange,
            onBlur: handlers.onBlur,
            name: field,
            error: state.touched && !!state.error,
        };
    }, [handleFieldChange, handleFieldBlur, store]);

    // Subscribe para mudanças em um campo específico
    const subscribe = useCallback((field: string, callback: () => void): (() => void) => {
        return store.subscribe(field, callback);
    }, [store]);

    // Obtém estado atual de um campo
    const getFieldState = useCallback((field: string): FieldState => {
        return store.getFieldState(field);
    }, [store]);

    // 🆕 Hook para usar dentro de componentes - permite re-render isolado
    const useField = useCallback((field: string) => {
        // useSyncExternalStore para subscription granular
        const fieldState = useSyncExternalStore(
            (callback) => store.subscribe(field, callback),
            () => store.getFieldState(field),
            () => store.getFieldState(field)
        );

        let handlers = handlersCache.current.get(field);
        if (!handlers) {
            handlers = {
                onChange: (e: any) => handleFieldChange(field, e),
                onBlur: () => handleFieldBlur(field),
            };
            handlersCache.current.set(field, handlers);
        }

        return {
            ...fieldState,
            onChange: handlers.onChange,
            onBlur: handlers.onBlur,
        };
    }, [store, handleFieldChange, handleFieldBlur]);

    // Validação do form completo
    const validateForm = useCallback((): boolean => {
        let isValid = true;
        const currentConfig = configRef.current;
        const currentValues = store.getValues();
        const fieldsToTouch: string[] = [];

        for (const field in currentConfig) {
            if (!Object.prototype.hasOwnProperty.call(currentConfig, field)) continue;

            const fieldConfig = currentConfig[field];
            if (!fieldConfig?.validators) continue;

            fieldsToTouch.push(field);
            const value = (currentValues as any)[field];

            for (const validator of fieldConfig.validators) {
                const result: ValidationResult = validator(value);
                if (!result.valid) {
                    store.setError(field, result.error || "Campo inválido");
                    isValid = false;
                    break;
                }
            }
        }

        store.setAllTouched(fieldsToTouch);
        return isValid;
    }, [store]);

    // Submit handler
    const handleSubmit = useCallback(
        (onSubmit: (values: FormValues<T>) => void | Promise<void>) => {
            return async (e: FormEvent) => {
                e.preventDefault();

                if (!validateForm()) return;

                setIsSubmitting(true);
                try {
                    await onSubmit(store.getValues());
                } finally {
                    setIsSubmitting(false);
                }
            };
        },
        [validateForm, store],
    );

    // Reset
    const reset = useCallback((newValues?: Partial<FormValues<T>>) => {
        handlersCache.current.clear();
        const resetValues = newValues
            ? { ...initialValuesRef.current, ...newValues }
            : initialValuesRef.current;
        store.reset(resetValues as FormValues<T>);
        forceUpdate(n => n + 1);
    }, [store]);

    // Setters diretos
    const setValue = useCallback((field: string, value: any) => {
        const finalValue = applySetter(field, value);
        store.setValue(field, finalValue);
    }, [applySetter, store]);

    const setValues = useCallback((newValues: Partial<FormValues<T>>) => {
        for (const key in newValues) {
            if (Object.prototype.hasOwnProperty.call(newValues, key)) {
                const finalValue = applySetter(key, newValues[key]);
                store.setValue(key, finalValue);
            }
        }
    }, [applySetter, store]);

    const setError = useCallback((field: string, error: string) => {
        store.setError(field, error);
    }, [store]);

    const setErrors = useCallback((newErrors: FormErrors<T>) => {
        store.setErrors(newErrors);
    }, [store]);

    const clearError = useCallback((field: string) => {
        store.setError(field, undefined);
    }, [store]);

    const setTouched = useCallback((field: string, isTouched: boolean) => {
        store.setTouched(field, isTouched);
    }, [store]);

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

            store.setErrors(out);
        },
        [store],
    );

    // Array helpers
    const appendItem = useCallback(<I,>(field: keyof T, item: I) => {
        const currentArray = (store.getValues() as any)[field] || [];
        if (!Array.isArray(currentArray)) {
            console.warn(`Field "${String(field)}" is not an array`);
            return;
        }
        store.setValue(String(field), [...currentArray, item]);
    }, [store]);

    const removeItem = useCallback((field: keyof T, index: number) => {
        const currentArray = (store.getValues() as any)[field];
        if (!Array.isArray(currentArray)) {
            console.warn(`Field "${String(field)}" is not an array`);
            return;
        }
        const newArray = [...currentArray];
        newArray.splice(index, 1);
        store.setValue(String(field), newArray);

        // Limpar erros relacionados
        const prefix = `${String(field)}.${index}`;
        const currentErrors = store.getErrors();
        const newErrors = { ...currentErrors };
        let hasChanges = false;

        for (const key in newErrors) {
            if (key.startsWith(prefix)) {
                delete newErrors[key];
                hasChanges = true;
            }
        }

        if (hasChanges) {
            store.setErrors(newErrors);
        }
    }, [store]);

    const updateItem = useCallback(<I,>(field: keyof T, index: number, item: I) => {
        const currentArray = (store.getValues() as any)[field];
        if (!Array.isArray(currentArray)) {
            console.warn(`Field "${String(field)}" is not an array`);
            return;
        }
        const newArray = [...currentArray];
        newArray[index] = item;
        store.setValue(String(field), newArray);
    }, [store]);

    const getArrayField = useCallback(<I,>(field: keyof T): I[] => {
        const value = (store.getValues() as any)[field];
        return Array.isArray(value) ? value : [];
    }, [store]);

    // Valores derivados usando useSyncExternalStore para re-render eficiente
    const values = useSyncExternalStore(
        (callback) => store.subscribeGlobal(callback),
        () => store.getValues(),
        () => store.getValues()
    );

    const errors = useSyncExternalStore(
        (callback) => store.subscribeGlobal(callback),
        () => store.getErrors(),
        () => store.getErrors()
    );

    const touched = useSyncExternalStore(
        (callback) => store.subscribeGlobal(callback),
        () => store.getTouched(),
        () => store.getTouched()
    );

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
        // Novos métodos
        subscribe,
        getFieldState,
        useField,
    };
}
