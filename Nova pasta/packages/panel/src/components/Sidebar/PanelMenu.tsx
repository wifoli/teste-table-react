import {
    PanelMenu as PrimePanelMenu,
    PanelMenuProps as PrimePanelMenuProps,
} from "primereact/panelmenu";
import { classNames } from "primereact/utils";

export const PanelMenu = ({ className, ...props }: PrimePanelMenuProps) => {
    return (
        <PrimePanelMenu
            {...props}
            pt={{
                panel: {
                    className: "bg-fade-black card-shadow-inner rounded-lg m-0",
                },

                header: {
                    className: "bg-transparent rounded-lg",
                },

                headerAction: {
                    className: "text-white",
                },

                headerContent: {
                    className: "bg-transparent font-app",
                },

                headerLabel: {
                    className: "text-white font-medium",
                },

                headerSubmenuIcon: {
                    className: "text-white font-medium",
                },

                menuContent: {
                    className: "bg-transparent p-0 ",
                },

                collapseIcon: {
                    className: "text-white",
                },

                expandIcon: {
                    className: "text-white",
                },

            }}
            className={
                classNames("bg-transparent border-none", className)
            }
        />
    );
};
