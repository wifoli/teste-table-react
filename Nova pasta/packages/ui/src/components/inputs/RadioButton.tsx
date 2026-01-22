import { RadioButton as PrimeRadioButton, RadioButtonProps as PrimeRadioButtonProps } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';

export interface RadioButtonProps extends Omit<PrimeRadioButtonProps, 'onChange'> {
    label?: string;
    helperText?: string;
    error?: boolean;
    onChange?: (value: any) => void;
}

export const RadioButton = ({
    label,
    helperText,
    error = false,
    className,
    id,
    onChange,
    ...props
}: RadioButtonProps) => {
    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.value);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <PrimeRadioButton
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

// RadioGroup helper component
export interface RadioGroupOption {
    label: string;
    value: any;
    disabled?: boolean;
}

export interface RadioGroupProps {
    name: string;
    options: RadioGroupOption[];
    value: any;
    onChange: (value: any) => void;
    label?: string;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    direction?: 'vertical' | 'horizontal';
}

export const RadioGroup = ({
    name,
    options,
    value,
    onChange,
    label,
    required = false,
    error = false,
    helperText,
    direction = 'vertical'
}: RadioGroupProps) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className={classNames('flex gap-4', {
                'flex-col': direction === 'vertical',
                'flex-row flex-wrap': direction === 'horizontal'
            })}>
                {options.map((option, index) => (
                    <RadioButton
                        key={index}
                        name={name}
                        value={option.value}
                        label={option.label}
                        checked={value === option.value}
                        disabled={option.disabled}
                        onChange={onChange}
                    />
                ))}
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
