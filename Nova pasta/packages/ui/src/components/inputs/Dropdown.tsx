import { Dropdown as PrimeDropdown, DropdownProps as PrimeDropdownProps } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import React from 'react';
import { ReactElement, ReactNode } from 'react';

export interface DropdownOption {
    label: string;
    value: any;
    icon?: string;
    disabled?: boolean;
}

export interface DropdownProps extends Omit<PrimeDropdownProps, 'onChange' | 'options'> {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    inGroup?: boolean;
    options: DropdownOption[];
    onChange?: (value: any) => void;
    searchable?: boolean;
}

export const Dropdown = ({
    fullWidth = false,
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    startAddon,
    endAddon,
    onChange,
    searchable = false,
    filter = searchable,
    options,
    inGroup = false,
    placeholder = 'Selecione...',
    emptyMessage = 'Nenhum resultado encontrado',
    emptyFilterMessage = 'Nenhum resultado encontrado',
    ...props
}: DropdownProps) => {
    const inputId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.value);
        }
    };

    const renderAddon = (addon?: ReactNode, position: 'start' | 'end' = 'start') => {
        if (!addon) return null;

        const baseClasses = classNames(
            'flex items-center justify-center bg-gray-100 text-gray-700 p-2 h-full',
            {
                'rounded-l-lg border-r border-gray-300': position === 'start',
                'rounded-r-lg border-l border-gray-300': position === 'end',
            }
        );

        if (React.isValidElement(addon)) {
            return (
                <span className={baseClasses}>
                    {React.cloneElement(addon as ReactElement<any>, {
                        className: classNames(
                            (addon as ReactElement<any>).props.className
                        ),
                    })}
                </span>
            );
        }

        return <span className={baseClasses}>{addon}</span>;
    };

    const dropdownElement = (
        <PrimeDropdown
            inputId={inputId}
            options={options}
            onChange={handleChange}
            filter={filter}
            placeholder={placeholder}
            emptyMessage={emptyMessage}
            emptyFilterMessage={emptyFilterMessage}
            className={classNames(
                'transition-colors duration-200 *:overflow-ellipsis flex-1 min-w-0 outline-none border-0',
                {
                    'w-full': fullWidth,
                    'border-red-500': error,
                },
                className
            )}
            panelClassName="shadow-lg border border-gray-200"
            pt={{
                root: {
                    className: 'ring-0',
                },
                input: {
                    className: 'px-3 py-2 transition-colors duration-150 ease-out rounded-lg'
                },
                item: {
                    className: `
                        hover:bg-turquoise-faded-10 hover:text-turquoise
                        [&.p-highlight]:bg-turquoise-faded-10
                        [&.p-highlight]:text-turquoise
                        [&.p-focus]:bg-turquoise-faded-10
                    `
                }
            }}
            {...props}
        />
    );

    return (
        <div className={classNames('flex flex-col gap-1', { 'w-full': fullWidth })}>
            {label && (
                <label 
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div
                className={classNames(
                    'flex items-stretch min-w-0 transition-colors w-full overflow-ellipsis',
                    !inGroup && 'border border-gray-300 rounded-lg',
                    {
                        'w-full': fullWidth,
                        'border-red-500 ring-1 ring-red-500': error,
                        'border-gray-300': !error,
                    }
                )}
            >
                {renderAddon(startAddon, 'start')}
                {dropdownElement}
                {renderAddon(endAddon, 'end')}
            </div>

            {helperText && (
                <span className={classNames('text-sm', {
                    'text-red-500': error,
                    'text-gray-600': !error
                })}>
                    {helperText}
                </span>
            )}
        </div>
    );
};
