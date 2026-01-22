import { InputTextarea as PrimeInputTextarea, InputTextareaProps as PrimeInputTextareaProps } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

export interface InputTextareaProps extends PrimeInputTextareaProps {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    maxLength?: number;
    showCharCount?: boolean;
}

export const InputTextarea = ({
    fullWidth = false,
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    maxLength,
    showCharCount = false,
    value,
    ...props
}: InputTextareaProps) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const charCount = typeof value === 'string' ? value.length : 0;

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

            <PrimeInputTextarea
                {...props}
                id={inputId}
                value={value}
                maxLength={maxLength}
                className={classNames(
                    'px-3 py-2 border transition-all duration-300 ease-in-out',
                    'resize-y min-h-[80px]',
                    {
                        'w-full': fullWidth,
                        'border-red-500 focus:ring-red-500': error,
                        'border-gray-300 hover:border-gray-400': !error,
                    },
                    className
                )}
            />

            <div className="flex justify-between items-center gap-2">
                {helperText && (
                    <span className={classNames('text-sm', {
                        'text-red-500': error,
                        'text-gray-600': !error
                    })}>
                        {helperText}
                    </span>
                )}

                {showCharCount && maxLength && (
                    <span className={classNames('text-sm ml-auto', {
                        'text-red-500': charCount > maxLength,
                        'text-gray-500': charCount <= maxLength
                    })}>
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
};
