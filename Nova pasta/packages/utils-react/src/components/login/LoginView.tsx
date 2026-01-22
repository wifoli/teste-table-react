import { Alert, Container, InputText, VStack } from "@front-engine/ui";
import { LoginViewProps } from "./types";
import { getFriendlyMessage, LoginForm } from "@front-engine/api";
import { FormField } from "../FormField";

export function LoginView(props: LoginViewProps) {
    const { form, isLoading, apiError, handleSubmit, viewAlert, setViewAlertFalse } = props;

    return (
        <Container maxWidth="full">
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form
                    className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <VStack spacing={4} className="mb-6">
                        <h1>Login</h1>

                        <div>
                            <label className="font-app block mb-1 text-sm font-medium">
                                Usuário
                            </label>
                            <FormField<LoginForm> name="username" form={form}>
                                {({ value, onChange, onBlur, name, error }) => (
                                    <InputText
                                        name={name}
                                        type="text"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        error={Boolean(error)}
                                    />
                                )}
                            </FormField>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Senha</label>
                            <FormField<LoginForm> name="password" form={form}>
                                {({ value, onChange, onBlur, name, error }) => (
                                    <InputText
                                        name={name}
                                        type="password"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        error={Boolean(error)}
                                    />
                                )}
                            </FormField>
                        </div>

                        {viewAlert && (
                            <Alert severity="error" onClose={setViewAlertFalse}>
                                {getFriendlyMessage(apiError)}
                            </Alert>
                        )}
                    </VStack>

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={isLoading || form.isSubmitting}
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading || form.isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </Container>
    );
}
