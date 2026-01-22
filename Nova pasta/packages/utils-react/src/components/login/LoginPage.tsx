import { LoginView } from "./LoginView";
import { useLoginPage } from "./useLoginPage";

export function LoginPage() {
    const vm = useLoginPage();
    return <LoginView {...vm} />;
}
