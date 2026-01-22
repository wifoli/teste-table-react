import { ButtonGradient, FileUpload, FormActions, FormCol, FormLayout, VStack } from "@front-engine/ui";
import { SimuladorPropostaFirstStepperProps } from "./types";

export const SimuladorPropostaFirstStepper: React.FC<SimuladorPropostaFirstStepperProps> = ({
    submitSumula, isSubmitting, setSumulaEstudoFile
}) => {
    return (
        <VStack>
            <FormLayout responsive={false} columns={1} gap={3}>
                <FormCol span={1}>
                    <FileUpload 
                        chooseLabel="Súmula de Estudo" 
                        label="Súmula" 
                        onSelect={(files: File[]) => setSumulaEstudoFile(files[0])}
                        accept='application/pdf'
                    />
                </FormCol>
            </FormLayout>

            <FormActions className="w-full" align="right" >
                <ButtonGradient
                    icon="pi pi-angle-double-right"
                    iconPos="right"
                    label="Submeter Súmula"
                    onClick={submitSumula}
                    loading={isSubmitting}
                />
            </FormActions>
        </VStack>
    );
}