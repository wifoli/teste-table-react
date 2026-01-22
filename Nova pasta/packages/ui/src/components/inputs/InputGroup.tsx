import React from 'react';
import { classNames } from 'primereact/utils';


export interface InputGroupAddonProps {
    children: React.ReactNode;
    className?: string;
}


export const InputGroupAddon = ({ children, className }: InputGroupAddonProps) => {
    return (
        <span className={
            classNames("inline-flex items-center px-3 py-2 bg-gray-100 border border-gray-300 text-gray-700 text-sm first:rounded-l-md last:rounded-r-md border-r-0 last:border-r",
                className)
        }>
            {children}
        </span>
    );
};


export interface InputGroupProps {
    children: React.ReactNode;
    startAddon?: React.ReactNode;
    endAddon?: React.ReactNode;
    fullWidth?: boolean;
    className?: string;
    label?: string;
}


type InputGroupChildProps = {
    className?: string;
    fullWidth?: boolean;
    inGroup?: boolean;
};


export const InputGroup = ({
    children,
    startAddon,
    endAddon,
    fullWidth = false,
    label,
    className,
}: InputGroupProps) => {
    const items = React.Children.toArray(children);

    return (
        <div className={classNames('flex flex-col gap-1 overflow-visible', { 'w-full': fullWidth })}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div
                className={classNames(
                    'flex items-stretch border border-gray-300 rounded-lg overflow-ellipsis',
                    { 'w-full': fullWidth },
                    className
                )}
            >
                

                {startAddon && (
                    <div className="flex items-center bg-gray-100 p-2 border-r rounded-l-lg border-gray-300">
                        {startAddon}
                    </div>
                )}

                {items.map((child, index) => {
                    if (!React.isValidElement<InputGroupChildProps>(child)) return child;

                    const isFirst = index === 0 && !startAddon;
                    const isLast = index === items.length - 1 && !endAddon;

                    return (
                        <div
                            key={index}
                            className={classNames(
                                'flex-1 min-w-0',
                                !isLast && 'border-r border-gray-300',

                                '[&_.p-inputtext]:rounded-none',
                                '[&_.p-inputnumber-input]:rounded-none',

                                isFirst && [
                                    '[&_.p-inputtext]:rounded-l-lg',
                                    '[&_.p-inputnumber-input]:rounded-l-lg',
                                ],
                                isLast && [
                                    '[&_.p-inputtext]:rounded-r-lg',
                                    '[&_.p-inputnumber-input]:rounded-r-lg',
                                ],

                                '[&_.p-inputtext]:border-0',
                                '[&_.p-inputnumber-input]:border-0',
                                '[&_.p-inputtext]:shadow-none',
                                '[&_.p-inputnumber-input]:shadow-none',
                            )}
                        >
                            {React.cloneElement<InputGroupChildProps>(child, {
                                fullWidth: true,
                                inGroup: true,
                            })}
                        </div>
                    );
                })}

                {endAddon && (
                    <div className="flex items-center bg-gray-100 p-2 border-l rounded-r-lg border-gray-300">
                        {endAddon}
                    </div>
                )}
            </div>
        </div>
    );
};


