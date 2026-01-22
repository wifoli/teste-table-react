import { z } from "zod";
import { ValidationResult } from "../types";
import { PATTERNS } from "../patterns";

/**
 * Validation for password strength
 * regex obriga: mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número
 */
export function password(value: string): ValidationResult {
    if (!value) {
        return { valid: true };
    }

    const valid = PATTERNS.password.test(value);
    return {
        valid,
        error: valid
            ? undefined
            : "Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número",
    };
}

/**
 * Validação de senha forte (inclui caractere especial)
 * regex obriga: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial
 */
export function strongPassword(value: string): ValidationResult {
    if (!value) {
        return { valid: true };
    }

    const valid = PATTERNS.passwordStrong.test(value);
    return {
        valid,
        error: valid
            ? undefined
            : "Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial",
    };
}

/**
 * Obter força da senha
 */
export function getPasswordStrength(value: string): "weak" | "medium" | "strong" {
    if (!value) return "weak";

    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^a-zA-Z0-9]/.test(value);
    const isLongEnough = value.length >= 8;

    const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;

    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
}

/**
 * Zod - Schema para validação de senha forte
 */
export const passwordSchema = z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter número");

/**
 * Zod - Schema para validação de senha forte
 */
export const strongPasswordSchema = z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter número")
    .regex(/[^a-zA-Z0-9]/, "Senha deve conter caractere especial");
