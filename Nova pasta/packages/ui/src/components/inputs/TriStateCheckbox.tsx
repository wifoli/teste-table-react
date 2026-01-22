import { TriStateCheckbox as PrimeTriStateCheckbox, TriStateCheckboxProps as PrimeTriStateCheckboxProps } from 'primereact/tristatecheckbox';
import { classNames } from 'primereact/utils';

export interface TriStateCheckboxProps extends PrimeTriStateCheckboxProps {
  error?: boolean;
  helperText?: string;
  label?: string;
  className?: string;
}

/**
 * TriStateCheckbox - Checkbox com 3 estados (true/false/null)
 * Use quando precisar de checked, unchecked e indeterminate
 * 
 * @example
 * <TriStateCheckbox 
 *   value={value} 
 *   onChange={(e) => setValue(e.value)}
 *   label="Accept terms"
 * />
 */
export function TriStateCheckbox({
  error = false,
  helperText,
  label,
  className,
  ...props
}: TriStateCheckboxProps) {
  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <PrimeTriStateCheckbox
          {...props}
          className={classNames({
            'border-red-500': error,
          })}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
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
}
