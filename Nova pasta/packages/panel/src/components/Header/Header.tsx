import { GhostButton } from "@front-engine/ui";
import { usePanelContext } from "../../context";
import { Menubar } from "primereact/menubar";
import { List } from "@phosphor-icons/react";
import { classNames } from "primereact/utils";


interface HeaderProps {
    className?: string;
}

export const Header = ({ className }: HeaderProps) => {
    const { toggleSidebar, config } = usePanelContext();

    return (
        <Menubar
            className={className}
            pt={{
                root: { className: "rounded-none" },
                start: { className: "flex items-center gap-3" },
                end: { className: "flex items-center gap-3" },
            }}
            start={
                <div className="flex items-center">
                    <GhostButton
                        intent="secondary"
                        size="small"
                        icon={<List size={24} />}
                        onClick={toggleSidebar}
                        text
                        aria-label="Toggle sidebar"
                        gap={0}
                    />
                </div>
            }
            end={
                <div className="flex items-center gap-2">
                    {config.userMenu?.map((item, index) => (
                        <GhostButton
                            key={index}
                            intent={item.intent || "primary"}
                            onClick={item.command}
                            text
                            size="small"
                            aria-label={item.label || "User menu item"}
                        >
                            <span className={classNames(
                                "grid grid-flow-col items-center",
                                item.label ? "gap-2" : "",
                            )}>
                                {item.icon}
                                {item.label}
                            </span>
                        </GhostButton>
                    ))}
                </div>
            }
        />
    );
};
