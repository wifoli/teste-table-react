import { LoginForm } from "@front-engine/api";
import { UseFormResult } from "../../hooks";

export type LoginViewProps = {
    form: UseFormResult<LoginForm>;
    isLoading: boolean;
    apiError?: any;
    viewAlert?: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setViewAlertFalse: () => void;
};
