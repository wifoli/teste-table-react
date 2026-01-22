import { Editor as PrimeEditor, EditorProps as PrimeEditorProps } from 'primereact/editor';
import { classNames } from 'primereact/utils';

export interface EditorProps extends PrimeEditorProps {
  error?: boolean;
  helperText?: string;
  label?: string;
  height?: string;
}

/**
 * Editor - Editor de texto rico (WYSIWYG)
 * Use para campos que precisam de formatação de texto (negrito, itálico, listas, etc)
 * 
 * @example
 * <Editor 
 *   value={content} 
 *   onTextChange={(e) => setContent(e.htmlValue)} 
 *   style={{ height: '320px' }}
 * />
 */
export function Editor({
  error = false,
  helperText,
  label,
  height = '320px',
  style,
  className,
  ...props
}: EditorProps) {
  return (
    <div className={classNames('flex flex-col gap-1 w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <PrimeEditor
        {...props}
        style={{ height, ...style }}
        className={classNames({
          'border-red-500': error,
        })}
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
