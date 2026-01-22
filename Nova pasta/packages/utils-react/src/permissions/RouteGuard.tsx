import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts";

export const RouteGuard: React.FC<{ redirectTo?: string }> = ({ redirectTo = "/login" }) => {
    const { operador, isLoading } = useAuth();

    if (isLoading) {
        return <div>Carregando...</div>;
    }

    if (!operador) {
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};
