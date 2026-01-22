import { z } from "zod";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import { ValidationResult } from "../types";

/**
 * Validação de CNPJ (aceita formatado ou não formatado)
 */
export function cnpj(value: string): ValidationResult {
    if (!value) {
        return { valid: true };
    }

    const valid = cnpjValidator.isValid(value);
    return {
        valid,
        error: valid ? undefined : "CNPJ inválido",
    };
}

/**
 * Zod - Schema de validação de CNPJ
 */
export const cnpjSchema = z
    .string()
    .min(1, "CNPJ é obrigatório")
    .refine((val) => cnpjValidator.isValid(val), {
        message: "CNPJ inválido",
    });
