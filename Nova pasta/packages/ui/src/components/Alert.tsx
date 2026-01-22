import { ReactNode, HTMLAttributes } from "react";
import { classNames } from "primereact/utils";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
    children: ReactNode;
    severity?: "info" | "success" | "warning" | "error";
    variant?: "filled" | "outlined" | "soft";
    icon?: string | boolean;
    title?: string;
    onClose?: () => void;
    className?: string;
}

export function Alert({
    children,
    severity = "info",
    variant = "soft",
    icon,
    title,
    onClose,
    className,
    ...props
}: AlertProps) {
    const defaultIcons = {
        info: "pi pi-info-circle",
        success: "pi pi-check-circle",
        warning: "pi pi-exclamation-triangle",
        error: "pi pi-times-circle",
    };

    const severityClasses = {
        filled: {
            info: "bg-blue-600 text-white border-blue-600",
            success: "bg-green-600 text-white border-green-600",
            warning: "bg-yellow-600 text-white border-yellow-600",
            error: "bg-red-600 text-white border-red-600",
        },
        outlined: {
            info: "bg-white text-blue-700 border-blue-300",
            success: "bg-white text-green-700 border-green-300",
            warning: "bg-white text-yellow-700 border-yellow-300",
            error: "bg-white text-red-700 border-red-300",
        },
        soft: {
            info: "bg-blue-50 text-blue-800 border-blue-200",
            success: "bg-green-50 text-green-800 border-green-200",
            warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
            error: "bg-red-50 text-red-800 border-red-200",
        },
    };

    const iconToShow =
        icon === false ? null : typeof icon === "string" ? icon : defaultIcons[severity];

    return (
        <div
            className={classNames(
                "rounded-lg border p-4",
                severityClasses[variant][severity],
                className,
            )}
            role="alert"
            {...props}
        >
            <div className="flex gap-3">
                {iconToShow && <i className={`${iconToShow} text-xl flex-shrink-0`}></i>}

                <div className="flex-1">
                    {title && <h5 className="font-semibold mb-1">{title}</h5>}
                    <div>{children}</div>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 ml-auto -mr-1 -mt-1 p-1 hover:opacity-75 transition-opacity"
                        aria-label="Close"
                    >
                        <i className="pi pi-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
}
