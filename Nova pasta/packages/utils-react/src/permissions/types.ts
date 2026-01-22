import { Role, Permission } from "@front-engine/api";

export interface PermissionConfig {
    roles?: Role[];
    permissions?: Permission[];
    requireAll?: boolean; // true = AND, false = OR
}
