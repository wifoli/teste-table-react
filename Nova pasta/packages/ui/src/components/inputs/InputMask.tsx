import { InputMask as PrimeInputMask, InputMaskProps as PrimeInputMaskProps } from 'primereact/inputmask';
import { classNames } from 'primereact/utils';
import React, { ReactNode, ReactElement } from 'react';

export interface InputMaskProps extends Omit<PrimeInputMaskProps, 'onChange'> {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    inGroup?: boolean;
    onChange?: (value: string) => void;
}

export const InputMask = ({
    fullWidth = false,
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    startAddon,
    endAddon,
    inGroup = false,
    onChange,
    ...props
}: InputMaskProps) => {
    const inputId = id || `input-mask-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        onChange?.(e.value ?? '');
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

    const inputElement = (
        <PrimeInputMask
            {...props}
            id={inputId}
            onChange={handleChange}
            onComplete={(e) => onChange?.(e.value ?? '')}
            className={classNames(
                'px-3 py-2 transition-colors rounded-lg overflow-ellipsis duration-150 ease-out flex-1 min-w-0 outline-none border-0',
                {
                    'w-full': fullWidth,
                    'rounded-lg rounded-l-none': startAddon && !inGroup,
                    'rounded-lg rounded-r-none': endAddon && !inGroup,
                    'rounded-none': inGroup,
                },
                className
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
                {inputElement}
                {renderAddon(endAddon, 'end')}
            </div>

            {helperText && (
                <span
                    className={classNames('text-sm', {
                        'text-red-500': error,
                        'text-gray-600': !error,
                    })}
                >
                    {helperText}
                </span>
            )}
        </div>
    );
};

export const MaskPresets = {
    CPF: '999.999.999-99',
    CNPJ: '99.999.999/9999-99',
    PHONE: '(99) 99999-9999',
    PHONE_FIXED: '(99) 9999-9999',
    CEP: '99999-999',
    DATE: '99/99/9999',
    TIME: '99:99',
    CREDIT_CARD: '9999 9999 9999 9999',
    CVV: '999',
} as const;
