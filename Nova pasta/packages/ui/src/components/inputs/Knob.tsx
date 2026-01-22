import { Knob as PrimeKnob, KnobProps as PrimeKnobProps } from 'primereact/knob';
import { classNames } from 'primereact/utils';

export interface KnobProps extends PrimeKnobProps {
  label?: string;
  helperText?: string;
}

/**
 * Knob - Controle circular de valor
 * Use para ajustes de valores numéricos de forma visual (volume, temperatura, etc)
 */
export function Knob({
  label,
  helperText,
  className,
  ...props
}: KnobProps) {
  return (
    <div className={classNames('flex flex-col items-center gap-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <PrimeKnob {...props} />

      {helperText && (
        <span className="text-sm text-gray-600 text-center">
          {helperText}
        </span>
      )}
    </div>
  );
}
