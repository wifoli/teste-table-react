import { ReactNode } from "react";
import { Card } from "./cards/Card";
import { Button } from "./buttons/Button";
import { VStack } from "./layouts/Stack";

export interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: string;
    };
    children?: ReactNode;
}

/**
 * EmptyState component for empty data scenarios
 */
export function EmptyState({
    icon = "pi pi-inbox",
    title,
    description,
    action,
    children,
}: EmptyStateProps) {
    return (
        <Card className="!p-12">
            <VStack spacing={4} align="center">
                <i className={`${icon} text-6xl text-gray-400`}></i>

                <VStack spacing={2} align="center">
                    <h4>{title}</h4>
                        
                    

                    {description && (
                        <h2>
                            {description}
                        </h2>
                    )}
                </VStack>

                {action && (
                    <Button
                        label={action.label}
                        icon={action.icon}
                        onClick={action.onClick}
                        intent="primary"
                    />
                )}

                {children}
            </VStack>
        </Card>
    );
}
