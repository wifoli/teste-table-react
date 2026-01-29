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

type Primitive = string | number | boolean | null | undefined | Date;

export type FormConfig<T> = T extends Primitive
    ? FieldConfig<T>
    : T extends Array<infer U>
      ? FormConfig<U>[]
      : T extends object
        ? { [K in keyof T]?: FormConfig<T[K]> }
        : FieldConfig<T>;

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
    submit: (
        onSubmit: (values: FormValues<T>) => void | Promise<void>,
    ) => Promise<{ isValid: boolean; errors: FormErrors<T> }>;
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
            current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
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

function flattenConfig(config: any, prefix = "", out: Record<string, FieldConfig> = {}) {
    if (!config) return out;

    if (isFieldConfig(config)) {
        out[prefix] = config;
        return out;
    }

    if (Array.isArray(config) && config.length > 0) {
        const template = config[0];
        // não importa quantos índices vão existir no array, sempre use o template
        // neste momento, só index 0 precisa ser configurado
        flattenConfig(template, `${prefix}.0`, out);
        return out;
    }

    if (typeof config === "object") {
        for (const key in config) {
            flattenConfig(config[key], prefix ? `${prefix}.${key}` : key, out);
        }
    }

    return out;
}

function isFieldConfig(value: any): value is FieldConfig {
    return value && ("validators" in value || "initialValue" in value || "setter" in value);
}

function getInitialValuesFromConfig<T extends Record<string, any>>(
    config: FormConfig<T>,
): FormValues<T> {
    const values = {} as FormValues<T>;

    const flat = flattenConfig(config);
    for (const path in flat) {
        if (flat[path].initialValue !== undefined) {
            setByPath(values, path, flat[path].initialValue);
        }
    }

    return values;
}

function buildInitialItemFromFlatConfig(flat: Record<string, FieldConfig>, arrayField: string) {
    let item: any = {};
    const templatePrefix = arrayField.replace(/\.\d+\./g, ".0.") + ".0.";

    for (const path in flat) {
        if (!path.startsWith(templatePrefix)) continue;

        const relativePath = path.slice(templatePrefix.length);

        if (flat[path].initialValue !== undefined) {
            item = setByPath(item, relativePath, flat[path].initialValue);
        }
    }

    return item;
}

function expandTemplatePath(templatePath: string, values: any): string[] {
    const parts = templatePath.split(".");

    function walk(idx: number, currentValue: any, acc: string[]): string[] {
        if (idx === parts.length) {
            return [acc.join(".")];
        }

        const part = parts[idx];

        // se o template usa "0" como placeholder de array, expandimos para cada índice do array real
        if (part === "0") {
            if (!Array.isArray(currentValue)) {
                // array não existe na realidade → não há paths concretos
                return [];
            }

            const out: string[] = [];
            for (let i = 0; i < currentValue.length; i++) {
                out.push(...walk(idx + 1, currentValue[i], [...acc, String(i)]));
            }
            return out;
        }

        // caminho normal (objeto / campo)
        return walk(idx + 1, currentValue ? currentValue[part] : undefined, [...acc, part]);
    }

    return walk(0, values, []);
}

function flattenApiErrors(obj: any, prefix = "", out: FormErrors<any> = {}): FormErrors<any> {
    if (!obj) return out;

    if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            flattenApiErrors(item, prefix ? `${prefix}.${index}` : `${index}`, out);
        });
    } else if (typeof obj === "object") {
        for (const key in obj) {
            const value = obj[key];
            const newPrefix = prefix ? `${prefix}.${key}` : key;

            if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
                // array de strings → join
                out[newPrefix] = value.filter(Boolean).join(" ");
            } else {
                flattenApiErrors(value, newPrefix, out);
            }
        }
    }

    return out;
}

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

    private fieldStateCache = new Map<string, FieldState>();

    // Obtém estado de um campo específico
    getFieldState(field: string): FieldState {
        const prev = this.fieldStateCache.get(field);

        const next: FieldState = {
            value: getByPath(this.values, field) ?? "",
            error: this.errors[field],
            touched: !!this.touched[field],
        };

        // Retorna a MESMA referência se nada mudou
        if (
            prev &&
            prev.value === next.value &&
            prev.error === next.error &&
            prev.touched === next.touched
        ) {
            return prev;
        }

        this.fieldStateCache.set(field, next);
        return next;
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
        fields.forEach((field) => {
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
        this.fieldStateCache.clear();
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
        this.fieldStateCache.delete(field);

        const fieldListeners = this.listeners.get(field);
        if (fieldListeners) {
            fieldListeners.forEach((listener) => listener());
        }

        const parts = field.split(".");
        for (let i = parts.length - 1; i > 0; i--) {
            const parentField = parts.slice(0, i).join(".");
            this.fieldStateCache.delete(parentField);

            const parentListeners = this.listeners.get(parentField);
            if (parentListeners) {
                parentListeners.forEach((listener) => listener());
            }
        }
    }

    private notifyGlobal(): void {
        // Notifica todos os campos
        this.listeners.forEach((listeners) => {
            listeners.forEach((listener) => listener());
        });
        this.globalListeners.forEach((listener) => listener());
    }
}

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useForm<T extends Record<string, any>>(config: FormConfig<T>): UseFormResult<T> {
    const flatConfigRef = useRef<Record<string, FieldConfig>>({});

    useMemo(() => {
        flatConfigRef.current = flattenConfig(config);
    }, [config]);

    const initialValuesRef = useRef<FormValues<T>>(getInitialValuesFromConfig(config));

    // Store única para o form
    const storeRef = useRef<FormStore<T> | null>(null);
    if (!storeRef.current) {
        storeRef.current = new FormStore<T>(initialValuesRef.current);
    }
    const store = storeRef.current;

    // Estado global para forçar re-render quando necessário (submit, reset)
    const [, forceUpdate] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cache de handlers por field
    const handlersCache = useRef<Map<string, { onChange: (e: any) => void; onBlur: () => void }>>(
        new Map(),
    );

    // Obtém o field config
    const getFieldConfig = useCallback((field: string) => {
        const flat = flatConfigRef.current;

        if (flat[field]) return flat[field];

        // fallback para arrays-template
        const parts = field.split(".");
        const normalizedParts = parts.map((p) => (!isNaN(Number(p)) ? "0" : p));

        const normalizedPath = normalizedParts.join(".");
        return flat[normalizedPath];
    }, []);

    // Aplica setter se existir
    const applySetter = useCallback(
        (field: string, value: any): any => {
            const fieldConfig = getFieldConfig(field);
            if (fieldConfig?.setter) {
                return fieldConfig.setter(value);
            }
            return value;
        },
        [getFieldConfig],
    );

    // Validação de campo
    const validateField = useCallback(
        (field: string, valueArg?: any): boolean => {
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
        },
        [getFieldConfig, store],
    );

    // Handler de mudança
    const handleFieldChange = useCallback(
        (field: string, rawValue: any) => {
            let value: any;

            if (rawValue === null || rawValue === undefined) {
                value = rawValue;
            } else if (
                typeof rawValue === "string" ||
                typeof rawValue === "number" ||
                typeof rawValue === "boolean"
            ) {
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
                validateField(field, finalValue);
            }
        },
        [applySetter, store, validateField],
    );

    // Handler de blur
    const handleFieldBlur = useCallback(
        (field: string) => {
            store.setTouched(field, true);
            validateField(field);
        },
        [store, validateField],
    );

    // getFieldProps otimizado - retorna handlers estáveis do cache
    const getFieldProps = useCallback(
        (field: string): FieldProps => {
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
        },
        [handleFieldChange, handleFieldBlur, store],
    );

    // Subscribe para mudanças em um campo específico
    const subscribe = useCallback(
        (field: string, callback: () => void): (() => void) => {
            return store.subscribe(field, callback);
        },
        [store],
    );

    // Obtém estado atual de um campo
    const getFieldState = useCallback(
        (field: string): FieldState => {
            return store.getFieldState(field);
        },
        [store],
    );

    // 🆕 Hook para usar dentro de componentes - permite re-render isolado
    const useField = useCallback(
        (field: string) => {
            // useSyncExternalStore para subscription granular
            const fieldState = useSyncExternalStore(
                (callback) => store.subscribe(field, callback),
                () => store.getFieldState(field),
                () => store.getFieldState(field),
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
        },
        [store, handleFieldChange, handleFieldBlur],
    );

    const validateForm = useCallback((): boolean => {
        let isValid = true;
        const values = store.getValues();
        const flatConfig = flatConfigRef.current;

        const fieldsToTouchSet = new Set<string>();

        for (const templatePath in flatConfig) {
            const fieldConfig = flatConfig[templatePath];
            if (!fieldConfig.validators?.length) continue;

            // expandir template para paths concretos com base nos valores atuais
            const expandedPaths = expandTemplatePath(templatePath, values);

            // se não houve expansão (ex.: template tem "0" mas array está vazio), pula
            if (expandedPaths.length === 0) continue;

            for (const field of expandedPaths) {
                fieldsToTouchSet.add(field);

                const rawValue = getByPath(values, field);
                const value = applySetter(field, rawValue);

                store.setValue(field, value); // garante que store tem valor final
                fieldsToTouchSet.add(field);

                for (const validator of fieldConfig.validators) {
                    const result: ValidationResult = validator(value);
                    if (!result.valid) {
                        store.setError(field, result.error || "Campo inválido");
                        isValid = false;
                        break;
                    } else {
                        // limpar erro anterior caso tenha sido corrigido
                        store.setError(field, undefined);
                    }
                }
            }
        }

        // marca todos os campos concretos como touched
        store.setAllTouched(Array.from(fieldsToTouchSet));
        return isValid;
    }, [store]);

    const submit = useCallback(
        async (onSubmit: (values: FormValues<T>) => void | Promise<void>) => {
            const isValid = validateForm();
            const errors = store.getErrors();

            if (!isValid) {
                return { isValid: false, errors };
            }

            setIsSubmitting(true);
            try {
                await onSubmit(store.getValues());
                return { isValid: true, errors: {} };
            } catch (err) {
                throw err;
            } finally {
                setIsSubmitting(false);
            }
        },
        [validateForm, store],
    );

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
    const reset = useCallback(
        (newValues?: Partial<FormValues<T>>) => {
            handlersCache.current.clear();
            const resetValues = newValues
                ? { ...initialValuesRef.current, ...newValues }
                : initialValuesRef.current;
            store.reset(resetValues as FormValues<T>);
            forceUpdate((n) => n + 1);
        },
        [store],
    );

    // Setters diretos
    const setValue = useCallback(
        (field: string, value: any) => {
            const finalValue = applySetter(field, value);
            store.setValue(field, finalValue);
        },
        [applySetter, store],
    );

    const setValues = useCallback(
        (newValues: Partial<FormValues<T>>) => {
            for (const key in newValues) {
                if (Object.prototype.hasOwnProperty.call(newValues, key)) {
                    const finalValue = applySetter(key, newValues[key]);
                    store.setValue(key, finalValue);
                }
            }
        },
        [applySetter, store],
    );

    const setError = useCallback(
        (field: string, error: string) => {
            store.setError(field, error);
        },
        [store],
    );

    const setErrors = useCallback(
        (newErrors: FormErrors<T>) => {
            store.setErrors(newErrors);
        },
        [store],
    );

    const clearError = useCallback(
        (field: string) => {
            store.setError(field, undefined);
        },
        [store],
    );

    const setTouched = useCallback(
        (field: string, isTouched: boolean) => {
            store.setTouched(field, isTouched);
        },
        [store],
    );

    const setApiErrors = useCallback(
        (apiError?: ApiError | null, keyMap?: Record<string, string>) => {
            if (!apiError?.errors) return;

            const out: FormErrors<T> = {};

            for (const [apiKey, value] of Object.entries(apiError.errors)) {
                const targetKey = keyMap?.[apiKey] ?? apiKey;

                // se value for array/obj → faz flatten
                if (typeof value === "object") {
                    flattenApiErrors(value, targetKey, out);
                } else if (value) {
                    out[targetKey as keyof FormErrors<T>] = String(value);
                }
            }

            store.setErrors(out);
        },
        [store],
    );

    // Array helpers
    const appendItem = useCallback(
        <I>(field: keyof T, item?: I) => {
            const currentArray = getByPath(store.getValues(), String(field)) ?? [];

            if (!Array.isArray(currentArray)) {
                console.warn(`Field "${String(field)}" is not an array`);
                return;
            }

            let newItem: any = item;

            if (newItem === undefined) {
                newItem = buildInitialItemFromFlatConfig(flatConfigRef.current, String(field));
            } else {
                // merge com template para garantir initialValue
                const template = buildInitialItemFromFlatConfig(
                    flatConfigRef.current,
                    String(field),
                );
                newItem = { ...template, ...newItem };
            }

            store.setValue(String(field), [...currentArray, newItem]);
        },
        [store],
    );

    const removeItem = useCallback(
        (field: keyof T, index: number) => {
            const currentArray = getByPath(store.getValues(), String(field));
            if (!Array.isArray(currentArray)) {
                console.warn(`Field "${String(field)}" is not an array`);
                return;
            }
            const newArray = [...currentArray];
            newArray.splice(index, 1);
            store.setValue(String(field), newArray);

            // Limpar erros relacionados
            const currentErrors = store.getErrors();
            const newErrors: FormErrors<T> = {};

            for (const key in currentErrors) {
                if (!key.startsWith(String(field) + ".")) {
                    newErrors[key as keyof FormErrors<T>] = currentErrors[key];
                    continue;
                }

                // extrai o índice do campo
                const rest = key.slice(String(field).length + 1);
                const dotIndex = rest.indexOf(".");
                const itemIndex = dotIndex === -1 ? rest : rest.slice(0, dotIndex);
                const idx = parseInt(itemIndex, 10);

                if (idx === index) {
                    continue;
                } else if (idx > index) {
                    const newKey =
                        String(field) +
                        "." +
                        (idx - 1) +
                        (dotIndex === -1 ? "" : rest.slice(dotIndex));
                    newErrors[newKey as keyof FormErrors<T>] = currentErrors[key];
                } else {
                    newErrors[key as keyof FormErrors<T>] = currentErrors[key];
                }
            }

            store.setErrors(newErrors);
        },
        [store],
    );

    const updateItem = useCallback(
        <I>(field: keyof T, index: number, item: I) => {
            const currentArray = getByPath(store.getValues(), String(field));
            if (!Array.isArray(currentArray)) {
                console.warn(`Field "${String(field)}" is not an array`);
                return;
            }
            const newArray = [...currentArray];
            newArray[index] = item;
            store.setValue(String(field), newArray);
        },
        [store],
    );

    const EMPTY_ARRAY_REF = useRef<any[]>([]);
    const getArrayField = useCallback(
        <I>(field: keyof T): I[] => {
            const value = getByPath(store.getValues(), String(field));
            return Array.isArray(value) ? value : (EMPTY_ARRAY_REF.current as I[]);
        },
        [store],
    );

    // Valores derivados usando useSyncExternalStore para re-render eficiente
    const values = useSyncExternalStore(
        (callback) => store.subscribeGlobal(callback),
        () => store.getValues(),
        () => store.getValues(),
    );

    const errors = useSyncExternalStore(
        (callback) => store.subscribeGlobal(callback),
        () => store.getErrors(),
        () => store.getErrors(),
    );

    const touched = useSyncExternalStore(
        (callback) => store.subscribeGlobal(callback),
        () => store.getTouched(),
        () => store.getTouched(),
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
        submit,
        getFieldProps,
        handleSubmit,
        reset,
        appendItem,
        removeItem,
        updateItem,
        getArrayField,
        subscribe,
        getFieldState,
        useField,
    };
}
