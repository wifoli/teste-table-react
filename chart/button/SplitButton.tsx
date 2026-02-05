import React, { memo, useCallback, useMemo, useRef } from "react";
import {
    SplitButton as PrimeSplitButton,
    SplitButtonProps as PrimeSplitButtonProps,
} from "primereact/splitbutton";
import { classNames } from "primereact/utils";
import type { MenuItem } from "primereact/menuitem";

// ============================================================================
// TYPES
// ============================================================================

export interface SplitButtonItem {
    /** Identificador único */
    id?: string;
    /** Label do item */
    label: string;
    /** Ícone PrimeIcons */
    icon?: string;
    /** Callback ao clicar */
    onClick?: () => void;
    /** Desabilita o item */
    disabled?: boolean;
    /** Separador antes deste item */
    separator?: boolean;
    /** Classe CSS adicional */
    className?: string;
    /** Item de perigo (vermelho) */
    danger?: boolean;
    /** Dados customizados */
    data?: unknown;
}

export interface SplitButtonProps
    extends Omit<PrimeSplitButtonProps, "model" | "onClick" | "label" | "icon"> {
    /** Label do botão principal */
    label: string;

    /** Ícone do botão principal */
    icon?: string;

    /** Items do dropdown */
    items: SplitButtonItem[];

    /** Callback do botão principal */
    onClick?: () => void;

    /** Variante visual */
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "help";

    /** Estilo outlined */
    outlined?: boolean;

    /** Estilo text */
    text?: boolean;

    /** Estilo raised */
    raised?: boolean;

    /** Estilo rounded */
    rounded?: boolean;

    /** Tamanho */
    size?: "small" | "normal" | "large";

    /** Desabilita botão principal */
    disabled?: boolean;

    /** Desabilita dropdown */
    dropdownDisabled?: boolean;

    /** Loading state */
    loading?: boolean;

    /** Ícone de loading */
    loadingIcon?: string;

    /** Classes adicionais */
    className?: string;

    /** Classes para o botão */
    buttonClassName?: string;

    /** Classes para o dropdown */
    menuButtonClassName?: string;

    /** Posição do dropdown */
    dropdownPosition?: "left" | "right";
}

// ============================================================================
// HELPERS
// ============================================================================

const variantSeverity: Record<
    NonNullable<SplitButtonProps["variant"]>,
    PrimeSplitButtonProps["severity"]
> = {
    primary: undefined, // default
    secondary: "secondary",
    success: "success",
    warning: "warning",
    danger: "danger",
    info: "info",
    help: "help",
};

// ============================================================================
// COMPONENT
// ============================================================================

function SplitButtonComponent({
    label,
    icon,
    items,
    onClick,
    variant = "primary",
    outlined = false,
    text = false,
    raised = false,
    rounded = false,
    size = "normal",
    disabled = false,
    dropdownDisabled = false,
    loading = false,
    loadingIcon = "pi pi-spinner pi-spin",
    className,
    buttonClassName,
    menuButtonClassName,
    dropdownPosition = "right",
    ...restProps
}: SplitButtonProps) {
    // Refs para handlers estáveis
    const onClickRef = useRef(onClick);
    onClickRef.current = onClick;

    const itemsRef = useRef(items);
    itemsRef.current = items;

    // Handler principal estável
    const handleClick = useCallback(() => {
        onClickRef.current?.();
    }, []);

    // Transforma items para MenuItem do PrimeReact
    const model = useMemo<MenuItem[]>(() => {
        const result: MenuItem[] = [];

        items.forEach((item) => {
            if (item.separator) {
                result.push({ separator: true });
            }

            result.push({
                label: item.label,
                icon: item.icon,
                disabled: item.disabled,
                className: classNames(item.className, {
                    "text-red-600": item.danger,
                }),
                command: item.onClick,
            });
        });

        return result;
    }, [items]);

    // Classes computadas
    const containerClass = useMemo(
        () =>
            classNames("split-button", className, {
                "p-button-sm": size === "small",
                "p-button-lg": size === "large",
            }),
        [className, size]
    );

    // Props condicionais
    const conditionalProps = useMemo(() => {
        const props: Partial<PrimeSplitButtonProps> = {};

        if (outlined) props.outlined = true;
        if (text) props.text = true;
        if (raised) props.raised = true;
        if (rounded) props.rounded = true;

        return props;
    }, [outlined, text, raised, rounded]);

    return (
        <PrimeSplitButton
            label={label}
            icon={loading ? loadingIcon : icon}
            model={model}
            onClick={handleClick}
            severity={variantSeverity[variant]}
            disabled={disabled || loading}
            className={containerClass}
            buttonClassName={buttonClassName}
            menuButtonClassName={menuButtonClassName}
            menuButtonDisabled={dropdownDisabled}
            dropdownIcon="pi pi-chevron-down"
            {...conditionalProps}
            {...restProps}
        />
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const SplitButton = memo(SplitButtonComponent);
SplitButton.displayName = "SplitButton";
