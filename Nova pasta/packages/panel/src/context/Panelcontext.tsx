import { createContext, useContext, useState } from "react";
import { PanelContextType, PanelProviderProps } from "../types";

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelProvider = ({
    children,
    config,
    defaultSidebarCollapsed = true,
}: PanelProviderProps) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultSidebarCollapsed);

    const toggleSidebar = () => {
        setSidebarCollapsed((prev) => !prev);
    };

    return (
        <PanelContext.Provider
            value={{
                sidebarCollapsed,
                toggleSidebar,
                setSidebarCollapsed,
                config,
            }}
        >
            {children}
        </PanelContext.Provider>
    );
};

export const usePanelContext = () => {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error("usePanelContext must be used within PanelProvider");
    }
    return context;
};
