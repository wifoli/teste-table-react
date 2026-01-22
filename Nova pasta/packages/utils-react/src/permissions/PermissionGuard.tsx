import { ReactNode } from "react";
import { usePermission } from "./usePermission.ts";
import { PermissionConfig } from "./types.ts";

export interface PermissionGuardProps extends PermissionConfig {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Componente para proteger conteúdo com base em permissões/papéis
 */
export function PermissionGuard({
    children,
    permissions = [],
    roles = [],
    requireAll = false,
    fallback = null,
}: PermissionGuardProps) {
    const hasPermission = usePermission({
        permissions,
        roles,
        requireAll,
    });

    return <>{hasPermission ? children : fallback}</>;
}
