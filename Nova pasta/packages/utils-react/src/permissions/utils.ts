import { PermissionConfig } from "./types.ts";
import { Role, Permission, User } from "@front-engine/api";

/**
 * Verifica se o usuário tem permissão com base nas roles e permissions fornecidas.
 */
export function checkPermission(user: User | null, config: PermissionConfig): boolean {
    if (!user) return false;

    const { roles = [], permissions = [], requireAll = false } = config;

    const hasRole = requireAll
        ? roles.every((role) => user.roles.includes(role))
        : roles.some((role) => user.roles.includes(role));

    const hasPermission = requireAll
        ? permissions.every((perm) => user.permissions.includes(perm))
        : permissions.some((perm) => user.permissions.includes(perm));

    if (roles.length > 0 && permissions.length > 0) {
        return requireAll ? hasRole && hasPermission : hasRole || hasPermission;
    }

    if (roles.length > 0) return hasRole;

    if (permissions.length > 0) return hasPermission;

    return false;
}

/**
 * Verifica se o usuário tem algum dos papéis/funções (roles)
 */
export function hasRole(user: User | null, ...roles: Role[]): boolean {
    if (!user) return false;
    return roles.some((role) => user.roles.includes(role));
}

/**
 * Verifica se o usuário tem todos os papéis/funções (roles)
 */
export function hasAllRoles(user: User | null, ...roles: Role[]): boolean {
    if (!user) return false;
    return roles.every((role) => user.roles.includes(role));
}

/**
 * Verifica se o usuário tem alguma das permissões
 */
export function hasPermission(user: User | null, ...permissions: Permission[]): boolean {
    if (!user) return false;
    return permissions.some((perm) => user.permissions.includes(perm));
}

/**
 * Verifica se o usuário tem todas as permissões
 */
export function hasAllPermissions(user: User | null, ...permissions: Permission[]): boolean {
    if (!user) return false;
    return permissions.every((perm) => user.permissions.includes(perm));
}
