import { z } from "zod";
import validator from "validator";
import { ValidationResult } from "../types";
import { PATTERNS } from "../patterns";

/**
 * Validação de email
 */
export function email(value: string): ValidationResult {
    if (!value) {
        return { valid: true }; // Opcional por padrão
    }

    const valid = validator.isEmail(value) && PATTERNS.email.test(value);
    return {
        valid,
        error: valid ? undefined : "Email inválido",
    };
}

/**
 * Zod - Schema de validação de email
 */
export const emailSchema = z.string().min(1, "Email é obrigatório").email("Email inválido");
