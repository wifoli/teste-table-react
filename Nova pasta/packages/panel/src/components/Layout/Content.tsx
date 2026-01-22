import { Outlet } from "react-router-dom";

interface ContentOutletProps {
    className?: string;
}

export const Content = ({ className }: ContentOutletProps) => {
    return (
        <div className={className}>
            <Outlet />
        </div>
    );
};
