import { MultiStateCheckbox as PrimeMultiStateCheckbox, MultiStateCheckboxProps as PrimeMultiStateCheckboxProps, MultiStateCheckboxChangeEvent } from 'primereact/multistatecheckbox';
import { classNames } from 'primereact/utils';

export interface MultiStateCheckboxOption {
    value: any;
    icon?: string;
    style?: React.CSSProperties;
    className?: string;
}

export interface MultiStateCheckboxProps extends Omit<PrimeMultiStateCheckboxProps, 'options'> {
    options: MultiStateCheckboxOption[];
    value?: any;
    onChange?: (e: MultiStateCheckboxChangeEvent) => void;
    optionValue?: string;
    empty?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    className?: string;
}

/**
 * MultiStateCheckbox - Checkbox com múltiplos estados
 * Use para toggles com mais de 2 estados (ex: yes/no/maybe)
 */
export function MultiStateCheckbox({
    options,
    value,
    onChange,
    optionValue = 'value',
    empty = true,
    error = false,
    helperText,
    label,
    className,
    ...props
}: MultiStateCheckboxProps) {
    return (
        <div className={classNames('flex flex-col gap-1', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <PrimeMultiStateCheckbox
                value={value}
                onChange={onChange}
                options={options}
                optionValue={optionValue}
                empty={empty}
                className={classNames({
                    'border-red-500': error,
                    'border-gray-300 hover:border-gray-400': !error
                })}
                {...props}
            />

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
}
