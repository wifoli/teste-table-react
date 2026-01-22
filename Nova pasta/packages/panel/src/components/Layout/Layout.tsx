import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import { usePanelContext } from "../../context";
import { classNames } from "primereact/utils";
import { Content } from "./Content";


export const Layout = () => {
    const { sidebarCollapsed } = usePanelContext();

    return (
        <div className="min-h-screen bg-sicoob-1 bg-center bg-repeat bg-white/80 bg-blend-lighten">
            <Sidebar />

            <div
                className={classNames("flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.45,0.05,0.55,0.95)]",
                    {"ml-16": sidebarCollapsed, "ml-64": !sidebarCollapsed,}
                )}
            >
                    <Header className="bg-transparent m-6 mb-3 p-0" />
                    <Content className="flex-1 overflow-visible m-6 mt-3" />
            </div>
        </div>
    );
};
