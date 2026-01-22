import { memo, useMemo, ReactElement, cloneElement, isValidElement, useSyncExternalStore, useCallback } from 'react';
import { classNames } from 'primereact/utils';
import type { UseFormResult, FieldProps, FieldState } from './useFormOptimized';

// ============================================================================
// TIPOS
// ============================================================================

export interface FormFieldProps<T extends Record<string, any>> {
    children: ReactElement | ((props: FieldProps) => ReactElement);
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
    form: UseFormResult<T>;
    showError?: boolean;
    className?: string;
}

// ============================================================================
// COMPONENTE INTERNO PURO - Apenas renderiza, não se preocupa com form
// ============================================================================

interface FormFieldRendererProps {
    children: ReactElement | ((props: FieldProps) => ReactElement);
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
    value: any;
    error: string | undefined;
    touched: boolean;
    hasError: boolean;
    onChange: (e: any) => void;
    onBlur: () => void;
    className?: string;
}

const FormFieldRenderer = memo(function FormFieldRenderer({
    children,
    name,
    label,
    description,
    required = false,
    value,
    error,
    touched,
    hasError,
    onChange,
    onBlur,
    className,
}: FormFieldRendererProps) {
    // Renderiza o child com props
    const renderedChild = useMemo(() => {
        const fieldProps: FieldProps = {
            value,
            onChange,
            onBlur,
            name,
            error: hasError,
        };

        // Render props pattern
        if (typeof children === 'function') {
            return children(fieldProps);
        }

        // Clone element pattern
        if (isValidElement(children)) {
            return cloneElement(children, {
                name,
                error: hasError,
                value,
                onChange,
                onBlur,
            } as any);
        }

        return children;
    }, [children, value, onChange, onBlur, name, hasError]);

    return (
        <div className={classNames('flex flex-col gap-1.5', className)}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div>{renderedChild}</div>

            {hasError ? (
                <span className="text-sm text-red-500 flex items-center gap-1">
                    <i className="pi pi-exclamation-circle text-xs" />
                    {error}
                </span>
            ) : description ? (
                <span className="text-sm text-gray-600">{description}</span>
            ) : null}
        </div>
    );
});

// ============================================================================
// COMPONENTE PRINCIPAL COM SUBSCRIPTION GRANULAR
// ============================================================================

/**
 * FormField Otimizado - Usa subscriptions granulares para evitar re-renders
 * 
 * Cada FormField agora se inscreve APENAS nas mudanças do seu campo específico,
 * evitando re-renders desnecessários quando outros campos mudam.
 * 
 * @example
 * // Com render props (recomendado)
 * <FormField name="email" label="Email" form={form}>
 *   {(props) => <InputText {...props} />}
 * </FormField>
 * 
 * @example
 * // Para campos em arrays
 * <FormField name={`items.${index}.name`} label="Nome" form={form}>
 *   {(props) => <InputText {...props} />}
 * </FormField>
 */
export function FormField<T extends Record<string, any>>({
    children,
    name,
    label,
    description,
    required = false,
    form,
    showError = true,
    className,
}: FormFieldProps<T>) {
    // 🔑 Subscription granular - só re-renderiza quando ESTE campo muda
    const fieldState = useSyncExternalStore(
        useCallback((callback) => form.subscribe(name, callback), [form, name]),
        useCallback(() => form.getFieldState(name), [form, name]),
        useCallback(() => form.getFieldState(name), [form, name])
    );

    // Handlers estáveis do cache
    const fieldProps = form.getFieldProps(name);

    const hasError = showError && fieldState.touched && !!fieldState.error;

    return (
        <FormFieldRenderer
            name={name}
            label={label}
            description={description}
            required={required}
            value={fieldState.value}
            error={fieldState.error}
            touched={fieldState.touched}
            hasError={hasError}
            onChange={fieldProps.onChange}
            onBlur={fieldProps.onBlur}
            className={className}
        >
            {children}
        </FormFieldRenderer>
    );
}

// ============================================================================
// HOOK PARA USO DIRETO EM COMPONENTES CUSTOMIZADOS
// ============================================================================

/**
 * Hook para criar campos customizados com subscription granular
 * 
 * @example
 * function CustomInput({ form, name }: { form: UseFormResult<any>; name: string }) {
 *   const { value, error, touched, onChange, onBlur } = useFormField(form, name);
 *   
 *   return (
 *     <input 
 *       value={value} 
 *       onChange={onChange} 
 *       onBlur={onBlur}
 *       className={touched && error ? 'error' : ''}
 *     />
 *   );
 * }
 */
export function useFormField<T extends Record<string, any>>(
    form: UseFormResult<T>,
    name: string
): FieldState & { onChange: (e: any) => void; onBlur: () => void } {
    // Subscription granular
    const fieldState = useSyncExternalStore(
        useCallback((callback) => form.subscribe(name, callback), [form, name]),
        useCallback(() => form.getFieldState(name), [form, name]),
        useCallback(() => form.getFieldState(name), [form, name])
    );

    const fieldProps = form.getFieldProps(name);

    return {
        ...fieldState,
        onChange: fieldProps.onChange,
        onBlur: fieldProps.onBlur,
    };
}

// ============================================================================
// HOC PARA COMPONENTES DE INPUT OTIMIZADOS
// ============================================================================

/**
 * HOC para criar campos customizados que funcionam com FormField
 */
export function withFormField<P extends object>(
    Component: React.ComponentType<P & FieldProps>
) {
    const WrappedComponent = memo((props: P & Partial<FieldProps>) => {
        return <Component {...(props as P & FieldProps)} />;
    });

    WrappedComponent.displayName = `withFormField(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
}

// ============================================================================
// COMPONENTE PARA ARRAYS COM MEMOIZAÇÃO
// ============================================================================

interface FormArrayProps<T extends Record<string, any>, I> {
    form: UseFormResult<T>;
    name: keyof T;
    children: (item: I, index: number, remove: () => void) => ReactElement;
    keyExtractor?: (item: I, index: number) => string | number;
}

/**
 * Componente otimizado para renderizar arrays de campos
 * 
 * @example
 * <FormArray form={form} name="items">
 *   {(item, index, remove) => (
 *     <div key={index}>
 *       <FormField name={`items.${index}.name`} form={form} label="Nome">
 *         {(props) => <InputText {...props} />}
 *       </FormField>
 *       <button onClick={remove}>Remover</button>
 *     </div>
 *   )}
 * </FormArray>
 */
export function FormArray<T extends Record<string, any>, I>({
    form,
    name,
    children,
    keyExtractor = (_, index) => index,
}: FormArrayProps<T, I>) {
    // Subscription para o array inteiro
    const arrayValue = useSyncExternalStore(
        useCallback((callback) => form.subscribe(String(name), callback), [form, name]),
        useCallback(() => form.getArrayField<I>(name), [form, name]),
        useCallback(() => form.getArrayField<I>(name), [form, name])
    );

    const handleRemove = useCallback((index: number) => {
        form.removeItem(name, index);
    }, [form, name]);

    return (
        <>
            {arrayValue.map((item, index) => (
                <FormArrayItem
                    key={keyExtractor(item, index)}
                    item={item}
                    index={index}
                    onRemove={handleRemove}
                >
                    {children}
                </FormArrayItem>
            ))}
        </>
    );
}

// Item individual memoizado
interface FormArrayItemProps<I> {
    item: I;
    index: number;
    children: (item: I, index: number, remove: () => void) => ReactElement;
    onRemove: (index: number) => void;
}

const FormArrayItem = memo(function FormArrayItem<I>({
    item,
    index,
    children,
    onRemove,
}: FormArrayItemProps<I>) {
    const remove = useCallback(() => onRemove(index), [onRemove, index]);
    return children(item, index, remove);
}) as <I>(props: FormArrayItemProps<I>) => ReactElement;
