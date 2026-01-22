import { ReactNode, HTMLAttributes } from "react";
import { classNames } from "primereact/utils";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "className"> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
    size?: "sm" | "md" | "lg";
    rounded?: boolean;
    dot?: boolean;
    className?: string;
}

export function Badge({
    children,
    variant = "primary",
    size = "md",
    rounded = false,
    dot = false,
    className,
    ...props
}: BadgeProps) {
    const variantClasses = {
        primary: "bg-blue-100 text-blue-800 border-blue-200",
        secondary: "bg-gray-100 text-gray-800 border-gray-200",
        success: "bg-green-100 text-green-800 border-green-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        info: "bg-cyan-100 text-cyan-800 border-cyan-200",
    };

    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-3 py-1",
    };

    if (dot) {
        return (
            <span className={classNames("inline-flex items-center gap-1.5", className)} {...props}>
                <span className={classNames("w-2 h-2 rounded-full", variantClasses[variant])} />
                {children}
            </span>
        );
    }

    return (
        <span
            className={classNames(
                "inline-flex items-center font-medium border",
                variantClasses[variant],
                sizeClasses[size],
                rounded ? "rounded-full" : "rounded",
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
