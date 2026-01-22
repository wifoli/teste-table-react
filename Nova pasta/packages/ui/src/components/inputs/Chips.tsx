import { Chips as PrimeChips, ChipsProps as PrimeChipsProps } from 'primereact/chips';
import { classNames } from 'primereact/utils';

export interface ChipsProps extends PrimeChipsProps {
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
}

/**
 * Chips - Input de múltiplos valores (tags)
 * Use para entrada de múltiplos valores como tags, emails, etc
 */
export function Chips({
  fullWidth = false,
  error = false,
  helperText,
  label,
  className,
  ...props
}: ChipsProps) {
  return (
    <div className={classNames('flex flex-col gap-1', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <PrimeChips
        {...props}
        className={classNames(
          'transition-colors duration-200',
          {
            'w-full': fullWidth,
          },
          className
        )}
        pt={{
          root: {
            className: classNames({
              'border-red-500': error,
            })
          }
        }}
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
}
