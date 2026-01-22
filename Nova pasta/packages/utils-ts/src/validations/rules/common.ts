import { ValidationResult } from "../types";
import { PATTERNS } from "../patterns";
import { cpf } from "./cpf";
import { cnpj } from "./cnpj";

/**
 * Validação de campo obrigatório
 */
export function required(value: any): ValidationResult {
    const str = value === null || value === undefined ? "" : String(value);
    const valid = str.trim() !== "";

    return {
        valid,
        error: valid ? undefined : "Campo obrigatório",
    };
}

/**
 * Validação de tamanho mínimo
 */
export function minLength(min: number) {
    return (value: string): ValidationResult => {
        const str = value === null || value === undefined ? "" : String(value);
        if (str.trim() === "") {
            return { valid: true };
        }
        const valid = str.length >= min;
        return {
            valid,
            error: valid ? undefined : `Mínimo de ${min} caracteres`,
        };
    };
}

/**
 * Validação de tamanho máximo
 */
export function maxLength(max: number) {
    return (value: string): ValidationResult => {
        const valid = !value || value.length <= max;
        return {
            valid,
            error: valid ? undefined : `Máximo de ${max} caracteres`,
        };
    };
}

/**
 * Validação de valor mínimo (números)
 */
export function min(minValue: number) {
    return (value: number): ValidationResult => {
        const valid = value >= minValue;
        return {
            valid,
            error: valid ? undefined : `Valor mínimo é ${minValue}`,
        };
    };
}

/**
 * Validação de valor máximo (números)
 */
export function max(maxValue: number) {
    return (value: number): ValidationResult => {
        const valid = value <= maxValue;
        return {
            valid,
            error: valid ? undefined : `Valor máximo é ${maxValue}`,
        };
    };
}

/**
 * Validação por padrão (regex)
 */
export function pattern(regex: RegExp, message: string = "Formato inválido") {
    return (value: string): ValidationResult => {
        const valid = !value || regex.test(value);
        return {
            valid,
            error: valid ? undefined : message,
        };
    };
}

/**
 * Validação de apenas letras
 */
export function onlyLetters(value: string): ValidationResult {
    const valid = !value || PATTERNS.onlyLetters.test(value);
    return {
        valid,
        error: valid ? undefined : "Apenas letras são permitidas",
    };
}

/**
 * Validação de apenas números
 */
export function onlyNumbers(value: string): ValidationResult {
    const valid = !value || PATTERNS.onlyNumbers.test(value);
    return {
        valid,
        error: valid ? undefined : "Apenas números são permitidos",
    };
}

/**
 * Validação alfanumérica
 */
export function alphanumeric(value: string): ValidationResult {
    const valid = !value || PATTERNS.alphanumeric.test(value);
    return {
        valid,
        error: valid ? undefined : "Apenas letras e números são permitidos",
    };
}

/**
 * Igual a outro campo (para confirmação de senha)
 */
export function equalTo(otherValue: any, fieldName: string = "campo") {
    return (value: any): ValidationResult => {
        const valid = value === otherValue;
        return {
            valid,
            error: valid ? undefined : `Deve ser igual ao ${fieldName}`,
        };
    };
}

/**
 * Um dos valores (enum)
 */
export function oneOf(values: any[]) {
    return (value: any): ValidationResult => {
        const valid = values.includes(value);
        return {
            valid,
            error: valid ? undefined : "Valor inválido",
        };
    };
}

/**
 * Precisa ser do tipo
 * ex de uso : isType("string"), isType("number")
 */
export function isType<T extends string | number>(allowedValues: T[]) {
    return (value: any): ValidationResult => {
        const valid = allowedValues.includes(value);
        return {
            valid,
            error: valid ? undefined : `Deve ser um dos valores: ${allowedValues.join(", ")}`,
        };
    };
}

/**
 * CPF ou CNPJ
 */
export function cpfCnpj(value: any): ValidationResult {
    const str = String(value) ? String(value).replace(/\D/g, '') : '';
    const isCpf = str.length === 11;
    const isCnpj = str.length === 14;

    if (!isCpf && !isCnpj) {
        return {
            valid: false,
            error: "Deve ser um CPF ou CNPJ válido",
        };
    }

    return isCpf ? cpf(str) : cnpj(str);

}

/**
 * Valida se um valor é um valor monetário válido
 * Aceita formatos como:
 * "100", "100.00", "1.000,50", "R$ 1.234,56", "$1000.00"
 */
export function isMoney(value: any): ValidationResult {
  if (typeof value !== "string" && typeof value !== "number") {
    return { valid: false, error: "Deve ser um número ou string" };
  }

  const str = String(value).trim();

  const moneyRegex = PATTERNS.moneyRegex;

  const valid = moneyRegex.test(str);

  return {
    valid,
    error: valid ? undefined : "Deve ser um valor monetário válido",
  };
}