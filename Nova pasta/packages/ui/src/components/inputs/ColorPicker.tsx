import { ColorPickerHSBType, ColorPickerRGBType, ColorPicker as PrimeColorPicker, ColorPickerProps as PrimeColorPickerProps } from 'primereact/colorpicker';
import { classNames } from 'primereact/utils';

export interface ColorPickerProps extends Omit<PrimeColorPickerProps, 'onChange'> {
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    onChange?: (value: string) => void;
    showValue?: boolean;
}

function formatColorValue(
    value: string | ColorPickerRGBType | ColorPickerHSBType | undefined,
    format: 'hex' | 'rgb' | 'hsb'
): string | null {
    if (!value) return null;

    if (typeof value === 'string') {
        return value;
    }

    if (format === 'rgb' && 'r' in value) {
        return `rgb(${value.r}, ${value.g}, ${value.b})`;
    }

    if (format === 'hsb' && 'h' in value) {
        return `hsb(${value.h}, ${value.s}, ${value.b})`;
    }

    return null;
}


export const ColorPicker = ({
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    onChange,
    showValue = false,
    value,
    format = 'hex',
    ...props
}: ColorPickerProps) => {
    const inputId = id || `colorpicker-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.value);
        }
    };

    const displayValue = showValue
        ? formatColorValue(value, format)
        : null;


    return (
        <div className="flex flex-col gap-2">
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
                    {showValue && value && (
                        <span className="text-sm font-medium text-gray-900 font-mono">
                            {displayValue}
                        </span>
                    )}
                </div>
            )}

            <div className="flex items-center gap-2">
                <PrimeColorPicker
                    {...props}
                    inputId={inputId}
                    value={value}
                    format={format}
                    onChange={handleChange}
                    className={classNames(
                        'transition-colors duration-200',
                        className
                    )}
                />
                {value && (
                    <div
                        className="w-10 h-10 rounded border border-gray-300"
                        style={{ backgroundColor: `#${value}` }}
                    />
                )}
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
