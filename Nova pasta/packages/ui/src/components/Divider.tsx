import { HTMLAttributes } from "react";
import { classNames } from "primereact/utils";

export interface DividerProps extends Omit<HTMLAttributes<HTMLHRElement>, "className"> {
    orientation?: "horizontal" | "vertical";
    spacing?: "none" | "sm" | "md" | "lg";
    variant?: "solid" | "dashed" | "dotted";
    className?: string;
}

export function Divider({
    orientation = "horizontal",
    spacing = "md",
    variant = "solid",
    className,
    ...props
}: DividerProps) {
    const spacingMap = {
        horizontal: {
            none: "",
            sm: "my-2",
            md: "my-4",
            lg: "my-8",
        },
        vertical: {
            none: "",
            sm: "mx-2",
            md: "mx-4",
            lg: "mx-8",
        },
    };

    const variantMap = {
        solid: "border-solid",
        dashed: "border-dashed",
        dotted: "border-dotted",
    };

    if (orientation === "vertical") {
        return (
            <div
                className={classNames(
                    "border-l border-gray-300",
                    variantMap[variant],
                    spacingMap.vertical[spacing],
                    "self-stretch",
                    className,
                )}
                {...props}
            />
        );
    }

    return (
        <hr
            className={classNames(
                "border-t border-gray-300",
                variantMap[variant],
                spacingMap.horizontal[spacing],
                className,
            )}
            {...props}
        />
    );
}
