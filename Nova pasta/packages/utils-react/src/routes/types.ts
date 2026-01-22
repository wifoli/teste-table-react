import React from "react";
import { PermissionConfig } from "../permissions";

export type AppRoute = {
    path: string;
    element?: React.ReactElement;
    children?: AppRoute[];
    private?: boolean;
} & PermissionConfig;
