import { memo, useMemo, ReactElement, cloneElement, isValidElement } from 'react';
import { classNames } from 'primereact/utils';
import type { UseFormResult, FieldProps } from '../hooks';

export interface FormFieldProps<T extends Record<string, any>> {
    children: ReactElement | ((props: FieldProps) => ReactElement);
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
    form?: UseFormResult<T>;
    showError?: boolean;
    className?: string;
}

interface FormFieldInnerProps {
    children: ReactElement | ((props: FieldProps) => ReactElement);
    name: string;
    label?: string;
    description?: string;
    required?: boolean;
    fieldProps?: FieldProps;
    error?: string;
    hasError: boolean;
    className?: string;
}

/**
 * Componente interno memoizado
 */
const FormFieldInner = memo(function FormFieldInner({
    children,
    name,
    label,
    description,
    required = false,
    fieldProps,
    error,
    hasError,
    className,
}: FormFieldInnerProps) {
    // Renderiza o child com props
    const renderedChild = useMemo(() => {
        // Render props pattern
        if (typeof children === 'function') {
            if (!fieldProps) {
                // Se não tem form, criar props básicas
                const basicProps: FieldProps = {
                    value: '',
                    onChange: () => {},
                    onBlur: () => {},
                    name,
                    error: hasError,
                };
                return children(basicProps);
            }
            return children(fieldProps);
        }

        // Clone element pattern
        if (isValidElement(children)) {
            const extraProps: Record<string, any> = {
                name,
                error: hasError,
            };

            if (fieldProps) {
                extraProps.value = fieldProps.value;
                extraProps.onChange = fieldProps.onChange;
                extraProps.onBlur = fieldProps.onBlur;
            }

            return cloneElement(children, extraProps);
        }

        return children;
    }, [children, fieldProps, name, hasError]);

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

/**
 * FormField - Wrapper inteligente para campos de formulário
 *
 * Adiciona automaticamente:
 * - Label com indicador de obrigatório
 * - Descrição/helper text
 * - Mensagem de erro (integrado com useForm)
 * - Estados de erro visual
 *
 * @example
 * // Com cloneElement (compatível com versão anterior)
 * <FormField name="email" label="Email" form={form}>
 *   <InputText />
 * </FormField>
 *
 * @example
 * // Com render props (recomendado para melhor performance)
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
    // Obtém props do campo através do form
    const fieldProps = form?.getFieldProps(name);
    const error = form?.errors[name];
    const touched = form?.touched[name];
    const hasError = showError && !!touched && !!error;

    return (
        <FormFieldInner
            name={name}
            label={label}
            description={description}
            required={required}
            fieldProps={fieldProps}
            error={error}
            hasError={hasError}
            className={className}
        >
            {children}
        </FormFieldInner>
    );
}

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