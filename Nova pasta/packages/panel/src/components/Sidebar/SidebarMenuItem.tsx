import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { PanelMenu } from "./PanelMenu";
import type { MenuItem } from "../../types";
import type { MenuItem as PrimeMenuItem } from "primereact/menuitem";
import { CaretDownIcon } from "@phosphor-icons/react";

interface Props {
    item: MenuItem;
    collapsed: boolean;
}

export const SidebarMenuItem = ({ item, collapsed }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [expanded, setExpanded] = React.useState(false);

    React.useEffect(() => {
        if (collapsed) {
            setExpanded(false);
        }
    }, [collapsed]);


    const isActive = (path?: string) =>
        !!path && location.pathname === path;

    const renderMenuItem = (
        label: string,
        icon?: MenuItem["icon"],
        active?: boolean,
        onClick?: () => void,
        title?: string,
        extraClass?: string,
        showCaret?: boolean,
        expanded?: boolean
    ) => (
        <div
            className={classNames(
                "menu-item flex gap-2 cursor-pointer",
                {
                    active,
                    collapsed,
                },
                extraClass
            )}
            onClick={onClick}
            title={title}
            data-pc-section="headercontent"
        >
            {icon && (
                <div className="menu-item-icon" data-pc-section="headericon">
                    {typeof icon === "string" ? <i className={icon} /> : icon}
                </div>
            )}

            <span
                data-pc-section="headerlabel"
                className={classNames(
                    "menu-item-text flex flex-1 flex-row transition-all duration-300 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]",
                    {
                        "max-w-[240px] opacity-100 gap-2": !collapsed,
                        "max-w-0 opacity-0 gap-0": collapsed,
                    }
                )}

            >
                <span className="truncate flex-1">
                    {label}
                </span>
                {showCaret && (
                    <span
                        className={classNames(
                            "menu-item-icon transition-all duration-300 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]",
                            {
                                "opacity-100": !collapsed,
                                "opacity-0": collapsed,
                            }
                        )}
                        data-pc-section="expandicon"
                    >
                        <CaretDownIcon
                            size={16}
                            weight="fill"
                            className={classNames(
                                "transition-all duration-300 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]",
                                expanded && "rotate-180"
                            )}
                        />
                    </span>
                )}
            </span>


        </div>
    );

    if (!item.items || item.items.length === 0) {
        return renderMenuItem(
            item.label ?? "",
            item.icon,
            isActive(item.path),
            () => {
                item.command?.();
                if (item.path) navigate(item.path);
            },
            collapsed ? item.label : undefined
        );
    }

    const panelModel: PrimeMenuItem[] = item.items.map((child) => ({
        label: child.label,
        icon: child.icon,
        command: () => {
            child.command?.();
            if (child.path) navigate(child.path);
        },
        template: () =>
            renderMenuItem(
                child.label ?? "",
                child.icon,
                isActive(child.path),
                undefined,
                collapsed ? child.label : undefined
            ),
    }));

    return (
        <PanelMenu
            className="w-full bg-transparent border-none text-white"
            model={[
                {
                    label: item.label ?? "",
                    items: panelModel,
                    expanded,
                    template: () =>
                        renderMenuItem(
                            item.label ?? "",
                            item.icon,
                            false,
                            () => setExpanded(prev => !prev),
                            collapsed ? item.label : undefined,
                            undefined,
                            true,
                            expanded
                        ),
                },
            ]}
        />
    );
};
