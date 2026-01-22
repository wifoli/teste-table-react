import { z } from "zod";
import { ValidationResult } from "../types";
import { PATTERNS } from "../patterns";

/**
 * Validação de telefone (formato brasileiro)
 */
export function phone(value: string): ValidationResult {
    if (!value) {
        return { valid: true };
    }

    const cleaned = value.replace(/\D/g, "");
    const valid = (cleaned.length === 10 || cleaned.length === 11) && PATTERNS.phone.test(cleaned);

    return {
        valid,
        error: valid ? undefined : "Telefone inválido",
    };
}

/**
 * Verifica se é telefone móvel
 */
export function isMobile(value: string): boolean {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.length === 11 && cleaned.charAt(2) === "9";
}

/**
 * Zod - Schema para validação de telefone
 */
export const phoneSchema = z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine(
        (val) => {
            const cleaned = val.replace(/\D/g, "");
            return (cleaned.length === 10 || cleaned.length === 11) && PATTERNS.phone.test(cleaned);
        },
        {
            message: "Telefone inválido",
        },
    );
