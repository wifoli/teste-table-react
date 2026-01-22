import { ListBox as PrimeListBox, ListBoxProps as PrimeListBoxProps } from 'primereact/listbox';
import { classNames } from 'primereact/utils';

export interface ListBoxProps extends PrimeListBoxProps {
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
}

/**
 * ListBox - Lista de opções selecionáveis
 * Use para seleção de itens em uma lista visível (alternativa ao Select)
 * 
 * @example
 * const cities = [
 *   { name: 'São Paulo', code: 'SP' },
 *   { name: 'Rio de Janeiro', code: 'RJ' },
 * ];
 * <ListBox 
 *   value={selectedCity} 
 *   options={cities} 
 *   onChange={(e) => setSelectedCity(e.value)} 
 *   optionLabel="name"
 *   multiple
 *   filter
 * />
 */
export function ListBox({
  fullWidth = false,
  error = false,
  helperText,
  label,
  className,
  ...props
}: ListBoxProps) {
  return (
    <div className={classNames('flex flex-col gap-1', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <PrimeListBox
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
