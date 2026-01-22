import { Slider as PrimeSlider, SliderProps as PrimeSliderProps } from 'primereact/slider';
import { classNames } from 'primereact/utils';

export interface SliderProps extends Omit<PrimeSliderProps, 'onChange'> {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    onChange?: (value: number | number[]) => void;
    showValue?: boolean;
}

export const Slider = ({
    fullWidth = false,
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    onChange,
    showValue = false,
    value,
    ...props
}: SliderProps) => {
    const inputId = id || `slider-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.value);
        }
    };

    return (
        <div className={classNames('flex flex-col gap-2', { 'w-full': fullWidth })}>
            {(label || showValue) && (
                <div className="flex justify-between items-center">
                    {label && (
                        <label 
                            htmlFor={inputId}
                            className="block text-sm font-medium text-gray-700"
                        >
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )}
                    {showValue && (
                        <span className="text-sm font-medium text-gray-900">
                            {Array.isArray(value) ? value.join(' - ') : value}
                        </span>
                    )}
                </div>
            )}
            
            <PrimeSlider
                {...props}
                id={inputId}
                value={value}
                onChange={handleChange}
                className={classNames(
                    'transition-colors duration-200',
                    {
                        'w-full': fullWidth,
                    },
                    className
                )}
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
};
