import { z } from "zod";

/**
 * Standard validation result - ALL validations return this
 * Resultado padrão de validação - TODAS as validações retornam isso
 */
export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Tipo de função de validação
 */
export type ValidatorFn = (value: any) => ValidationResult;

/**
 * Regra de validação de campo para formulários
 */
export interface FieldRule {
    validator: ValidatorFn;
    message?: string;
}

/**
 * Esquema de validação de formulário
 */
export type FormSchema = Record<string, FieldRule | FieldRule[]>;

/**
 * Erros de validação de formulário
 */
export type FormErrors = Record<string, string>;

/**
 * Helper de tipo para schema Zod
 */
export type ZodSchema<T = any> = z.ZodType<T>;
