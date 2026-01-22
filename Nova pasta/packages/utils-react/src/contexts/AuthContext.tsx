import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import {
    loadingStateManager,
    Operador,
    AUTH_LOADING_KEYS,
    LoginForm,
    authService,
} from "@front-engine/api";
import { requestCancellation, UNAUTHORIZED_EVENT_NAME } from "@front-engine/api";
import { useNavigate } from "react-router-dom";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthContextType {
    operador: Operador | null;
    isAuthenticated: boolean;
    status: AuthStatus;
    isLoading: boolean;
    login: (credentials: LoginForm) => Promise<void>;
    loginFromOperador: (operador: Operador) => void;
    logout: () => Promise<void>;
    fetchCurrent: () => Promise<void>;
    updateOperador: (operador: Partial<Operador>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
    children: ReactNode;
    initialOperador?: Operador | null;
    redirectTo?: string;
    loginPath?: string;
}

export function AuthProvider({ 
    children, 
    initialOperador = null, 
    redirectTo = "/",
    loginPath = "/login"
 }: AuthProviderProps) {
    const navigate = useNavigate();

    const [operador, setOperador] = useState<Operador | null>(initialOperador);
    const [status, setStatus] = useState<AuthStatus>(initialOperador ? "authenticated" : "idle");
    const [isLoading, setIsLoading] = useState(false);

    const setOperadorSafe = useCallback((op: Operador | null) => {
        setOperador(op);
        setStatus(op ? "authenticated" : "unauthenticated");
    }, []);

    const fetchCurrent = useCallback(async () => {
        const key = AUTH_LOADING_KEYS.CURRENT;
        const controller = requestCancellation.createController(key);

        try {
            loadingStateManager.startLoading(key);
            setStatus("loading");

            const op = await authService.getCurrentOperador({ signal: controller.signal });
            setOperadorSafe(op);
        } catch (err: any) {
            if (!requestCancellation.isCancelled(err)) {
                setOperadorSafe(null);
            }
        } finally {
            loadingStateManager.stopLoading(key);
            requestCancellation.remove(key);
        }
    }, [setOperadorSafe]);

    const login = useCallback(
        async (credentials: LoginForm) => {
            const key = AUTH_LOADING_KEYS.LOGIN;
            const controller = requestCancellation.createController(key);

            try {
                loadingStateManager.startLoading(key);
                setStatus("loading");

                const response = await authService.login(credentials, {
                    signal: controller.signal,
                });
                const operadorFromResponse: Operador =
                    (response as any).operador ?? (response as any).user ?? response;

                setOperadorSafe(operadorFromResponse);

                navigate(redirectTo, { replace: true });
            } finally {
                loadingStateManager.stopLoading(key);
                requestCancellation.remove(key);
            }
        },
        [fetchCurrent, setOperadorSafe],
    );

    const loginFromOperador = useCallback(
        (op: Operador) => {
            setOperadorSafe(op);
        },
        [setOperadorSafe],
    );

    const logout = useCallback(async () => {
        const key = AUTH_LOADING_KEYS.LOGOUT;
        const controller = requestCancellation.createController(key);

        try {
            loadingStateManager.startLoading(key);
            await authService.logout({ signal: controller.signal });
            setOperadorSafe(null);
        } finally {
            loadingStateManager.stopLoading(key);
            requestCancellation.remove(key);
        }
    }, [setOperadorSafe]);

    const updateOperador = useCallback((updates: Partial<Operador>) => {
        setOperador((prev) => (prev ? { ...prev, ...updates } : null));
    }, []);

    useEffect(() => {
        function handleStateChange() {
            const loginState = loadingStateManager.getState(AUTH_LOADING_KEYS.LOGIN);
            const currentState = loadingStateManager.getState(AUTH_LOADING_KEYS.CURRENT);
            const logoutState = loadingStateManager.getState(AUTH_LOADING_KEYS.LOGOUT);

            setIsLoading(
                !!(loginState?.isLoading || currentState?.isLoading || logoutState?.isLoading),
            );
        }

        const unsubLogin = loadingStateManager.subscribe(
            AUTH_LOADING_KEYS.LOGIN,
            handleStateChange,
        );
        const unsubCurrent = loadingStateManager.subscribe(
            AUTH_LOADING_KEYS.CURRENT,
            handleStateChange,
        );
        const unsubLogout = loadingStateManager.subscribe(
            AUTH_LOADING_KEYS.LOGOUT,
            handleStateChange,
        );

        handleStateChange();

        return () => {
            unsubLogin();
            unsubCurrent();
            unsubLogout();
        };
    }, []);

    useEffect(() => {
        if (!initialOperador) fetchCurrent();
    }, [initialOperador, fetchCurrent]);

    useEffect(() => {
        function handleUnauthorized() {
            setOperadorSafe(null);
            navigate(loginPath, { replace: true });
        }

        window.addEventListener(UNAUTHORIZED_EVENT_NAME, handleUnauthorized);

        return () => {
            window.removeEventListener(UNAUTHORIZED_EVENT_NAME, handleUnauthorized);
        };
    }, [logout]);

    return (
        <AuthContext.Provider
            value={{
                operador,
                isAuthenticated: !!operador,
                status,
                isLoading,
                login,
                loginFromOperador,
                logout,
                fetchCurrent,
                updateOperador,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
    }
    return context;
}
