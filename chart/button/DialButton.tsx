import React, { memo, useCallback, useMemo, useRef } from "react";
import { SpeedDial, SpeedDialProps } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import type { MenuItem } from "primereact/menuitem";

// ============================================================================
// TYPES
// ============================================================================

export interface DialButtonItem {
    /** Identificador único do item */
    id?: string;
    /** Label exibido no tooltip */
    label: string;
    /** Ícone PrimeIcons (ex: "pi pi-pencil") */
    icon: string;
    /** Callback quando o item é clicado */
    onClick?: () => void;
    /** Desabilita o item */
    disabled?: boolean;
    /** Classe CSS adicional */
    className?: string;
    /** Se true, item aparece com destaque (danger) */
    danger?: boolean;
    /** Dados customizados */
    data?: unknown;
}

export interface DialButtonProps
    extends Omit<
        SpeedDialProps,
        "model" | "onClick" | "onShow" | "onHide" | "showIcon" | "hideIcon"
    > {
    /** Items do menu */
    items: DialButtonItem[];

    /** Ícone quando fechado */
    icon?: string;

    /** Ícone quando aberto */
    activeIcon?: string;

    /** Direção de abertura */
    direction?: "up" | "down" | "left" | "right" | "up-left" | "up-right" | "down-left" | "down-right";

    /** Tipo visual do botão */
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";

    /** Tamanho do botão */
    size?: "small" | "normal" | "large";

    /** Mostra tooltip nos items */
    showTooltip?: boolean;

    /** Posição do tooltip */
    tooltipPosition?: "top" | "bottom" | "left" | "right";

    /** Callback quando abre */
    onOpen?: () => void;

    /** Callback quando fecha */
    onClose?: () => void;

    /** Desabilita todo o componente */
    disabled?: boolean;

    /** Classes adicionais para o container */
    className?: string;

    /** Estilo inline para o container */
    style?: React.CSSProperties;
}

// ============================================================================
// HELPERS
// ============================================================================

const variantClasses: Record<NonNullable<DialButtonProps["variant"]>, string> = {
    primary: "p-button-primary",
    secondary: "p-button-secondary",
    success: "p-button-success",
    warning: "p-button-warning",
    danger: "p-button-danger",
    info: "p-button-info",
};

const sizeClasses: Record<NonNullable<DialButtonProps["size"]>, string> = {
    small: "p-speeddial-sm",
    normal: "",
    large: "p-speeddial-lg",
};

// ============================================================================
// COMPONENT
// ============================================================================

function DialButtonComponent({
    items,
    icon = "pi pi-plus",
    activeIcon = "pi pi-times",
    direction = "up",
    variant = "primary",
    size = "normal",
    showTooltip = true,
    tooltipPosition = "left",
    onOpen,
    onClose,
    disabled = false,
    className,
    style,
    ...restProps
}: DialButtonProps) {
    // Refs para estabilidade
    const itemsRef = useRef(items);
    itemsRef.current = items;

    const callbacksRef = useRef({ onOpen, onClose });
    callbacksRef.current = { onOpen, onClose };

    // Unique ID para tooltips
    const tooltipId = useMemo(() => `dial-${Math.random().toString(36).substr(2, 9)}`, []);

    // Transforma items para formato do PrimeReact
    const model = useMemo<MenuItem[]>(() => {
        return items.map((item, index) => ({
            label: item.label,
            icon: item.icon,
            disabled: item.disabled,
            className: classNames(item.className, {
                "p-button-danger": item.danger,
            }),
            command: item.onClick,
            template: showTooltip
                ? (menuItem: MenuItem, options: { onClick: (e: React.MouseEvent) => void }) => (
                      <button
                          type="button"
                          className={classNames(
                              options.className,
                              "p-speeddial-action p-link",
                              item.className,
                              {
                                  "p-button-danger": item.danger,
                                  "p-disabled": item.disabled,
                              }
                          )}
                          onClick={options.onClick}
                          disabled={item.disabled}
                          data-pr-tooltip={item.label}
                          data-pr-position={tooltipPosition}
                          data-tooltip-id={tooltipId}
                      >
                          <i className={item.icon} />
                      </button>
                  )
                : undefined,
        }));
    }, [items, showTooltip, tooltipPosition, tooltipId]);

    // Handlers estáveis
    const handleShow = useCallback(() => {
        callbacksRef.current.onOpen?.();
    }, []);

    const handleHide = useCallback(() => {
        callbacksRef.current.onClose?.();
    }, []);

    // Classes computadas
    const containerClass = useMemo(
        () =>
            classNames(
                "dial-button",
                sizeClasses[size],
                className
            ),
        [size, className]
    );

    const buttonClass = useMemo(
        () => classNames(variantClasses[variant]),
        [variant]
    );

    return (
        <>
            <SpeedDial
                model={model}
                direction={direction}
                showIcon={icon}
                hideIcon={activeIcon}
                className={containerClass}
                buttonClassName={buttonClass}
                style={style}
                disabled={disabled}
                onShow={handleShow}
                onHide={handleHide}
                transitionDelay={40}
                {...restProps}
            />
            {showTooltip && (
                <Tooltip
                    target={`[data-tooltip-id="${tooltipId}"]`}
                    position={tooltipPosition}
                    showDelay={200}
                />
            )}
        </>
    );
}

// ============================================================================
// EXPORT
// ============================================================================

export const DialButton = memo(DialButtonComponent);
DialButton.displayName = "DialButton";
