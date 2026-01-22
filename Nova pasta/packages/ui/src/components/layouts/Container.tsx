import { ReactNode, HTMLAttributes } from "react";
import { classNames } from "primereact/utils";

export interface ContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
    padding?: boolean;
    centered?: boolean;
    className?: string;
}


export function Container({
    children,
    maxWidth = "lg",
    padding = true,
    centered = true,
    className,
    ...props
}: ContainerProps) {
    const maxWidthMap = {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        "3xl": "max-w-screen-3xl",
        full: "max-w-full",
    };

    return (
        <div
            className={classNames(
                `
                w-full bg-white rounded-2xl card-shadow border-[0.5px] text-input-color
                opacity-0 -translate-x-4
                animate-card-fade-in
                `,
                maxWidthMap[maxWidth],
                centered && "mx-auto",
                padding && "p-4 sm:p-6 lg:p-8",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

