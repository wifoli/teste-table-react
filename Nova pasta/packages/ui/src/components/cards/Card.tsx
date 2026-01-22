import { Card as PrimeCard, Card as PrimeCardFocus, CardProps as PrimeCardProps, CardProps as PrimeCardFocusProps } from "primereact/card";
import { classNames } from "primereact/utils";


export interface CardProps extends PrimeCardFocusProps {
    variant?: "turquoise" | "leafGreen" | "deepTeal";
}

export const Card = ({ className, ...props }: PrimeCardProps) => {
    return (
        <PrimeCard
            {...props}
            className={classNames(
                `
                bg-white rounded-2xl card-shadow border-[0.5px] text-input-color
                h-full max-h-full
                opacity-0 -translate-x-4
                animate-card-fade-in
                `,
                className
            )}
            pt = {{
                root: { className: "p-6" },
                content: { className: "p-0" },
                body: { className: "p-0" }
            }}
        />
    );
};


export const CardFocus = ({
    variant = "turquoise",
    className,
    ...props
}: PrimeCardFocusProps & { variant?: "turquoise" | "leafGreen" | "deepTeal" }) => {

    const colorClasses = {
        turquoise: "bg-gradient-to-r from-white to-turquoise-faded-10 border-turquoise",
        leafGreen: "bg-gradient-to-r from-white to-leaf-green-faded-10 border-leaf-green",
        deepTeal: "bg-gradient-to-r from-white to-deep-teal-faded-10 border-deep-teal"
    };

    return (
        <PrimeCardFocus
            {...props}
            className={classNames(
                `
                rounded-2xl card-shadow border-[0.5px] text-input-color
                h-full max-h-full
                opacity-0 -translate-x-4
                animate-card-fade-in
                `,
                colorClasses[variant],
                className
            )}
            pt={{
                root: { className: "p-6" },
                content: { className: "p-0" },
                body: { className: "p-0" }
            }}
        />
    );
};
