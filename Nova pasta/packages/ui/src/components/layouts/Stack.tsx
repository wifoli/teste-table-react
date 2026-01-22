import { ReactNode, HTMLAttributes } from "react";
import { classNames } from "primereact/utils";

export interface StackProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
    children: ReactNode;
    direction?: "row" | "column";
    spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    wrap?: boolean;
    className?: string;
}

export function Stack({
    children,
    direction = "column",
    spacing = 4,
    align,
    justify,
    wrap = false,
    className,
    ...props
}: StackProps) {
    const spacingMap = {
        0: "gap-0",
        1: "gap-1",
        2: "gap-2",
        3: "gap-3",
        4: "gap-4",
        5: "gap-5",
        6: "gap-6",
        8: "gap-8",
        10: "gap-10",
        12: "gap-12",
    };

    const alignMap = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
    };

    const justifyMap = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
    };

    return (
        <div
            className={classNames(
                "flex",
                direction === "row" ? "flex-row" : "flex-col",
                spacingMap[spacing],
                align && alignMap[align],
                justify && justifyMap[justify],
                wrap && "flex-wrap",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Convenience components
export function HStack(props: Omit<StackProps, "direction">) {
    return <Stack direction="row" {...props} />;
}

export function VStack(props: Omit<StackProps, "direction">) {
    return <Stack direction="column" {...props} />;
}
