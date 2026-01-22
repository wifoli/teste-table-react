import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from "primereact/button";
import { classNames } from "primereact/utils";

export interface OutlinedButtonProps extends Omit<PrimeButtonProps, "size"> {
    intent?: "primary" | "secondary" | "tertiary" | "success" | "danger" | "warning" | "info";
    size?: "small" | "medium" | "large";
}

export const OutlinedButton = ({
    intent = "primary",
    size = "medium",
    className,
    ...props
}: OutlinedButtonProps) => {
    const intent_classes = {
        primary:
            "border-deep-teal text-deep-teal hover:bg-deep-teal hover:text-white hover:border-deep-teal",
        secondary:
            "border-turquoise text-turquoise hover:bg-turquoise hover:text-white hover:border-turquoise",
        tertiary:
            "border-royal-purple text-royal-purple hover:bg-royal-purple hover:text-white hover:border-royal-purple",
        success:
            "border-leaf-green text-leaf-green hover:bg-leaf-green hover:text-white hover:border-leaf-green",
        danger: "border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500",
        warning:
            "border-lime-green text-lime-green hover:bg-lime-green-dark hover:text-white hover:border-lime-green",
        info: "border-neutral-500 text-neutral-500 hover:bg-neutral-500 hover:text-white hover:border-neutral-500",
    };

    const size_classes = {
        small: "text-sm px-3 py-1.5 font-medium leading-normal tracking-wide",
        medium: "text-base px-4 py-2 font-medium leading-normal tracking-wide",
        large: "text-lg px-5 py-3 font-medium leading-normal tracking-wide",
    };

    return (
        <PrimeButton
            {...props}
            pt={{
                label: { className: "font-medium" }
            }}
            className={classNames(
                `
                bg-transparent
                relative overflow-hidden
                transition-all duration-300
                font-medium rounded-lg border
                animate-shine
                transform-button
                gap-2
                font-app
                `,
                intent_classes[intent],
                size_classes[size],
                className,
            )}
        />
    );
};
