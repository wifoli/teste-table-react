import { MultiSelect as PrimeMultiSelect, MultiSelectProps as PrimeMultiSelectProps } from 'primereact/multiselect';
import { classNames } from 'primereact/utils';
import React, { ReactElement, ReactNode } from 'react';

export interface MultiSelectOption {
    label: string;
    value: any;
    icon?: string;
    disabled?: boolean;
}

export interface MultiSelectProps extends Omit<PrimeMultiSelectProps, 'onChange' | 'options'> {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    inGroup?: boolean;
    options: MultiSelectOption[];
    onChange?: (values: any[]) => void;
    searchable?: boolean;
    showSelectAll?: boolean;
}

export const MultiSelect = ({
    fullWidth = true,
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
    showSelectAll = true,
    inGroup = false,
    filter = searchable,
    options,
    placeholder = 'Selecione...',
    emptyMessage = 'Nenhum resultado encontrado',
    emptyFilterMessage = 'Nenhum resultado encontrado',
    selectAll = showSelectAll,
    maxSelectedLabels = 2,
    selectedItemsLabel = '{0} itens selecionados',
    ...props
}: MultiSelectProps) => {
    const inputId = id || `multiselect-${Math.random().toString(36).substr(2, 9)}`;

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

    const multiSelectElement = (
        <PrimeMultiSelect
            inputId={inputId}
            options={options}
            onChange={handleChange}
            filter={filter}
            placeholder={placeholder}
            emptyMessage={emptyMessage}
            emptyFilterMessage={emptyFilterMessage}
            selectAll={selectAll}
            maxSelectedLabels={maxSelectedLabels}
            selectedItemsLabel={selectedItemsLabel}
            className={classNames(
                'w-full px-3 py-2 transition-colors duration-300 ease-in-out overflow-auto',
                {
                    'border-red-500': error,
                    'rounded-lg rounded-l-none': startAddon && !inGroup,
                    'rounded-lg rounded-r-none': endAddon && !inGroup,
                    'rounded-none': inGroup,
                },
                className
            )}
            panelClassName="shadow-lg border border-gray-200"
            {...props}
        />
    );

    return (
        <div className={classNames('flex flex-col gap-1 min-w-0', { 'w-full': fullWidth })}>
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
                    }
                )}
            >
                {renderAddon(startAddon, 'start')}
                {multiSelectElement}
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
