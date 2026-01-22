import {
    AutoCompleteChangeEvent,
    AutoCompleteCompleteEvent,
    AutoComplete as PrimeAutoComplete,
    AutoCompleteProps as PrimeAutoCompleteProps
} from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';
import React, { ReactNode, useState, useCallback, useRef, ReactElement } from 'react';

export interface AutoCompleteOption {
    label: string;
    value: any;
}

export interface AutoCompleteProps extends Omit<
    PrimeAutoCompleteProps,
    'onChange' | 'suggestions' | 'completeMethod' | 'onSelect' | 'value'
> {
    fullWidth?: boolean;
    error?: boolean;
    helperText?: string;
    label?: string;
    required?: boolean;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    inGroup?: boolean;
    
    /**
     * O valor selecionado (objeto AutoCompleteOption ou null)
     */
    value?: AutoCompleteOption | null;
    
    /**
     * Callback quando um item é selecionado
     */
    onChange?: (value: AutoCompleteOption | null) => void;
    
    /**
     * Callback adicional quando um item é selecionado (útil para efeitos colaterais)
     */
    onSelect?: (value: AutoCompleteOption) => void;
    
    /**
     * Callback quando o campo é limpo
     */
    onClear?: () => void;
    
    // Busca local
    options?: AutoCompleteOption[];
    
    // Busca em API
    onSearch?: (query: string) => Promise<AutoCompleteOption[]>;
    
    minSearchLength?: number;
    searchDelay?: number;
    
    /**
     * Se true, força a seleção de um item válido da lista
     * Se false, permite texto livre
     * @default false
     */
    forceSelection?: boolean;
}

export const AutoComplete = ({
    fullWidth = false,
    error = false,
    helperText,
    label,
    required = false,
    className,
    id,
    startAddon,
    endAddon,
    value,
    onChange,
    onSelect,
    onClear,
    options = [],
    onSearch,
    minSearchLength = 1,
    searchDelay = 300,
    placeholder = 'Buscar...',
    emptyMessage = 'Nenhum resultado encontrado',
    forceSelection = false,
    disabled = false,
    inGroup = false,
    ...props
}: AutoCompleteProps) => {
    const inputId = id || `autocomplete-${Math.random().toString(36).substr(2, 9)}`;
    
    // Estado interno para as sugestões
    const [suggestions, setSuggestions] = useState<AutoCompleteOption[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Estado interno para o texto de input (permite digitação livre)
    const [inputValue, setInputValue] = useState<string | AutoCompleteOption | null>(
        value || ''
    );
    
    // Ref para controlar debounce da busca
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Manipula mudanças no input
     * - Durante digitação: e.value é string
     * - Após seleção: e.value é AutoCompleteOption
     */
    const handleChange = useCallback((e: AutoCompleteChangeEvent) => {
        const newValue = e.value;
        
        // Atualiza o estado interno do input
        setInputValue(newValue);
        
        // Se o valor for um objeto (seleção), notifica o onChange
        if (newValue && typeof newValue === 'object' && 'label' in newValue && 'value' in newValue) {
            onChange?.(newValue as AutoCompleteOption);
            onSelect?.(newValue as AutoCompleteOption);
        }
        // Se for string vazia ou null, limpa a seleção
        else if (newValue === '' || newValue === null) {
            onChange?.(null);
            onClear?.();
        }
        // Se for string (digitação) e não forçamos seleção, podemos opcionalmente notificar
        // mas NÃO limpamos o valor selecionado anterior
    }, [onChange, onSelect, onClear]);

    /**
     * Manipula a seleção de um item da lista de sugestões
     */
    const handleSelect = useCallback((e: { value: AutoCompleteOption }) => {
        setInputValue(e.value);
        onChange?.(e.value);
        onSelect?.(e.value);
    }, [onChange, onSelect]);

    /**
     * Manipula o clear do campo (botão X ou tecla Escape)
     */
    const handleClear = useCallback(() => {
        setInputValue('');
        setSuggestions([]);
        onChange?.(null);
        onClear?.();
    }, [onChange, onClear]);

    /**
     * Executa a busca de sugestões
     */
    const search = useCallback(async (event: AutoCompleteCompleteEvent) => {
        const query = event.query || '';

        // Cancela busca anterior se houver
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Verifica tamanho mínimo
        if (query.length < minSearchLength) {
            setSuggestions([]);
            return;
        }

        // Se busca em API é fornecida
        if (onSearch) {
            setLoading(true);
            try {
                const results = await onSearch(query);
                setSuggestions(results);
            } catch (error) {
                console.error('AutoComplete search error:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        } else {
            // Filtro local
            const filtered = options.filter(option =>
                option.label.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered);
        }
    }, [onSearch, options, minSearchLength]);

    /**
     * Manipula blur do campo
     * Se forceSelection está ativo e o valor não é um objeto válido, limpa
     */
    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        if (forceSelection) {
            // Se inputValue é string (não selecionou nada), limpa
            if (typeof inputValue === 'string') {
                // Verifica se existe uma opção exata
                const exactMatch = suggestions.find(
                    opt => opt.label.toLowerCase() === inputValue.toLowerCase()
                );
                
                if (exactMatch) {
                    setInputValue(exactMatch);
                    onChange?.(exactMatch);
                } else {
                    setInputValue(value || '');
                }
            }
        }
        
        // Chama onBlur original se existir
        props.onBlur?.(e);
    }, [forceSelection, inputValue, suggestions, value, onChange, props.onBlur]);

    // Sincroniza com valor externo quando muda
    // useEffect foi removido para evitar loops - o PrimeReact gerencia isso internamente

    const autoCompleteElement = (
        <PrimeAutoComplete
            {...props}
            inputId={inputId}
            value={inputValue}
            onChange={handleChange}
            onSelect={handleSelect}
            onClear={handleClear}
            onBlur={handleBlur}
            suggestions={suggestions}
            completeMethod={search}
            field="label"
            forceSelection={forceSelection}
            placeholder={placeholder}
            emptyMessage={loading ? 'Buscando...' : emptyMessage}
            delay={searchDelay}
            disabled={disabled}
            dropdown={props.dropdown}
            className={classNames(
                'transition-colors duration-200',
                { 'w-full': fullWidth },
                className
            )}
            inputClassName={classNames(
                'px-3 py-2 transition-colors duration-200 overflow-ellipsis',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                {
                    'w-full': fullWidth,
                }
            )}
            panelClassName="shadow-lg border border-gray-200 bg-white"
        />
    );

    const renderAddon = (addon?: ReactNode, position: 'start' | 'end' = 'start') => {
        if (!addon) return null;

        const baseClasses = classNames(
            'flex items-center justify-center bg-gray-100 text-gray-700 p-2 h-full',
            {
                'rounded-l-lg border-r border-gray-300': position === 'start',
                'rounded-r-lg border-l border-gray-300': position === 'end',
            }
        );

        if (React.isValidElement(addon)) {
            return (
                <span className={baseClasses}>
                    {React.cloneElement(addon as ReactElement<any>, {
                        className: classNames(
                            (addon as ReactElement<any>).props.className
                        ),
                    })}
                </span>
            );
        }

        return <span className={baseClasses}>{addon}</span>;
    };

    return (
        <div className={classNames('flex flex-col gap-1 overflow-ellipsis', { 'w-full': fullWidth })}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div
                className={classNames(
                    'flex items-stretch min-w-0 transition-colors w-full overflow-ellipsis',
                    !inGroup && 'border border-gray-300 rounded-lg',
                    {
                        'w-full': fullWidth,
                        'border-red-500 ring-1 ring-red-500': error,
                        'border-gray-300': !error,
                    }
                )}
            >
                {renderAddon(startAddon, 'start')}
                {autoCompleteElement}
                {renderAddon(endAddon, 'end')}
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
};
