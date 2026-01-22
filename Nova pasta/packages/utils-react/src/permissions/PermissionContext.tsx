import { createContext, useContext, ReactNode } from "react";
import { checkPermission as checkPermissionUtil } from "./utils.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import { PermissionConfig } from "./types.ts";
import { User } from "@front-engine/api";

interface PermissionContextType {
    user: User | null;
    checkPermission: (config: PermissionConfig) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export interface PermissionProviderProps {
    children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
    const { operador } = useAuth();
    const user: User | null = operador ? operador.user : null;

    const checkPermission = (config: PermissionConfig) => {
        return checkPermissionUtil(user, config);
    };

    return (
        <PermissionContext.Provider value={{ user, checkPermission }}>
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermissionContext() {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("usePermissionContext precisa ser usado dentro de um PermissionProvider");
    }
    return context;
}
