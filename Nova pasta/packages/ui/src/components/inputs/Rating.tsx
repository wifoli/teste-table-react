import { Rating as PrimeRating, RatingProps as PrimeRatingProps } from 'primereact/rating';
import { classNames } from 'primereact/utils';

export interface RatingProps extends Omit<PrimeRatingProps, 'onChange'> {
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    onChange?: (value: number) => void;
    showValue?: boolean;
}

export const Rating = ({
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    onChange,
    showValue = false,
    value,
    stars = 5,
    ...props
}: RatingProps) => {
    const inputId = id || `rating-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: any) => {
        if (onChange) {
            onChange(e.value);
        }
    };

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
                    {showValue && value !== null && value !== undefined && (
                        <span className="text-sm font-medium text-gray-900">
                            {value}/{stars}
                        </span>
                    )}
                </div>
            )}
            
            <PrimeRating
                {...props}
                id={inputId}
                value={value}
                stars={stars}
                onChange={handleChange}
                className={classNames(
                    'transition-colors duration-200',
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
