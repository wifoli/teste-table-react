// src/routes/renderRoutes.tsx
import { Route } from "react-router-dom";
import React from "react";
import { AppRoute } from "./types";
import { RouteGuard } from "../permissions";
import { PermissionGuard } from "../permissions";

export function mapRoutes(routes: AppRoute[]): React.ReactElement[] {
    return routes.map((r) => {
        const { path, element, children, private: isPrivate, permissions, roles, requireAll } = r;

        // embrulha o element com PermissionGuard se houver config
        let wrappedElement = element ?? <></>;
        if ((permissions && permissions.length > 0) || (roles && roles.length > 0)) {
            wrappedElement = (
                <PermissionGuard permissions={permissions} roles={roles} requireAll={requireAll}>
                    {wrappedElement}
                </PermissionGuard>
            );
        }

        // se não é rota privada -> cria <Route path element> normalmente (com children recursivos)
        if (!isPrivate) {
            return (
                <Route key={path} path={path} element={wrappedElement}>
                    {children && mapRoutes(children)}
                </Route>
            );
        }

        // rota privada: usamos RouteGuard como wrapper (Outlet), e colocamos a rota "real" como child
        return (
            <Route key={path} element={<RouteGuard />}>
                <Route path={path} element={wrappedElement}>
                    {children && mapRoutes(children)}
                </Route>
            </Route>
        );
    });
}
