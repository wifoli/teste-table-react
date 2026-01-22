import { Checkbox as PrimeCheckbox, CheckboxProps as PrimeCheckboxProps } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

export interface CheckboxProps extends Omit<PrimeCheckboxProps, 'onChange'> {
    label?: string;
    helperText?: string;
    error?: boolean;
    onChange?: (checked: boolean) => void;
}

export const Checkbox = ({
    label,
    helperText,
    error = false,
    className,
    id,
    onChange,
    ...props
}: CheckboxProps) => {
    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.checked);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <PrimeCheckbox
                    {...props}
                    inputId={inputId}
                    onChange={handleChange}
                    className={classNames(
                        'transition-colors duration-200',
                        className
                    )}
                />
                {label && (
                    <label 
                        htmlFor={inputId}
                        className="text-sm text-gray-700 cursor-pointer select-none"
                    >
                        {label}
                    </label>
                )}
            </div>
            
            {helperText && (
                <span className={classNames('text-sm ml-6', {
                    'text-red-500': error,
                    'text-gray-600': !error
                })}>
                    {helperText}
                </span>
            )}
        </div>
    );
};
