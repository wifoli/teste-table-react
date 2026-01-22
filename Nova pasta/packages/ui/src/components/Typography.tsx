import { ReactNode, ElementType, HTMLAttributes } from "react";
import { classNames } from "primereact/utils";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type BodyVariant = "body" | "caption" | "title" | "small-data" | "data" | "big-data" | "bigger-data";
type Variant = HeadingLevel | BodyVariant;

export interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, "className"> {
    variant?: Variant;
    as?: ElementType;
    children: ReactNode;
    className?: string;
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: "primary" | "secondary" | "muted" | "error" | "success" | "warning";
    align?: "left" | "center" | "right" | "justify";
    transform?: "none" | "uppercase" | "lowercase" | "capitalize";
    truncate?: boolean;
    gutterBottom?: boolean;
}

export function Typography({
    variant = "body",
    as,
    children,
    className,
    weight,
    color,
    align,
    transform,
    truncate = false,
    gutterBottom = false,
    ...props
}: TypographyProps) {
    const defaultElementMap: Record<Variant, ElementType> = {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        body: "p",
        caption: "p",
        title: "p",
        "small-data": "p",
        data: "p",
        "big-data": "p",
        "bigger-data": "p",
    };

    const Component = as || defaultElementMap[variant];

    const variantClasses: Record<Variant, string> = {
        h1: "m-0 mb-1 text-input-color font-semibold text-2xl text-inherit",
        h2: "m-0 mb-1 text-subtitle-color font-bold text-base text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
        h3: "m-0 mb-1 text-subtitle-color font-bold text-xs text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
        h4: "m-0 text-input-color font-bold text-base text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
        body: "m-0 text-input-color font-medium text-sm text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
        caption: "m-0 text-help-text-color font-medium text-xs text-inherit",
        title: "m-0 text-subtitle-color font-medium text-xs text-inherit",
        "small-data": "my-2 text-input-color min-w-0 font-medium text-lg text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
        data: "my-2 text-input-color font-medium text-xl min-w-0 text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
        "big-data": "my-2 text-input-color font-medium text-2xl min-w-0 text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
        "bigger-data": "my-2 text-input-color min-w-0 font-medium text-3xl text-inherit whitespace-nowrap overflow-hidden text-ellipsis",
    };

    const weightClasses = weight
        ? {
              normal: "font-normal",
              medium: "font-medium",
              semibold: "font-semibold",
              bold: "font-bold",
          }[weight]
        : "";

    const colorClasses = color
        ? {
              primary: "text-primary",
              secondary: "text-secondary",
              muted: "text-muted",
              error: "text-error",
              success: "text-success",
              warning: "text-warning",
          }[color]
        : "text-muted";

    const alignMap: Record<NonNullable<TypographyProps["align"]>, string> = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
    };

    type TransformKey = Exclude<TypographyProps["transform"], undefined | "none">;
    const transformMap: Record<TransformKey, string> = {
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
    };

    const alignClasses = align ? alignMap[align] : "";

    const transformClasses = transform && transform !== "none" ? transformMap[transform] : "";

    return (
        <Component
            className={classNames(
                variantClasses[variant],
                weightClasses,
                colorClasses,
                alignClasses,
                transformClasses,
                {
                    truncate: truncate,
                    "mb-4": gutterBottom,
                },
                className,
            )}
            {...props}
        >
            {children}
        </Component>
    );
}

export function Heading1(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="h1" {...props} />;
}

export function Heading2(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="h2" {...props} />;
}

export function Heading3(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="h3" {...props} />;
}

export function Heading4(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="h4" {...props} />;
}

export function Body(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="body" {...props} />;
}

export function Caption(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="caption" {...props} />;
}

export function Title(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="title" {...props} />;
}

export function SmallData(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="small-data" {...props} />;
}

export function Data(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="data" {...props} />;
}

export function BigData(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="big-data" {...props} />;
}

export function BiggerData(props: Omit<TypographyProps, "variant">) {
    return <Typography variant="bigger-data" {...props} />;
}