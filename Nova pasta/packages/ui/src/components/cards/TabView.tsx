import {
    TabView as PrimeTabView,
    TabViewProps as PrimeTabViewProps,
    TabPanelPassThroughMethodOptions,
    TabPanelProps
} from "primereact/tabview";
import { classNames } from "primereact/utils";
import React from "react";


const cloneTabPanel = (child: React.ReactElement<TabPanelProps>, index: number) =>
    React.cloneElement<TabPanelProps>(child, {
        className: "!bg-transparent",
        pt: {
            root: { className: "!bg-transparent" },
            headerAction: ({ parent, context }: TabPanelPassThroughMethodOptions) => ({
                className:
                    parent.state.activeIndex === context.index
                        ? "!bg-transparent text-turquoise"
                        : "!bg-transparent text-deep-teal hover:text-turquoise"
            })
        },
        key: index
    });

export const TabView = ({ className, ...props }: PrimeTabViewProps) => {
    return (
        <PrimeTabView
            {...props}
            className={classNames(
                `
                opacity-0 -translate-x-4
                animate-card-fade-in
                `,
                className
            )}
            pt={{
                root: { className: "overflow-hidden p-0" },
                nav: { className: "bg-transparent" },
                navContainer: { className: "relative" },
                inkbar: {
                    className:
                        "absolute block bottom-0 bg-turquoise h-1 rounded-full transition-all duration-300"
                },
                tab: { className: "px-4 py-2 rounded-lg transition-all cursor-pointer" },
                panelContainer: { className: "bg-transparent p-0 pt-4" }
            }}
        >
            {React.Children.map(
                props.children,
                (child, index) => cloneTabPanel(child as React.ReactElement<TabPanelProps>, index)
            )}
        </PrimeTabView>
    );
};

