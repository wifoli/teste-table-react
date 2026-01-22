import { TreeSelect as PrimeTreeSelect, TreeSelectProps as PrimeTreeSelectProps } from 'primereact/treeselect';
import { classNames } from 'primereact/utils';

export interface TreeSelectProps extends PrimeTreeSelectProps {
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
}

/**
 * TreeSelect - Seleção em árvore hierárquica
 * Use para selecionar valores em estruturas de árvore (categorias, departamentos, etc)
 */
export function TreeSelect({
  fullWidth = false,
  error = false,
  helperText,
  label,
  className,
  ...props
}: TreeSelectProps) {
  return (
    <div className={classNames('flex flex-col gap-1', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <PrimeTreeSelect
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
