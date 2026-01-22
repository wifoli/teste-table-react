import { usePanelContext } from "../../context";

export const Footer = () => {
    const { config } = usePanelContext();

    if (!config.showFooter) {
        return null;
    }

    const currentYear = new Date().getFullYear();
    const footerText =
        config.footerText || `© ${currentYear} ${config.appName}. All rights reserved.`;

    return (
        <footer className="panel-footer">
            <div className="px-6 py-4">
                <p className="text-sm text-orange-800 text-center">{footerText}</p>
            </div>
        </footer>
    );
};
