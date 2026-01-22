import { z } from "zod";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { ValidationResult } from "../types";

/**
 * Validação de CPF (aceita formatado ou não formatado)
 *
 */
export function cpf(value: string): ValidationResult {
    if (!value) {
        return { valid: true }; // Optional by default
    }

    const valid = cpfValidator.isValid(value);
    return {
        valid,
        error: valid ? undefined : "CPF inválido",
    };
}

/**
 * Zod - Schema de validação de CPF
 */
export const cpfSchema = z
    .string()
    .min(1, "CPF é obrigatório")
    .refine((val) => cpfValidator.isValid(val), {
        message: "CPF inválido",
    });
