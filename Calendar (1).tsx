import { Calendar as PrimeCalendar, CalendarProps as PrimeCalendarProps } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { ReactNode, useMemo, useCallback } from 'react';

// Formatos de string suportados
export type DateStringFormat = 
    | 'iso'           // 2024-01-15T00:00:00.000Z
    | 'iso-date'      // 2024-01-15
    | 'br'            // 15/01/2024
    | 'us'            // 01/15/2024
    | 'db';           // 2024-01-15 (mesmo que iso-date, alias para clareza)

export type CalendarValueMode = 'date' | 'string';

// Props base sem os tipos conflitantes
type BaseCalendarProps = Omit<PrimeCalendarProps, 'onChange' | 'value' | 'selectionMode'>;

// Props para modo single
interface SingleModeProps {
    selectionMode?: 'single';
    value?: Date | string | null;
    onChange?: (value: Date | string | null) => void;
}

// Props para modo multiple
interface MultipleModeProps {
    selectionMode: 'multiple';
    value?: (Date | string)[] | null;
    onChange?: (value: (Date | string)[] | null) => void;
}

// Props para modo range
interface RangeModeProps {
    selectionMode: 'range';
    value?: [Date | string | null, Date | string | null] | null;
    onChange?: (value: [Date | string | null, Date | string | null] | null) => void;
}

export type CalendarProps = BaseCalendarProps & (SingleModeProps | MultipleModeProps | RangeModeProps) & {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    /**
     * Modo do valor retornado
     * - 'date': Retorna objeto Date (padrão do PrimeReact)
     * - 'string': Retorna string no formato especificado em stringFormat
     * @default 'string'
     */
    valueMode?: CalendarValueMode;
    /**
     * Formato da string quando valueMode='string'
     * - 'iso': 2024-01-15T00:00:00.000Z
     * - 'iso-date' ou 'db': 2024-01-15
     * - 'br': 15/01/2024
     * - 'us': 01/15/2024
     * @default 'iso-date'
     */
    stringFormat?: DateStringFormat;
};

// === Funções de conversão ===

function parseStringToDate(value: string | Date | null | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    
    const str = value.trim();
    if (!str) return null;

    // Tenta detectar o formato automaticamente
    let date: Date | null = null;

    // ISO format: 2024-01-15 ou 2024-01-15T00:00:00
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
        date = new Date(str);
    }
    // BR format: 15/01/2024
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [day, month, year] = str.split('/').map(Number);
        date = new Date(year, month - 1, day);
    }
    // US format: 01/15/2024 (mm/dd/yyyy)
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        const [month, day, year] = str.split('/').map(Number);
        date = new Date(year, month - 1, day);
    }
    // Fallback: tenta parse nativo
    else {
        date = new Date(str);
    }

    return date && !isNaN(date.getTime()) ? date : null;
}

function formatDateToString(date: Date | null | undefined, format: DateStringFormat): string | null {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return null;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    switch (format) {
        case 'iso':
            return date.toISOString();
        case 'iso-date':
        case 'db':
            return `${year}-${month}-${day}`;
        case 'br':
            return `${day}/${month}/${year}`;
        case 'us':
            return `${month}/${day}/${year}`;
        default:
            return `${year}-${month}-${day}`;
    }
}

// === Componente ===

export const Calendar = ({
    fullWidth = false,
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    startAddon,
    endAddon,
    onChange,
    value,
    valueMode = 'string',
    stringFormat = 'iso-date',
    dateFormat = 'dd/mm/yy',
    placeholder = 'dd/mm/aaaa',
    showIcon = true,
    selectionMode = 'single',
    ...props
}: CalendarProps) => {
    const inputId = useMemo(
        () => id || `calendar-${Math.random().toString(36).substr(2, 9)}`,
        [id]
    );

    // Converte o value de entrada para Date (que o PrimeCalendar espera)
    const internalValue = useMemo(() => {
        if (value === null || value === undefined) return null;

        if (selectionMode === 'multiple' && Array.isArray(value)) {
            return value.map(v => parseStringToDate(v as string | Date)).filter(Boolean) as Date[];
        }

        if (selectionMode === 'range' && Array.isArray(value)) {
            return [
                parseStringToDate(value[0] as string | Date | null),
                parseStringToDate(value[1] as string | Date | null),
            ] as [Date | null, Date | null];
        }

        return parseStringToDate(value as string | Date);
    }, [value, selectionMode]);

    // Handler que converte a saída conforme valueMode
    const handleChange = useCallback((e: any) => {
        if (!onChange) return;

        const rawValue = e.value;

        if (rawValue === null || rawValue === undefined) {
            onChange(null as any);
            return;
        }

        // Se valueMode é 'date', retorna como está
        if (valueMode === 'date') {
            onChange(rawValue);
            return;
        }

        // valueMode === 'string' - converter para string
        if (selectionMode === 'multiple' && Array.isArray(rawValue)) {
            const stringValues = rawValue.map(d => formatDateToString(d, stringFormat));
            onChange(stringValues as any);
            return;
        }

        if (selectionMode === 'range' && Array.isArray(rawValue)) {
            const stringValues = [
                formatDateToString(rawValue[0], stringFormat),
                formatDateToString(rawValue[1], stringFormat),
            ] as [string | null, string | null];
            onChange(stringValues as any);
            return;
        }

        // Single mode
        onChange(formatDateToString(rawValue, stringFormat) as any);
    }, [onChange, valueMode, stringFormat, selectionMode]);

    const calendarElement = (
        <PrimeCalendar
            {...props}
            inputId={inputId}
            value={internalValue}
            onChange={handleChange}
            dateFormat={dateFormat}
            placeholder={placeholder}
            showIcon={showIcon}
            selectionMode={selectionMode}
            className={classNames(
                'transition-colors duration-200',
                { 'w-full': fullWidth },
                className
            )}
            inputClassName={classNames(
                'px-3 py-2 border rounded-md transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                {
                    'w-full': fullWidth,
                    'border-red-500 focus:ring-red-500': error,
                    'border-gray-300 hover:border-gray-400': !error,
                }
            )}
        />
    );

    return (
        <div className={classNames('flex flex-col gap-1', { 'w-full': fullWidth })}>
            {label && (
                <label 
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            {(startAddon || endAddon) ? (
                <div className={classNames('flex items-center gap-2', { 'w-full': fullWidth })}>
                    {startAddon}
                    <div className="flex-1">{calendarElement}</div>
                    {endAddon}
                </div>
            ) : (
                calendarElement
            )}

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
