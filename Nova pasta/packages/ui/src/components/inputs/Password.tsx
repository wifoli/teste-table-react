import { Password as PrimePassword, PasswordProps as PrimePasswordProps } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { ChangeEventHandler, ReactNode } from 'react';

export interface PasswordProps extends Omit<PrimePasswordProps, 'onChange'> {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
    showStrengthMeter?: boolean;
}

export const Password = ({
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
    showStrengthMeter = true,
    feedback = showStrengthMeter,
    toggleMask = true,
    ...props
}: PasswordProps) => {
    const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const inputElement = (
        <PrimePassword
            {...props}
            inputId={inputId}
            onChange={handleChange}
            feedback={feedback}
            toggleMask={toggleMask}
            className={classNames(
                'w-full',
                className
            )}
            inputClassName={classNames(
                'px-3 py-2 border rounded-md transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                {
                    'w-full': fullWidth,
                    'border-red-500 focus:ring-red-500': error,
                    'border-gray-300 hover:border-gray-400': !error,
                }
            )}
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
            
            {(startAddon || endAddon) ? (
                <div className={classNames('flex items-center gap-2', { 'w-full': fullWidth })}>
                    {startAddon}
                    <div className="flex-1">
                        {inputElement}
                    </div>
                    {endAddon}
                </div>
            ) : (
                inputElement
            )}

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
