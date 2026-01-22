import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from "primereact/button";
import { classNames } from "primereact/utils";

export interface GhostButtonProps extends Omit<PrimeButtonProps, "size"> {
    intent?: "primary" | "secondary" | "tertiary" | "success" | "danger" | "warning" | "info";
    size?: "small" | "medium" | "large";
    gap?: 0 | 1 | 2 | 3;
}

export const GhostButton = ({
    intent = "primary",
    size = "medium",
    gap = 2,
    className,
    ...props
}: GhostButtonProps) => {
    const intent_classes = {
        primary:
            "text-deep-teal hover:bg-deep-teal/10 active:bg-deep-teal/20",
        secondary:
            "text-turquoise hover:bg-turquoise/10 active:bg-turquoise/20",
        tertiary:
            "text-royal-purple hover:bg-royal-purple/10 active:bg-royal-purple/20",
        success:
            "text-leaf-green hover:bg-leaf-green/10 active:bg-leaf-green/20",
        danger:
            "text-red-500 hover:bg-red-500/10 active:bg-red-500/20",
        warning:
            "text-lime-green hover:bg-lime-green/10 active:bg-lime-green/20",
        info:
            "text-neutral-500 hover:bg-neutral-500/10 active:bg-neutral-500/20",
    };

    const size_classes = {
        small: "text-sm px-3 py-1.5 font-medium leading-normal tracking-wide",
        medium: "text-base px-4 py-2 font-medium leading-normal tracking-wide",
        large: "text-lg px-5 py-3 font-medium leading-normal tracking-wide",
    };

    const gap_classes = {
        0: "gap-0",
        1: "gap-1",
        2: "gap-2",
        3: "gap-3"
    };

    return (
        <PrimeButton
        {...props}
        onClick={(e) => {
            (e.currentTarget as HTMLButtonElement).blur();
            props.onClick?.(e);
        }}
        pt={{
            label:{className:"font-medium"}
        }}
        className={classNames(
            `
            bg-transparent
            border-none
            shadow-none

            relative overflow-hidden
            transition-all duration-300

            rounded-lg
            transform-button
            font-app
            
            focus:outline-none
            focus:ring-0
            focus-visible:ring-2
            focus-visible:ring-current/30

            disabled:opacity-40
            disabled:cursor-not-allowed
            `,
            intent_classes[intent],
            size_classes[size],
            gap_classes[gap],
            className
        )}
        />
    );
};
