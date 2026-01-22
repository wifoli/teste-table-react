import { format, formatDistance, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata a data com o padrão especificado.
 */
export function date(date: Date | string, pattern: string = "dd/MM/yyyy"): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(dateObj)) {
        return "Data inválida";
    }

    return format(dateObj, pattern, { locale: ptBR });
}

/**
 * Formata a data e hora
 */
export function datetime(date: Date | string): string {
    return format(typeof date === "string" ? parseISO(date) : date, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
    });
}

/**
 * Formata somente a hora
 */
export function time(date: Date | string): string {
    return format(typeof date === "string" ? parseISO(date) : date, "HH:mm", { locale: ptBR });
}

/**
 * Formata o tempo relativo (ex: "há 2 dias")
 */
export function relative(date: Date | string): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;

    if (!isValid(dateObj)) {
        return "Data inválida";
    }

    return formatDistance(dateObj, new Date(), {
        addSuffix: true,
        locale: ptBR,
    });
}
