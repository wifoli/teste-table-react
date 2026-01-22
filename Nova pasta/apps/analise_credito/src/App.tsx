import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PanelProvider, Layout as PainelLayout, PanelConfig } from "@front-engine/panel";
import { AuthProvider, ThemeProvider, ToastProvider } from "@front-engine/utils-react/contexts";
import { PermissionProvider } from "@front-engine/utils-react/permissions";
import { mapRoutes } from "@front-engine/utils-react/routes";
import { LoginPage } from "@front-engine/utils-react/components";
import { analiseCreditoRoutes } from "./routes";
import { CalculatorIcon, ChartBarIcon, ChartLineIcon, FilePlusIcon, FolderIcon, FolderPlusIcon, GavelIcon, HourglassIcon, HouseIcon, IdentificationBadgeIcon, MagnifyingGlassIcon, MoonIcon, PackageIcon, PenIcon, PlusCircleIcon, PulseIcon, SecurityCameraIcon, ShoppingCartIcon, TelevisionIcon, UserGearIcon, UserIcon, UserPlusIcon, UsersThreeIcon, WindmillIcon } from "@phosphor-icons/react";
import { ConfirmPopup } from "@front-engine/ui";


const panelConfig: PanelConfig = {
    appName: "Análise de Crédito",
    appLogo: "assets/images/logo/Logo.png",
    appLogoMarca: "assets/images/logo/Escrita.png",
    menuItems: [
        {
            path: "/",
            label: "Painel de operação",
            icon: <HouseIcon size={20} />,
        },
        {
            path: "/cooperado/search",
            label: "Consulta de Cooperado",
            icon: <MagnifyingGlassIcon size={20} />,
        },
        {
            path: "/proposta/simulator",
            label: "Simulador de Propostas",
            icon: <CalculatorIcon size={20} />,
        },
        {
            label: "Menu de Analises",
            icon: <FolderIcon size={20} />,
            items: [
                {
                    label: "Central de Análise",
                    path: "/painel-analista",
                    icon: <ChartLineIcon size={20} />,
                },
                {
                    label: "Inserção da Mesa",
                    path: "/proposta/insert",
                    icon: <FolderPlusIcon size={20} />,
                },
                {
                    label: "Cadastro de Operação",
                    path: "/proposta/create",
                    icon: <PlusCircleIcon size={20} />,
                },
                {
                    label: "Modificar Operação",
                    path: "/proposta/update",
                    icon: <PenIcon size={20} />,
                },
                {
                    label: "Controle de Tempo",
                    path: "/temporalidade/search",
                    icon: <HourglassIcon size={20} />,
                },
                {
                    label: "Histórico de Propostas",
                    path: "/proposta/history",
                    icon: <PackageIcon size={20} />,
                },
            ],
        },
        {
            label: "Central de Relatórios",
            icon: <ChartBarIcon size={20} />,
            items: [
                {
                    label: "Performance do Operador",
                    path: "/report_performance",
                    icon: <IdentificationBadgeIcon size={20} />,
                },
                {
                    label: "Performance do Setor",
                    path: "/report_setor_performance",
                    icon: <UsersThreeIcon size={20} />,
                },
                {
                    label: "Performance do PA",
                    path: "/report_pa_performance",
                    icon: <WindmillIcon size={20} />,
                },
                {
                    label: "Painel de Acompanhamento",
                    path: "/dashboard_acompanhamento",
                    icon: <TelevisionIcon size={20} />,
                },
                {
                    label: "Controle de Promessas",
                    path: "/report_promessa",
                    icon: <GavelIcon size={20} />,
                },
            ],
        },
        {
            label: "Monitor do Administrador",
            icon: <SecurityCameraIcon size={20} />,
            items: [
                {
                    label: "Catálogo de Produtos",
                    path: "/produtos",
                    icon: <ShoppingCartIcon size={20} />,
                },
                {
                    label: "Inserção de Cooperados",
                    path: "/cooperado/insert",
                    icon: <UserPlusIcon size={20} />,
                },
                {
                    label: "Processamento de Súmulas",
                    path: "/insert_sumula",
                    icon: <FilePlusIcon size={20} />,
                },
                {
                    label: "Gestão de Acessos",
                    path: "/access_management",
                    icon: <UserGearIcon size={20} />,
                }
            ],
        },
    ],

    userMenu: [
        {
            label: "",
            icon: <MoonIcon size={24}/>,
            command: () => alert("Profile clicked"),
        },
        {
            label: "Linha do Tempo",
            icon: <PulseIcon size={24} />,
            command: () => alert("Profile clicked"),
            intent: "secondary",
            className: "flex gap-2",
        },
        {
            label: "Usuário",
            icon: <UserIcon size={24} />,
            command: () => alert("Profile clicked"),
        },
    ],
    showFooter: false,
};

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider defaultTheme="light">
                <AuthProvider redirectTo="/">
                    <PermissionProvider>
                        <ConfirmPopup />
                        <ToastProvider>
                            <PanelProvider config={panelConfig}>
                                <Routes>
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route element={<PainelLayout />}>
                                        {mapRoutes(analiseCreditoRoutes)}
                                    </Route>
                                    <Route path="*" element={<> 404 - Not Found</>}></Route>
                                </Routes>
                            </PanelProvider>
                        </ToastProvider>
                    </PermissionProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
