import { usePermissionContext } from "./PermissionContext.tsx";
import { PermissionConfig } from "./types.ts";
import { Role, Permission } from "@front-engine/api";

/**
 * Hook para verificar permissões
 */
export function usePermission(config: PermissionConfig): boolean {
    const { checkPermission } = usePermissionContext();
    return checkPermission(config);
}

/**
 * Hook para verificar se o usuário tem alguma papel/função (role)
 */
export function useHasRole(...roles: Role[]): boolean {
    const { user } = usePermissionContext();
    if (!user) return false;
    return roles.some((role) => user.roles.includes(role));
}

/**
 * Hook para verificar se o usuário tem alguma permissão
 */
export function useHasPermission(...permissions: Permission[]): boolean {
    const { user } = usePermissionContext();
    if (!user) return false;
    return permissions.some((perm) => user.permissions.includes(perm));
}

/**
 * Hook para obter o usuário atual
 */
export function useCurrentUser() {
    const { user } = usePermissionContext();
    return user;
}
