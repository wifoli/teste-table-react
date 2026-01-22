import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from "primereact/button";
import { classNames } from "primereact/utils";

export interface ButtonGradientProps extends Omit<PrimeButtonProps, "size"> {
    intent?: "primary" | "secondary" | "tertiary" | "quaternary";
    size?: "small" | "medium" | "large";
}

export const ButtonGradient = ({
    intent = "primary",
    size = "medium",
    className,
    ...props
}: ButtonGradientProps) => {
    const intentClasses = {
        primary: "bg-gradient-to-r from-turquoise to-deep-teal hover:from-turquoise-dark hover:to-deep-teal-dark text-white",
        secondary: "bg-gradient-to-r from-turquoise to-royal-purple hover:from-turquoise-dark hover:to-royal-purple-dark text-white",
        tertiary: "bg-gradient-to-r from-lime-green to-leaf-green hover:from-lime-green-dark hover:to-leaf-green-dark text-input-color",
        quaternary: "bg-gradient-to-r from-deep-teal to-turquoise hover:from-deep-teal-dark hover:to-turquoise-dark text-white",
    };

    const sizeClasses = {
        small: "text-sm font-app px-3 py-1.5 font-medium leading-normal tracking-wide",
        medium: "text-base font-app px-4 py-2 font-medium leading-normal tracking-wide",
        large: "text-lg font-app px-5 py-3 font-medium leading-normal tracking-wide",
    };

    return (
        <PrimeButton
            {...props}
            pt={{
                label:{className:"font-medium"}
            }}
            className={classNames(
                "relative overflow-hidden transition-all duration-300 font-medium rounded-lg gap-2 animate-shine transform-button font-app",
                intentClasses[intent],
                sizeClasses[size],
                className,
            )}
        />
    );
};
