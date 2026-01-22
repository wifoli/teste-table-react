import { classNames } from "primereact/utils";
import { usePanelContext } from "../../context";
import { SidebarMenuItem } from "./SidebarMenuItem";

export const Sidebar = () => {
    const { sidebarCollapsed, config } = usePanelContext();

    return (
        <aside
            className={classNames("panel-sidebar", {
                expanded: !sidebarCollapsed,
                collapsed: sidebarCollapsed,
            })}
        >
            <nav className="h-full py-4 px-2 overflow-y-auto gap-4 flex flex-col">
                <div className="flex justify-center h-[44px] overflow-hidden">
                    <img
                        src={config.appLogo}
                        alt={config.appName || "App Logo"}
                        className="w-[36px] h-[32px]"
                    />
                    <img
                        src={config.appLogoMarca}
                        className={classNames(
                            "mt-[5px] h-[39px] transition-all duration-300 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]",
                            {
                                "opacity-100 translate-x-0 w-[108px]": !sidebarCollapsed,
                                "opacity-0 -translate-x-4 w-0": sidebarCollapsed,
                            }
                        )}
                    />
                </div>
                <div className="separator" content="separator">
                    <hr />
                </div>
                <div className="flex flex-col gap-1">
                    {config.menuItems.map((item, index) => (
                        <SidebarMenuItem
                            key={index}
                            item={item}
                            collapsed={sidebarCollapsed}
                            
                        />
                    ))}
                </div>
            </nav>
        </aside>
    );
};
