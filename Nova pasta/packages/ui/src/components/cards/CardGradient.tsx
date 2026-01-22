import React from 'react';
import { Panel as PrimePanel, PanelProps as PrimePanelProps } from 'primereact/panel';
import { classNames } from 'primereact/utils';


export interface PanelProps extends Omit<PrimePanelProps, 'header' | 'icons'> {
    header?: React.ReactNode;
    header_icon?: React.ReactNode;
    header_actions?: React.ReactNode;
}


interface HeaderBaseProps {
    icon?: React.ReactNode;
    title?: React.ReactNode;
    actions?: React.ReactNode;
}


export const HeaderBase = ({ icon, title, actions }: HeaderBaseProps) => {
    return (
        <div className="overflow-auto flex items-center gap-4 w-full bg-gradient-to-r from-turquoise-faded-50 to-turquoise-faded text-deep-teal font-semibold px-6 py-5 rounded-tl-2xl rounded-tr-2xl">
            {icon && (
                <span className="flex items-center text-inherit">
                    {icon}
                </span>
            )}

            <div className="flex-1 min-w-0 truncate">
                {title}
            </div>

            {actions && (
                <div className="grid grid-flow-col auto-cols-max gap-2 overflow-auto">
                    {actions}
                </div>
            )}
        </div>
    );
};



export const CardGradient = ({
    className,
    header,
    header_icon,
    header_actions,
    ...props
}: PanelProps) => {
    return (
        <PrimePanel
            {...props}
            headerTemplate={() => (
                <HeaderBase
                    icon={header_icon}
                    title={header}
                    actions={header_actions}
                />
            )}
            pt={{
                content: {
                    className:
                        '!bg-white/50 rounded-b-2xl p-6 text-input-color overflow-auto',
                },
            }}
            className={classNames(
                `
                rounded-2xl card-shadow overflow-auto
                opacity-0 -translate-x-4
                animate-card-fade-in
                `,
                className
            )}
        />
    );
};
