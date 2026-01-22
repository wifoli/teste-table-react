import { InputSwitch as PrimeInputSwitch, InputSwitchProps as PrimeInputSwitchProps } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';

export interface InputSwitchProps extends Omit<PrimeInputSwitchProps, 'onChange'> {
    label?: string;
    helperText?: string;
    error?: boolean;
    onChange?: (checked: boolean) => void;
    labelPosition?: 'left' | 'right';
}

export const InputSwitch = ({
    label,
    helperText,
    error = false,
    className,
    id,
    onChange,
    labelPosition = 'right',
    ...props
}: InputSwitchProps) => {
    const inputId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.value);
        }
    };

    const switchElement = (
        <PrimeInputSwitch
            {...props}
            inputId={inputId}
            onChange={handleChange}
            className={classNames(
                'transition-colors duration-200',
                className
            )}
        />
    );

    const labelElement = label && (
        <label 
            htmlFor={inputId}
            className="text-sm text-gray-700 cursor-pointer select-none"
        >
            {label}
        </label>
    );

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
                {labelPosition === 'left' && labelElement}
                {switchElement}
                {labelPosition === 'right' && labelElement}
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
