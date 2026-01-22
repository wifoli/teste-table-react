import { Toast as PrimeToast } from "primereact/toast";
import { useRef, createContext, useContext, ReactNode } from "react";

interface ToastContextType {
    showToast: (options: ToastOptions) => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
}

interface ToastOptions {
    severity?: "success" | "info" | "warn" | "error";
    summary?: string;
    detail?: string;
    life?: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const toastRef = useRef<PrimeToast>(null);

    const showToast = (options: ToastOptions) => {
        toastRef.current?.show({
            severity: options.severity || "info",
            summary: options.summary,
            detail: options.detail,
            life: options.life || 3000,
        });
    };

    const showSuccess = (message: string, title: string = "Sucesso") => {
        showToast({ severity: "success", summary: title, detail: message });
    };

    const showError = (message: string, title: string = "Erro") => {
        showToast({ severity: "error", summary: title, detail: message });
    };

    const showWarning = (message: string, title: string = "Atenção") => {
        showToast({ severity: "warn", summary: title, detail: message });
    };

    const showInfo = (message: string, title: string = "Informação") => {
        showToast({ severity: "info", summary: title, detail: message });
    };

    return (
        <ToastContext.Provider
            value={{
                showToast,
                showSuccess,
                showError,
                showWarning,
                showInfo,
            }}
        >
            <PrimeToast ref={toastRef} />
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast precisa ser usado dentro de um ToastProvider");
    }
    return context;
}
