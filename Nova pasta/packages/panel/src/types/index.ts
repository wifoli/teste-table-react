import { ReactNode } from "react";


export interface MenuItem {
    label?: string;
    icon?: ReactNode;
    path?: string;
    items?: MenuItem[];
    intent?: "primary" | "secondary" | "tertiary" | "danger";
    className?: string;
    expanded?: boolean;
    command?: () => void;
}

export interface PanelConfig {
    appName?: string;
    appLogo?: string;
    appLogoMarca?: string;
    menuItems: MenuItem[];
    userMenu?: MenuItem[];
    showFooter?: boolean;
    footerText?: string;
}

export interface PanelContextType {
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    config: PanelConfig;
}

export interface PanelProviderProps {
    children: ReactNode;
    config: PanelConfig;
    defaultSidebarCollapsed?: boolean;
}
