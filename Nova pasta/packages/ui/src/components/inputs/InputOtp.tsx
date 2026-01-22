import { InputOtp as PrimeInputOtp, InputOtpProps as PrimeInputOtpProps } from 'primereact/inputotp';
import { classNames } from 'primereact/utils';

export interface InputOtpProps extends PrimeInputOtpProps {
  error?: boolean;
  helperText?: string;
  label?: string;
}

/**
 * InputOtp - Input para códigos OTP (One-Time Password)
 * Use para autenticação de dois fatores, verificação de código, etc
 */
export function InputOtp({
  error = false,
  helperText,
  label,
  className,
  ...props
}: InputOtpProps) {
  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <PrimeInputOtp
        {...props}
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
