import { HTMLAttributes } from "react";
import { classNames } from "primereact/utils";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
    variant?: "text" | "circular" | "rectangular" | "rounded";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "wave" | "none";
    className?: string;
}

export function Skeleton({
    variant = "text",
    width,
    height,
    animation = "pulse",
    className,
    style,
    ...props
}: SkeletonProps) {
    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-none",
        rounded: "rounded-lg",
    };

    const animationClasses = {
        pulse: "animate-pulse",
        wave: "animate-pulse",
        none: "",
    };

    const defaultHeights = {
        text: "1rem",
        circular: "40px",
        rectangular: "100px",
        rounded: "100px",
    };

    const computedStyle = {
        width: width || (variant === "circular" ? defaultHeights[variant] : "100%"),
        height: height || defaultHeights[variant],
        ...style,
    };

    return (
        <div
            className={classNames(
                "bg-gray-200",
                variantClasses[variant],
                animationClasses[animation],
                className,
            )}
            style={computedStyle}
            {...props}
        />
    );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} variant="text" width={i === lines - 1 ? "80%" : "100%"} />
            ))}
        </div>
    );
}
