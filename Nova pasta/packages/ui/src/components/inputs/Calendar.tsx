import { Calendar as PrimeCalendar, CalendarProps as PrimeCalendarProps } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import React, { ReactElement, ReactNode } from 'react';

export interface CalendarProps extends Omit<PrimeCalendarProps, 'onChange'> {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    inGroup?: boolean;
    onChange?: (date: Date | Date[] | null) => void;
}

export const Calendar = ({
    fullWidth = false,
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    startAddon,
    endAddon,
    inGroup,
    onChange,
    dateFormat = 'dd/mm/yy',
    placeholder = 'dd/mm/aaaa',
    showIcon = true,
    ...props
}: CalendarProps) => {
    const inputId = id || `calendar-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.value);
        }
    };

    const calendarElement = (
        <PrimeCalendar
            {...props}
            inputId={inputId}
            onChange={handleChange}
            dateFormat={dateFormat}
            placeholder={placeholder}
            showIcon={showIcon}
            className={classNames(
                'transition-colors duration-200',
                {
                    'w-full': fullWidth,
                },
                className
            )}
            inputClassName={classNames(
                'ring-turquiose px-3 py-2 transition-colors duration-150 ease-out outline-none border-0 w-full overflow-ellipsis',
                {
                    'rounded-lg rounded-l-none': startAddon && !inGroup,
                    'rounded-lg rounded-r-none': endAddon && !inGroup,
                    'rounded-none': inGroup,
                }
            )}
        />
    );

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
                {calendarElement}
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
