import { FileUpload as PrimeFileUpload, FileUploadProps as PrimeFileUploadProps } from 'primereact/fileupload';
import { classNames } from 'primereact/utils';

export interface FileUploadProps extends Omit<PrimeFileUploadProps, 'onSelect' | 'onRemove'> {
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    onSelect?: (files: File[]) => void;
    onRemove?: (file: File) => void;
}

export const FileUpload = ({
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    onSelect,
    onRemove,
    maxFileSize = 50000000000,
    accept = '*',
    ...props
}: FileUploadProps) => {
    const inputId = id || `fileupload-${Math.random().toString(36).substr(2, 9)}`;

    const handleSelect = (e: any) => {
        if (onSelect) {
            onSelect(e.files);
        }
    };

    const handleRemove = (e: any) => {
        if (onRemove) {
            onRemove(e.file);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label 
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <PrimeFileUpload
                id={inputId}
                onSelect={handleSelect}
                onRemove={handleRemove}
                maxFileSize={maxFileSize}
                accept={accept}
                className={classNames(
                    'transition-colors duration-200',
                    {
                        'border-red-500': error,
                    },
                    className
                )}
                pt={{
                    buttonbar: {
                        className: 'p-0 bg-transparent',
                    },
                    chooseButton: {
                        className: 'focus:ring-0 bg-turquoise text-white hover:bg-turquoise-dark focus:bg-turquoise-dark',
                    },
                    content: {
                        className: 'p-0 mt-1',
                    },
                }}
                {...props}
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
