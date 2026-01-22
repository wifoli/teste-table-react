import { CascadeSelect as PrimeCascadeSelect, CascadeSelectProps as PrimeCascadeSelectProps } from 'primereact/cascadeselect';
import { classNames } from 'primereact/utils';

export interface CascadeSelectProps extends PrimeCascadeSelectProps {
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
}

/**
 * CascadeSelect - Seleção hierárquica em cascata
 * Use para selecionar valores em estruturas hierárquicas (ex: País > Estado > Cidade)
 */
export function CascadeSelect({
  fullWidth = false,
  error = false,
  helperText,
  label,
  className,
  ...props
}: CascadeSelectProps) {
  return (
    <div className={classNames('flex flex-col gap-1', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <PrimeCascadeSelect
        {...props}
        className={classNames(
          'transition-colors duration-200',
          {
            'w-full': fullWidth,
            'border-red-500': error,
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
}
