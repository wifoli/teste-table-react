import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from "primereact/button";
import { classNames } from "primereact/utils";

export interface ButtonProps extends Omit<PrimeButtonProps, "size"> {
    intent?: "primary" | "secondary" | "tertiary" | "success" | "danger" | "warning" | "info";
    size?: "small" | "medium" | "large";
}

export const Button = ({
    intent = "primary",
    size = "medium",
    className,
    ...props
}: ButtonProps) => {
    const intentClasses = {
        primary: "bg-deep-teal hover:bg-deep-teal-dark text-white",
        secondary: "bg-turquoise hover:bg-turquoise-dark text-white",
        tertiary: "bg-royal-purple hover:bg-royal-purple-dark text-white",
        success: "bg-leaf-green hover:bg-leaf-green-dark text-white",
        danger: "bg-red-500 hover:bg-red-700 text-white",
        warning: "bg-lime-green hover:bg-lime-green-dark text-white",
        info: "bg-neutral-500 hover:bg-neutral-600 text-white",
    };

    const sizeClasses = {
        small: "text-sm px-3 font-app py-1.5 font-medium leading-normal tracking-wide",
        medium: "text-base px-4 font-app py-2 font-medium leading-normal tracking-wide",
        large: "text-lg px-5 font-app py-3 font-medium leading-normal tracking-wide",
    };

    return (
        <PrimeButton
            {...props}
            pt={{
                label:{className:"font-medium"}
            }}
            className={classNames(
                "relative overflow-hidden transition-all duration-300 font-medium rounded-lg animate-shine transform-button font-app gap-2",
                intentClasses[intent],
                sizeClasses[size],
                className,
            )}
        />
    );
};
